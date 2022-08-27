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
  batch,
  Accessor
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
      createRule: () => void,
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

      const styles = createMemo(() => {
        if (mode?.() !== undefined) {
          createRule()
        }

        return {
          classes: `${props.class ? props.class + ' ' : ''}${
            targetInfo.targetClassName
          }${computedVariants(props.variants)}`,
          style: computedVars(props.vars)
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
    metaMode,
    devIdent
  }: SystemExtractElement) => {
    const element = [
      Dynamic({
        component: 'meta',
        id: metaSelectorCacheId,
        name: 'styils-cache',
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
    ...createBaseSystem<
      Styled<Theme>,
      Theme,
      (props: SystemExtractElement) => Accessor<JSX.Element>[],
      (providerOptions: {
        mode: string
        theme: AnyObject
      }) => (props: { children: JSX.Element }) => JSX.Element
    >(options, SystemProvider, styledComponent, extractElement),
    useSystem,
    systemContext
  }
}

export const { styled, createExtracts, flush, createGlobal, keyframes, systemContext } =
  createSystem()
