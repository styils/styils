import * as React from 'react'
import { createBaseSystem } from './baseSystem'
import { BaseTag, SystemExtractElement, SystemOptions, TargetInfo } from './baseSystemTypes'
import type { Styled } from './reactSystemTypes'
import { AnyObject } from './types'

export function createSystem<Theme = {}>(options: SystemOptions<Theme> = {}) {
  const themeContent = React.createContext<{
    mode: string
    setMode: React.Dispatch<React.SetStateAction<string>>
    theme: Theme
  }>(
    // @ts-expect-error no value initially
    {}
  )

  const useSystem = () => React.useContext(themeContent)

  const SystemProvider =
    (providerOptions: { mode: string; theme: Theme }) => (props: { children: React.ReactNode }) => {
      const [mode, setMode] = React.useState<string>(providerOptions.mode)

      const updataMode = (value: string) => {
        providerOptions.theme = options.theme(value)
        providerOptions.mode = value
        setMode(value)
      }

      return React.createElement(
        themeContent.Provider,
        { value: { mode, setMode: updataMode, theme: providerOptions.theme } },
        props.children
      )
    }

  const styledComponent = (
    inputTag: BaseTag,
    createRule: () => void,
    computedVariants: (value: AnyObject) => string,
    computedVars: (value: AnyObject) => AnyObject,
    targetInfo: TargetInfo
  ) =>
    React.forwardRef<HTMLElement, AnyObject>((props, ref) => {
      const { as = inputTag, className, variants, vars, style, ...rest } = props
      const { mode } = useSystem()

      if (mode !== undefined) {
        createRule()
      }

      return React.createElement(as, {
        className: `${className ? className + ' ' : ''}${
          targetInfo.targetClassName
        }${computedVariants(variants)}`,
        style: { ...computedVars(vars), ...style },
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
    metaMode
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
      React.createElement('style', {
        id: globalStyleSSRId,
        dangerouslySetInnerHTML: { __html: ssrGlobalData }
      }),
      React.createElement('style', {
        id: styleSSRId,
        dangerouslySetInnerHTML: { __html: ssrData }
      })
    )

  return {
    ...createBaseSystem<Styled<Theme>, Theme, typeof extractElement, typeof SystemProvider>(
      options,
      SystemProvider,
      styledComponent,
      extractElement
    ),
    useSystem
  }
}

export const { styled, createExtracts, flush, createGlobal, keyframes } = createSystem()
