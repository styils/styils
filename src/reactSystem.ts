import * as React from 'react'
import { createBaseSystem } from './baseSystem'
import { BaseTag, SystemExtractElement, SystemOptions, TargetInfo } from './baseSystemTypes'
import type { Styled } from './reactSystemTypes'
import { AnyObject } from './types'

export function createSystem<Theme = {}>(options: SystemOptions<Theme> = {}) {
  const systemContext = React.createContext<{
    mode: string
    setMode: React.Dispatch<React.SetStateAction<string>>
    theme: Theme
  }>(
    // @ts-expect-error no value initially
    {}
  )

  const useSystem = () => React.useContext(systemContext)

  const SystemProvider =
    (
      state: { mode: string; theme: Theme },
      onUpdate: (updateState: { mode: string; theme: Theme }) => void
    ) =>
    (props: { children: React.ReactNode }) => {
      const [mode, setMode] = React.useState<string>(state.mode)

      const updataMode = (value: string) => {
        onUpdate({ mode: value, theme: options.theme(value) })
        setMode(value)
      }

      return React.createElement(
        systemContext.Provider,
        { value: { mode, setMode: updataMode, theme: state.theme } },
        props.children
      )
    }

  const styledComponent = (
    inputTag: BaseTag,
    computedVariants: (value: AnyObject) => string,
    computedVars: (value: AnyObject) => AnyObject,
    targetInfo: TargetInfo
  ) =>
    React.forwardRef<HTMLElement, AnyObject>((props, ref) => {
      const { as = inputTag, className, variants, vars, style, ...rest } = props

      const variantsClasses = React.useMemo(() => computedVariants(variants), [variants])
      const varsStyle = React.useMemo(() => computedVars(vars), [vars])

      return React.createElement(as, {
        className: `${className ? className + ' ' : ''}${
          targetInfo.targetClassName
        }${variantsClasses}`,
        style: { ...varsStyle, ...style },
        ref,
        ...rest
      })
    })

  const extractElement = ({
    metaSelectorCacheId,
    selectorCacheString,
    globalStyleSSRId,
    ssrGlobalData,
    styleSSRId,
    ssrData,
    metaMode,
    devIdent
  }: SystemExtractElement) =>
    React.createElement(
      React.Fragment,
      null,
      React.createElement('meta', {
        name: 'styils-cache',
        id: metaSelectorCacheId,
        mode: metaMode,
        content: selectorCacheString
      }),
      ...(process.env.NODE_ENV !== 'production'
        ? [
            ...ssrGlobalData.map((data) =>
              React.createElement('style', {
                [devIdent]: globalStyleSSRId,
                dangerouslySetInnerHTML: { __html: data }
              })
            ),
            ...ssrData.map((data) =>
              React.createElement('style', {
                [devIdent]: styleSSRId,
                dangerouslySetInnerHTML: { __html: data }
              })
            )
          ]
        : [
            React.createElement('style', {
              id: globalStyleSSRId,
              dangerouslySetInnerHTML: { __html: ssrGlobalData.join('') }
            }),
            React.createElement('style', {
              id: styleSSRId,
              dangerouslySetInnerHTML: { __html: ssrData.join('') }
            })
          ])
    )

  return {
    ...createBaseSystem<Styled<Theme>, Theme, typeof extractElement, typeof SystemProvider>(
      options,
      SystemProvider,
      styledComponent,
      extractElement
    ),
    useSystem,
    systemContext
  }
}

export const { styled, createExtracts, flush, createGlobal, keyframes, systemContext } =
  createSystem()
