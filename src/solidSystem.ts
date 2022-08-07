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
  createEffect,
  on
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { createBaseSystem } from './baseSystem'
import type { ExtractElement, Provider, Styled, UseSystem } from './solidSystemTypes'
import type { BaseTag, SystemExtractElement, SystemOptions, TargetInfo } from './baseSystemTypes'
import type { AnyObject } from './types'

export function createSystem<Theme = {}>(options: SystemOptions<Theme> = {}) {
  const themeContent = createContext<ReturnType<UseSystem<Theme>>>(
    // @ts-expect-error no value initially
    {}
  )

  const useSystem: UseSystem<Theme> = () => useContext(themeContent)

  const SystemProvider =
    (providerOptions: { mode: string; theme: AnyObject }) => (props: { children: JSX.Element }) => {
      const [change, setChange] = createSignal(true)
      const [mode, setMode] = createSignal(providerOptions.mode)
      const [theme, setTheme] = createSignal(providerOptions.theme)

      const updataMode = (value: string) => {
        providerOptions.theme = options.theme(value)
        providerOptions.mode = value
        setChange(!change())
      }

      createEffect(
        on(change, () => {
          setMode(providerOptions.mode)
          setTheme(providerOptions.theme)
        })
      )

      return createComponent(themeContent.Provider, {
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
    (inputTag: BaseTag, createRule: (value: TargetInfo) => void, targetInfo: TargetInfo) =>
    (inputProps: AnyObject) => {
      const [props, rest] = splitProps(mergeProps({ as: inputTag, class: '' }, inputProps), [
        'as',
        'class',
        'variants',
        'children'
      ])

      const { mode } = useSystem()

      const classes = createMemo(() => {
        if (mode?.() !== undefined) {
          createRule(targetInfo)
        }

        let variantsClassName = ''

        if (props.variants) {
          const variantsPropsKeys = Object.keys(props.variants)
          let variantsPropsIndex = variantsPropsKeys.length

          while (variantsPropsIndex--) {
            const key = variantsPropsKeys[variantsPropsIndex]
            const value = props.variants[key]

            if (value !== undefined && value !== null) {
              variantsClassName = ` ${targetInfo.namespaceJoiner}${key}-${value}`
            }
          }
        }

        return Dynamic({
          class: `${props.class ? props.class + ' ' : props.class}${
            targetInfo.targetClassName
          }${variantsClassName}`,
          children: props.children,
          component: props.as,
          ...rest
        })
      })

      return classes
    }

  const extractElement = ({
    metaSelectorCacheId,
    selectorCacheString,
    globalStyleSSRId,
    ssrGlobalData,
    styleSSRId,
    ssrData,
    metaMode
  }: SystemExtractElement) => [
    Dynamic({
      component: 'meta',
      id: metaSelectorCacheId,
      name: 'styils-cache',
      mode: metaMode,
      content: selectorCacheString
    }),
    Dynamic({
      component: 'style',
      id: globalStyleSSRId,
      children: ssrGlobalData
    }),
    Dynamic({
      component: 'style',
      id: styleSSRId,
      children: ssrData
    })
  ]

  // Need to create a type and specify it, otherwise the type will be lost
  return {
    ...createBaseSystem<
      Styled<Theme>,
      Theme,
      (props: SystemExtractElement) => ExtractElement,
      (providerOptions: { mode: string; theme: AnyObject }) => Provider
    >(options, SystemProvider, styledComponent, extractElement),
    useSystem
  }
}

export const { styled, createExtracts, flush, global, keyframes } = createSystem()
