import { inject, defineComponent, provide, ref, toRefs, h, computed, Fragment } from 'vue'
import { createBaseSystem } from './baseSystem'
import { BaseTag, SystemExtractElement, SystemOptions, TargetInfo } from './baseSystemTypes'
import { AnyObject } from './types'
import { Styled } from './vueSystemTypes'

export function createSystem<Theme = {}>(options: SystemOptions<Theme> = {}) {
  const themeContent = Symbol('styils-content')

  const useSystem = () =>
    inject<{
      mode: string
      setMode: (mode: string) => void
      theme: Theme
    }>(
      themeContent,
      // @ts-expect-error no value initially
      {}
    )

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

        return () => slots?.default?.()
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
      props: ['variants', 'class', 'as', 'vars', 'style'],
      setup(props: AnyObject, { slots }) {
        const { as, class: className, variants, vars, style } = toRefs(props)

        const { mode } = useSystem()

        const styles = computed(() => {
          if (mode !== undefined) {
            createRule()
          }

          return {
            classes: `${className.value ? className.value + ' ' : ''}${
              targetInfo.targetClassName
            }${computedVariants(variants.value)}`,
            style: computedVars(vars.value)
          }
        })

        return () =>
          h(
            as.value || inputTag,
            {
              class: styles.value.classes,
              style: { ...styles.value.style, ...style.value }
            },
            slots?.default?.()
          )
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
                innerHTML: data
              })
            ),
            ...ssrData.map((data) =>
              h('style', {
                [devIdent]: styleSSRId,
                innerHTML: data
              })
            )
          ]
        : [
            h('style', {
              id: globalStyleSSRId,
              innerHTML: ssrGlobalData.join('')
            }),
            h('style', {
              id: styleSSRId,
              innerHTML: ssrData.join('')
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
