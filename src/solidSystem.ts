/* @jsxImportSource solid-js */
import {
  type JSX,
  createContext,
  createSignal,
  createComponent,
  useContext,
  splitProps,
  mergeProps,
  createMemo,
  batch
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { createBaseSystem } from './baseSystem'
import type { Styled, UseSystem } from './solidSystemTypes'
import type { BaseTag, SystemExtractElement, SystemOptions, TargetInfo } from './baseSystemTypes'
import type { AnyObject } from './types'

export function createSystem<Theme = {}>(options: SystemOptions<Theme> = {}) {
  const systemContext = createContext<ReturnType<UseSystem<Theme>>>(
    // @ts-expect-error no value initially
    {}
  )

  const useSystem: UseSystem<Theme> = () => useContext(systemContext)

  const SystemProvider =
    (
      state: { mode: string; theme: AnyObject },
      onUpdate: (updateState: { mode: string; theme: AnyObject }) => void
    ) =>
    (props: { children: JSX.Element }) => {
      const [mode, setMode] = createSignal(state.mode)
      const [theme, setTheme] = createSignal(state.theme)

      const updataMode = (value: string) => {
        onUpdate({ mode: value, theme: options.theme(value) })

        batch(() => {
          setMode(state.mode)
          setTheme(state.theme)
        })
      }

      return createComponent(systemContext.Provider, {
        value: {
          theme,
          setMode: updataMode,
          mode
        },
        get children() {
          return props.children
        }
      })
    }

  const styledComponent =
    (
      inputTag: BaseTag,
      computedVariants: (value: AnyObject) => string,
      computedVars: (value: AnyObject) => AnyObject,
      targetInfo: TargetInfo
    ) =>
    (inputProps: AnyObject) => {
      const [props, rest] = splitProps(mergeProps({ as: inputTag }, inputProps), [
        'as',
        'class',
        'variants',
        'vars',
        'style'
      ])

      const { mode } = useSystem()

      const userStyles = createMemo(() => ({
        classes: computedVariants(props.variants),
        style: computedVars(props.vars)
      }))

      const targetStyles = createMemo(() => ({
        mode: mode?.(),
        classes: targetInfo.targetClassName
      }))

      return Dynamic({
        get component() {
          return props.as
        },
        get class() {
          return `${props.class ? props.class + ' ' : ''}${targetStyles().classes}${
            userStyles().classes
          }`
        },
        get style() {
          return { ...userStyles().style, ...props.style }
        },
        ...rest
      })
    }

  const extractElement = ({
    metaSelectorCacheId,
    selectorCacheString,
    globalStyleSSRId,
    ssrGlobalData,
    styleSSRId,
    ssrData,
    metaMode,
    devIdent
  }: SystemExtractElement) => {
    const element = [
      Dynamic({
        component: 'meta',
        id: metaSelectorCacheId,
        name: 'styils-cache',
        // @ts-expect-error Custom properties
        mode: metaMode,
        content: selectorCacheString
      })
    ]

    if (process.env.NODE_ENV !== 'production') {
      element.push(
        ...ssrGlobalData.map((data) =>
          Dynamic({
            component: 'style',
            [devIdent]: globalStyleSSRId,
            children: data
          })
        ),
        ...ssrData.map((data) =>
          Dynamic({
            component: 'style',
            [devIdent]: styleSSRId,
            children: data
          })
        )
      )
    } else {
      element.push(
        Dynamic({
          component: 'style',
          id: globalStyleSSRId,
          children: ssrGlobalData.join('')
        }),
        Dynamic({
          component: 'style',
          id: styleSSRId,
          children: ssrData.join('')
        })
      )
    }

    return element
  }

  // Need to create a type and specify it, otherwise the type will be lost
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
