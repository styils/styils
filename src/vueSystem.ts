import { inject, defineComponent, provide, ref, toRefs, h, computed, Fragment, Ref } from 'vue'
import { createBaseSystem } from './baseSystem'
import { BaseTag, SystemExtractElement, SystemOptions, TargetInfo } from './baseSystemTypes'
import { AnyObject } from './types'
import { Styled } from './vueSystemTypes'

export function createSystem<Theme = {}>(options: SystemOptions<Theme> = {}) {
  const systemContext = Symbol('styils-content')

  const useSystem = () =>
    inject<{
      mode: Ref<string>
      theme: Theme
      setMode: (value: string) => void
    }>(
      systemContext,
      // @ts-expect-error no value initially
      {}
    )

  const SystemProvider = (
    state: { mode: string; theme: Theme },
    onUpdate: (updateState: { mode: string; theme: Theme }) => void
  ) =>
    defineComponent({
      setup(_, { slots }) {
        const mode = ref(state.mode)

        const setMode = (value: string) => {
          onUpdate({ mode: value, theme: options.theme(value) })
          mode.value = value
        }

        provide(systemContext, {
          mode,
          theme: state.theme,
          setMode
        })

        return () => slots?.default?.()
      }
    })

  const styledComponent = (
    inputTag: BaseTag,
    computedVariants: (value: AnyObject) => string,
    computedVars: (value: AnyObject) => AnyObject,
    targetInfo: TargetInfo
  ) =>
    defineComponent({
      props: ['variants', 'class', 'as', 'vars', 'style'],
      setup(props: AnyObject, { slots }) {
        const { as, class: className, variants, vars, style } = toRefs(props)
        const { mode } = useSystem()

        const targetStyles = computed(() => ({
          mode: mode?.value,
          classes: targetInfo.targetClassName
        }))

        const userStyles = computed(() => ({
          classes: computedVariants(variants.value),
          style: computedVars(vars.value)
        }))

        return () => {
          return h(
            as.value || inputTag,
            {
              class: `${className.value ? className.value + ' ' : ''}${targetStyles.value.classes}${
                userStyles.value.classes
              }`,
              style: { ...userStyles.value.style, ...style.value }
            },
            slots
          )
        }
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
    useSystem,
    systemContext
  }
}

export const { styled, createExtracts, flush, createGlobal, keyframes, systemContext } =
  createSystem()
