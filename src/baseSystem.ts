import { createSelector } from './createSelector'
import { StyleSheet, type OldRule } from './sheet'
import { type AnyObject } from './types'
import { parseRules } from './parse'
import {
  Keyframes,
  type BaseSystem,
  SystemOptions,
  Global,
  AnyFunc,
  BaseStyled
} from './baseSystemTypes'

export function createBaseSystem<
  Styled extends AnyFunc,
  Theme extends AnyObject,
  ExtractElement extends AnyFunc,
  Provider extends AnyFunc
>(
  systemOptions: SystemOptions<Theme>,
  inputSystemProvider: Provider,
  inputStyledComponent: AnyFunc,
  inputExtractElement: ExtractElement
): BaseSystem<Styled, Theme, Provider, ExtractElement> {
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
  } = systemOptions

  const { key = 'css', container, speedy, nonce } = sheetOptions
  const metaSelectorCacheId = `styils-${key}-cache`
  const metaHtml = isBrowser
    ? (document.getElementById(metaSelectorCacheId) as HTMLMetaElement)
    : null

  const internalState = {
    mode: defaultMode,
    theme: inputTheme(defaultMode)
  }

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

  const SystemProvider = inputSystemProvider(internalState)

  // Mode-based cache
  // The difference with `selectorCache` is that this only works at runtime
  let modeIdentifier: Record<string, { targetClassName: string; namespaceJoiner: string }>[] = []
  let withIndex = 0

  const styled: BaseStyled = (tag, styles, interpolation) => {
    let inputTag = tag
    let cacheSourceMap = ''
    const inputNamespace = (tag as { namespace: string }).namespace ?? ''

    if (typeof tag === 'object' && tag.tag) {
      inputTag = tag.tag
    }

    const currentWithIndex = withIndex

    const targetInfo = {
      targetClassName: '',
      namespaceJoiner: ''
    }

    function createRule() {
      const identifier = modeIdentifier[currentWithIndex]?.[internalState.mode]

      if (identifier) {
        const { namespaceJoiner, targetClassName } = identifier
        targetInfo.namespaceJoiner = namespaceJoiner
        targetInfo.targetClassName = targetClassName
        return
      }

      const style =
        typeof styles === 'function' ? styles(internalState.theme, internalState.mode) : styles

      const variants =
        typeof interpolation === 'function'
          ? interpolation(internalState.theme, internalState.mode)
          : interpolation

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

      targetInfo.targetClassName = targetClassName
      targetInfo.namespaceJoiner = namespaceJoiner

      if (!modeIdentifier[currentWithIndex]) {
        modeIdentifier[currentWithIndex] = {}
      }

      modeIdentifier[currentWithIndex][internalState.mode] = {
        targetClassName,
        namespaceJoiner
      }

      withIndex++
    }

    function computedVariants(variants: AnyObject) {
      const variantsPropsKeys = Object.keys(variants)
      let variantsPropsIndex = variantsPropsKeys.length
      let variantsClassName = ''

      while (variantsPropsIndex--) {
        const key = variantsPropsKeys[variantsPropsIndex]
        const value = variants[key]

        if (value !== undefined && value !== null) {
          variantsClassName += ` ${targetInfo.namespaceJoiner}${key}-${value}`
        }
      }

      return variantsClassName
    }

    createRule()

    const styledComponent = inputStyledComponent(inputTag, createRule, computedVariants, targetInfo)

    if (process.env.NODE_ENV !== 'production') {
      styledComponent.displayName = styledComponent.displayName ?? targetInfo.targetClassName
    }

    Object.defineProperty(styledComponent, 'toString', {
      value() {
        // Cross-rendering, after being fetched, child components will not be recalculated
        createRule()
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
    const metaMode = metaHtml?.getAttribute('mode') || internalState.mode
    const selectorCacheString = metaHtml?.content ?? [...selectorCache].join(splitSymbol)
    const extractHtml = `<meta id="${metaSelectorCacheId}" name="styils-cache" mode="${metaMode}" content="${selectorCacheString}">
     <style id="${globalStyleSSRId}">${ssrGlobalData}</style>
     <style id="${styleSSRId}">${ssrData}</style>`

    const extractElement = inputExtractElement({
      selectorCacheString,
      metaSelectorCacheId,
      globalStyleSSRId,
      ssrGlobalData,
      styleSSRId,
      ssrData,
      metaMode
    })

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

      if (isBrowser && metaHtml && internalState.mode === metaHtml.getAttribute('mode')) {
        return
      }

      let rules: { segmentRuleCode: string[]; ruleCode: string }
      const cache = globalCache[internalState.mode]

      if (globalCache[internalState.mode]) {
        rules = cache
      } else {
        const style =
          typeof styles === 'function' ? styles(internalState.theme, internalState.mode) : styles
        rules = parseRules(style)
        globalCache[internalState.mode] = rules
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

    Object.defineProperty(internalState, 'mode', {
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

  return { styled: styled as Styled, SystemProvider, createExtracts, flush, global, keyframes }
}
