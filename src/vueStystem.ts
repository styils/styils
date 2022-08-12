/* @jsxImportSource @vue/runtime-dom */

import { inject, defineComponent, provide, ref, toRefs, h, computed, Fragment } from 'vue'
import { createBaseSystem } from './baseSystem'
import { BaseTag, SystemExtractElement, SystemOptions, TargetInfo } from './baseSystemTypes'
// import type { Styled } from './reactSystemTypes'
import { AnyObject } from './types'

export function createSystem<Theme = {}>(options: SystemOptions<Theme> = {}) {
  const themeContent = Symbol('styils-content')

  const useSystem = () =>
    inject<{
      mode: string
      setMode: (mode: string) => void
      theme: Theme
    }>(themeContent)

  const SystemProvider = (providerOptions: { mode: string; theme: Theme }) =>
    defineComponent({
      setup(_, { slots }) {
        const mode = ref(providerOptions.mode)

        const updataMode = (value: string) => {
          providerOptions.theme = options.theme(value)
          providerOptions.mode = value
          mode.value = value
        }
        provide(themeContent, {
          mode: mode.value,
          theme: providerOptions.theme,
          setMode: updataMode
        })

        return slots.default()
      }
    })

  const styledComponent = (
    inputTag: BaseTag,
    createRule: () => void,
    computedVariants: (value: AnyObject) => string,
    computedVars: (value: AnyObject) => AnyObject,
    targetInfo: TargetInfo
  ) =>
    defineComponent({
      setup(props: AnyObject) {
        const { as = inputTag, class: className, variants, vars, style, ...rest } = toRefs(props)

        const { mode } = useSystem()

        const styles = computed(() => {
          if (mode !== undefined) {
            createRule()
          }

          return {
            classes: `${className ? className + ' ' : ''}${
              targetInfo.targetClassName
            }${computedVariants(variants)}`,
            style: computedVars(vars)
          }
        })

        return h(as, {
          class: styles.value.classes,
          style: { ...styles.value.style, ...style },
          ...rest
        })
      }
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
    h(Fragment, null, [
      h('meta', {
        name: 'styils-cache',
        id: metaSelectorCacheId,
        mode: metaMode,
        content: selectorCacheString
      }),
      ...(process.env.NODE_ENV !== 'production'
        ? [
            ...ssrGlobalData.map((data) =>
              h('style', {
                [devIdent]: globalStyleSSRId,
                dangerouslySetInnerHTML: { __html: data }
              })
            ),
            ...ssrData.map((data) =>
              h('style', {
                [devIdent]: styleSSRId,
                dangerouslySetInnerHTML: { __html: data }
              })
            )
          ]
        : [
            h('style', {
              id: globalStyleSSRId,
              dangerouslySetInnerHTML: { __html: ssrGlobalData.join('') }
            }),
            h('style', {
              id: styleSSRId,
              dangerouslySetInnerHTML: { __html: ssrData.join('') }
            })
          ])
    ])

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
