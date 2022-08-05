/* @jsxImportSource solid-js */

import {
  createContext,
  createSignal,
  createComponent,
  Accessor,
  useContext,
  splitProps,
  mergeProps,
  JSX,
  createMemo
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { createBaseSystem } from './baseSystem'
import { BaseTag, SystemExtractElement, TargetInfo } from './baseSystemTypes'
import { SystemOptions, Styled } from './solidSystemTypes'

export function createSystem<Theme = {}>(options: SystemOptions<Theme> = {}) {
  const themeContent = createContext<{
    mode: Accessor<string>
    setMode: any
    theme: Theme
  }>(
    // @ts-expect-error no value initially
    {}
  )

  const useSystem = () => useContext(themeContent)

  const SystemProvider =
    (providerOptions: { mode: string; theme: Theme }) => (props: { children: JSX.Element }) => {
      const [mode, setMode] = createSignal<string>(providerOptions.mode)

      const updataMode = (value: string) => {
        providerOptions.theme = options.theme(value)
        providerOptions.mode = value
        setMode(value)
      }

      return createComponent(themeContent.Provider, {
        value: { mode, setMode: updataMode, theme: providerOptions.theme },
        get children() {
          return props.children
        }
      })
    }

  const styledComponent =
    (inputTag: BaseTag, createRule: (value: TargetInfo) => void, targetInfo: TargetInfo) =>
    (inputProps: any) => {
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

        const interiorProps = {
          class: `${props.class ? props.class + ' ' : props.class}${
            targetInfo.targetClassName
          }${variantsClassName}`,
          children: props.children,
          component: props.as,
          ...rest
        }

        return typeof props.as === 'function' ? props.as(interiorProps) : Dynamic(interiorProps)
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

export const { styled, createExtracts, flush, global, keyframes } = createSystem()
