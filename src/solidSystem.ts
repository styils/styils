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
import {
  type SystemOptions,
  type Styled,
  type System,
  type Global,
  Keyframes
} from './solidSystemTypes'
import { createSelector } from './createSelector'
import { StyleSheet, type OldRule } from './sheet'
import { type AnyObject } from './types'
import { parseRules } from './parse'

export function createSystem<Theme extends AnyObject = {}>(
  options: SystemOptions<Theme> = {}
): System<Theme> {
  const splitSymbol = '|'
  const isBrowser = !!globalThis.document

  // selector cache is mainly used for ssr
  const selectorCache = new Set<string>([])
  const globalCache: Record<
    string,
    {
      segmentRuleCode: string[]
      ruleCode: string
    }
  > = {}

  const {
    theme: inputTheme = () => ({} as AnyObject),
    defaultMode = 'none',
    sheetOptions = {}
  } = options

  const { key = 'css', container, speedy, nonce } = sheetOptions
  const globalMode = { mode: defaultMode }
  const metaSelectorCacheId = `styils-${key}-cache`
  const metaHtml = isBrowser
    ? (document.getElementById(metaSelectorCacheId) as HTMLMetaElement)
    : null

  let theme = inputTheme(defaultMode)

  if (isBrowser && !selectorCache.size && metaHtml) {
    metaHtml.content.split(splitSymbol).forEach((name) => {
      selectorCache.add(name)
    })
  }

  const sheet = new StyleSheet({
    key,
    speedy: speedy === undefined ? process.env.NODE_ENV === 'production' : speedy,
    container: isBrowser ? container ?? document.head : null,
    nonce
  })

  const themeContent = createContext<{
    mode: Accessor<string>
    setMode: any
    theme: Theme
  }>(
    // @ts-expect-error no value initially
    {}
  )

  const SystemProvider = (props: { children: JSX.Element }) => {
    const [mode, setMode] = createSignal<string>(defaultMode)

    const updataMode = (value: string) => {
      theme = inputTheme(value)
      globalMode.mode = value
      setMode(value)
    }

    return createComponent(themeContent.Provider, {
      value: { mode, setMode: updataMode, theme },
      get children() {
        return props.children
      }
    })
  }

  const useSystem = () => useContext(themeContent)

  // Mode-based cache
  // The difference with `selectorCache` is that this only works at runtime
  let modeIdentifier: Record<string, { targetClassName: string; namespaceJoiner: string }>[] = []
  let withIndex = 0

  const styled: Styled<Theme> & { sourceMap?: string } = (tag, styles, interpolation) => {
    let inputTag = tag
    let cacheSourceMap = ''
    const inputNamespace = (tag as { namespace: string }).namespace ?? ''

    if (typeof tag === 'object' && tag.tag) {
      inputTag = tag.tag
    }

    const currentWithIndex = withIndex

    function createRule(inputTargetInfo: { targetClassName: string; namespaceJoiner: string }) {
      const identifier = modeIdentifier[currentWithIndex]?.[globalMode.mode]

      if (identifier) {
        const { namespaceJoiner, targetClassName } = identifier
        inputTargetInfo.namespaceJoiner = namespaceJoiner
        inputTargetInfo.targetClassName = targetClassName
        return
      }

      const style = typeof styles === 'function' ? styles(theme, globalMode.mode) : styles

      const variants =
        typeof interpolation === 'function' ? interpolation(theme, globalMode.mode) : interpolation

      const selector = `${key}-${createSelector(style)}`

      let targetClassName = selector
      let namespaceJoiner = ''

      if (inputNamespace) {
        targetClassName = `${inputNamespace}-${selector}`
        namespaceJoiner = `${inputNamespace}-`
      }

      const rules = {
        segmentRuleCode: [],
        ruleCode: ''
      }

      if (!selectorCache.has(targetClassName)) {
        selectorCache.add(targetClassName)
        const { segmentRuleCode, ruleCode } = parseRules(style, `.${targetClassName}`)
        rules.ruleCode = ruleCode
        rules.segmentRuleCode = segmentRuleCode
      }

      if (variants) {
        const variantsKeys = Object.keys(variants)
        let variantsIndex = variantsKeys.length

        while (variantsIndex--) {
          const variantsKey = variantsKeys[variantsIndex]
          const variantsValue = variants[variantsKey]

          const variantsChildKeys = Object.keys(variantsValue)
          let variantsChildIndex = variantsChildKeys.length

          while (variantsChildIndex--) {
            const key = variantsChildKeys[variantsChildIndex]
            const value = variantsValue[key]
            const variantsClassName = `${targetClassName}.${namespaceJoiner}${variantsKey}-${key}`

            if (!selectorCache.has(variantsClassName)) {
              selectorCache.add(variantsClassName)
              const { segmentRuleCode, ruleCode } = parseRules(value, `.${variantsClassName}`)
              rules.ruleCode += ruleCode
              rules.segmentRuleCode.push(...segmentRuleCode)
            }
          }
        }
      }

      if (process.env.NODE_ENV !== 'production') {
        if (!cacheSourceMap && styled.sourceMap) {
          cacheSourceMap = styled.sourceMap
          delete styled.sourceMap
        }

        if (rules.ruleCode) {
          rules.ruleCode += cacheSourceMap
        }
      }

      if (rules.ruleCode || rules.segmentRuleCode.length) {
        sheet.insertStyle(rules)
      }

      inputTargetInfo.targetClassName = targetClassName
      inputTargetInfo.namespaceJoiner = namespaceJoiner

      if (!modeIdentifier[currentWithIndex]) {
        modeIdentifier[currentWithIndex] = {}
      }

      modeIdentifier[currentWithIndex][globalMode.mode] = {
        targetClassName,
        namespaceJoiner
      }

      withIndex++
    }

    const targetInfo = {
      targetClassName: '',
      namespaceJoiner: ''
    }

    createRule(targetInfo)

    const styledComponent = (inputProps: any) => {
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

    if (process.env.NODE_ENV !== 'production') {
      styledComponent.displayName = styledComponent.displayName ?? targetInfo.targetClassName
    }

    Object.defineProperty(styledComponent, 'toString', {
      value() {
        // Cross-rendering, after being fetched, child components will not be recalculated
        createRule(targetInfo)
        return `.${targetInfo.targetClassName}`
      }
    })

    return styledComponent
  }

  function createExtracts() {
    const globalStyleSSRId = `styils-${key}-ssr-global`
    const styleSSRId = `styils-${key}-ssr`
    const styleHtml = isBrowser ? document.getElementById(styleSSRId) : null
    const styleGlobalHtml = isBrowser ? document.getElementById(globalStyleSSRId) : null

    const ssrGlobalData = sheet.ssrGlobalData || (styleGlobalHtml?.textContent ?? '')
    const ssrData = sheet.ssrData || (styleHtml?.textContent ?? '')

    const selectorCacheString = metaHtml?.content ?? [...selectorCache].join(splitSymbol)
    const extractHtml = `<meta id="${metaSelectorCacheId}" name="styils-cache" mode="${globalMode.mode}" content="${selectorCacheString}">
     <style id="${globalStyleSSRId}">${ssrGlobalData}</style>
     <style id="${styleSSRId}">${ssrData}</style>`

    const extractElement = [
      Dynamic({
        component: 'meta',
        id: metaSelectorCacheId,
        name: 'styils-cache',
        mode: globalMode.mode,
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

    return { extractHtml, extractElement }
  }

  const keyframes: Keyframes = (style) => {
    const selector = `${key}-${createSelector(style)}`

    if (!selectorCache.has(selector)) {
      selectorCache.add(selector)

      const rules = parseRules({ [`@keyframes ${selector}`]: style })
      sheet.insertStyle(rules, true)
    }

    return selector
  }

  const global: Global<Theme> & { sourceMap?: string } = (styles) => {
    let oldRule: OldRule[]
    let cacheSourceMap = ''

    function createGlobRules() {
      if (oldRule) {
        // Global styles are not like local styles, which need to be removed here
        // Consider cases where there are multiple tags
        const tagIndex: number[] = []
        oldRule.forEach((rule) => {
          if (!tagIndex[rule.tagIndex]) tagIndex[rule.tagIndex] = 0
          sheet.flushSingle({
            tag: rule.tag,
            index: sheet.speedy ? rule.index - tagIndex[rule.tagIndex] : rule.index
          })

          tagIndex[rule.tagIndex]++
        })

        oldRule = undefined
      }

      if (isBrowser && metaHtml && globalMode.mode === metaHtml.getAttribute('mode')) {
        return
      }

      let rules: { segmentRuleCode: string[]; ruleCode: string }
      const cache = globalCache[globalMode.mode]

      if (globalCache[globalMode.mode]) {
        rules = cache
      } else {
        const style = typeof styles === 'function' ? styles(theme, globalMode.mode) : styles
        rules = parseRules(style)
        globalCache[globalMode.mode] = rules
      }

      if (process.env.NODE_ENV !== 'production') {
        if (!cacheSourceMap && global.sourceMap) {
          cacheSourceMap = global.sourceMap
          delete global.sourceMap
        }

        rules.ruleCode += cacheSourceMap
      }

      oldRule = sheet.insertStyle(rules, true)
    }

    createGlobRules()

    Object.defineProperty(globalMode, 'mode', {
      set(value) {
        this.value = value
        createGlobRules()
      },
      get() {
        return this.value ?? defaultMode
      }
    })
  }

  // global style retention
  // In some cases, you do not need to reset the global style
  // such as in the case of pre-rendering
  function flush(type: 'all' | 'global' = 'all') {
    sheet.flush(type)
    selectorCache.clear()
    modeIdentifier = []
  }

  return { styled, SystemProvider, useSystem, createExtracts, flush, global, keyframes }
}

export const { styled, createExtracts, flush, global, keyframes } = createSystem()
