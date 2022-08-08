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
      const [mode, setMode] = createSignal(providerOptions.mode)
      const [theme, setTheme] = createSignal(providerOptions.theme)

      const updataMode = (value: string) => {
        providerOptions.theme = options.theme(value)
        providerOptions.mode = value

        batch(() => {
          setMode(providerOptions.mode)
          setTheme(providerOptions.theme)
        })
      }

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
    (
      inputTag: BaseTag,
      createRule: () => void,
      computedVariants: (value: AnyObject) => string,
      targetInfo: TargetInfo
    ) =>
    (inputProps: AnyObject) => {
      const [props, rest] = splitProps(mergeProps({ as: inputTag }, inputProps), [
        'as',
        'class',
        'variants',
        'cssState',
        'style'
      ])

      const { mode } = useSystem()

      const styles = createMemo(() => {
        if (mode?.() !== undefined) {
          createRule()
        }

        const variantsClassName = props.variants ? computedVariants(props.variants) : ''

        const transformCssState = {}
        if (props.cssState) {
          const keys = Object.keys(props.cssState)
          for (let i = keys.length; i >= 0; i--) {
            const key = keys[i]
            transformCssState[`--${targetInfo.targetClassName}-${key}`] = props.cssState[key]
          }
        }

        return {
          classes: `${props.class ? props.class + ' ' : ''}${
            targetInfo.targetClassName
          }${variantsClassName}`,
          style: transformCssState
        }
      })

      return Dynamic({
        get component() {
          return props.as
        },
        get class() {
          return styles().classes
        },
        get style() {
          return { ...styles().style, ...props.style }
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
