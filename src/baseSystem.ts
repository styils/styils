import { createSelector } from './createSelector'
import { StyleSheet, type OldRule } from './sheet'
import { type AnyObject, type AnyFunc } from './types'
import { parseRules } from './parse'
import {
  type Keyframes,
  type BaseSystem,
  type SystemOptions,
  type BaseStyled,
  type CreateGlobal
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
  let globalCache: Record<
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

  const { key = 'css', container, nonce } = sheetOptions
  const metaSelectorCacheId = `styils-${key}-cache`
  // get selector cache in ssr mode
  const metaHtml = isBrowser
    ? (document.getElementById(metaSelectorCacheId) as HTMLMetaElement)
    : null

  const internalState = {
    mode: defaultMode,
    theme: inputTheme(defaultMode)
  }
  /**
   * The purpose of doing this is to ensure order.
   */
  let createRules = []

  // Initialize the fetch cache
  if (isBrowser && !selectorCache.size && metaHtml) {
    metaHtml.content.split(splitSymbol).forEach((name) => {
      selectorCache.add(name)
    })
  }

  const sheet = new StyleSheet({
    key,
    container: isBrowser ? container ?? document.head : null,
    nonce
  })

  function updateInternalState({ mode, theme }: typeof internalState) {
    if (mode !== internalState.mode) {
      internalState.mode = mode
      internalState.theme = theme

      createRules.forEach((create) => create())
    }
  }

  const SystemProvider = inputSystemProvider(internalState, updateInternalState)

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

    // distinguish each styled
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

      const selector = `${key}-${createSelector(style, internalState.mode)}`

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
        const { segmentRuleCode, ruleCode } = parseRules(
          style,
          `.${targetClassName}`,
          ({ key, value }) => {
            if (typeof value === 'string' && value.charAt(0) === '$') {
              // Variant using base Selector
              value = `var(--${targetClassName}-${value.slice(1)})`
            }
            return { key, value }
          }
        )
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
              const { segmentRuleCode, ruleCode } = parseRules(
                value,
                `.${variantsClassName}`,
                process.env.NODE_ENV !== 'production'
                  ? ({ key, value }) => {
                      if (typeof value === 'string' && value.charAt(0) === '$') {
                        console.error(
                          `vars are not supported in variants: { key:'${key}', value:'${value}' }`
                        )
                      }
                      return { key, value }
                    }
                  : null
              )
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
      let variantsClassName = ''

      if (variants) {
        const variantsPropsKeys = Object.keys(variants)
        let variantsPropsIndex = variantsPropsKeys.length

        while (variantsPropsIndex--) {
          const key = variantsPropsKeys[variantsPropsIndex]
          const value = variants[key]

          if (value !== undefined && value !== null) {
            variantsClassName += ` ${targetInfo.namespaceJoiner}${key}-${value}`
          }
        }
      }

      return variantsClassName
    }

    function computedVars(vars: AnyObject) {
      const style = {}

      if (vars) {
        const keys = Object.keys(vars)
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          style[`--${targetInfo.targetClassName}-${key}`] = vars[key]
        }
      }

      return style
    }

    // The initial call
    createRule()
    createRules.push(createRule)

    const styledComponent = inputStyledComponent(
      inputTag,
      computedVariants,
      computedVars,
      targetInfo
    )

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
    const styleHtml: HTMLStyleElement[] = []
    const styleGlobalHtml: HTMLStyleElement[] = []
    // production mode uses `id`
    const devIdent = 'data-ssr'

    if (process.env.NODE_ENV !== 'production') {
      if (isBrowser) {
        document
          .querySelectorAll(`style[${devIdent}="${styleSSRId}"]`)
          .forEach((node: HTMLStyleElement) => {
            styleHtml.push(node)
          })

        document
          .querySelectorAll(`style[${devIdent}="${globalStyleSSRId}"]`)
          .forEach((node: HTMLStyleElement) => {
            styleGlobalHtml.push(node)
          })
      }
    } else if (isBrowser) {
      const styleGlobal = document.getElementById(globalStyleSSRId) as HTMLStyleElement
      const style = document.getElementById(styleSSRId) as HTMLStyleElement
      style && styleHtml.push(style)
      styleGlobal && styleGlobalHtml.push(styleGlobal)
    }

    const selectorCacheString = metaHtml?.content ?? [...selectorCache].join(splitSymbol)
    const metaMode = metaHtml?.getAttribute('mode') || internalState.mode

    const ssrGlobalData: string[] = sheet.ssrGlobalData.length
      ? sheet.ssrGlobalData
      : styleGlobalHtml.map((node) => node.textContent)
    const ssrData: string[] = sheet.ssrData.length
      ? sheet.ssrData
      : styleHtml.map((node) => node.textContent)

    let extractHtml = `<meta id="${metaSelectorCacheId}" name="styils-cache" mode="${metaMode}" content="${selectorCacheString}">`

    // Development mode uses a single, to support sourcemap
    if (process.env.NODE_ENV !== 'production') {
      extractHtml += ssrGlobalData
        .map((item) => `<style ${devIdent}="${globalStyleSSRId}">${item}</style>`)
        .join('\n')
      extractHtml += ssrData
        .map((item) => `<style ${devIdent}="${styleSSRId}">${item}</style>`)
        .join('\n')
    } else {
      extractHtml += `<style id="${globalStyleSSRId}">${ssrGlobalData.join('')}</style>
      <style id="${styleSSRId}">${ssrData.join('')}</style>`
    }

    const extractElement = inputExtractElement({
      ...(process.env.NODE_ENV !== 'production' ? { devIdent } : {}),
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

  const createGlobal: CreateGlobal<Theme> & { sourceMap?: string } = (styles) => {
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
            index:
              process.env.NODE_ENV !== 'production'
                ? rule.index
                : rule.index - tagIndex[rule.tagIndex]
          })

          tagIndex[rule.tagIndex]++
        })

        oldRule = undefined
      }

      // ssr may have been rendered, no need to re-render
      if (isBrowser && metaHtml && internalState.mode === metaHtml.getAttribute('mode')) {
        return
      }

      let rules: { segmentRuleCode: string[]; ruleCode: string }
      const cache = globalCache[internalState.mode]

      if (cache) {
        // Avoid implicated modifications
        rules = { ...cache }
      } else {
        const style =
          typeof styles === 'function' ? styles(internalState.theme, internalState.mode) : styles
        rules = parseRules(style)
        // Avoid implicated modifications
        globalCache[internalState.mode] = { ...rules }
      }

      if (process.env.NODE_ENV !== 'production') {
        // Avoid deleting when updating
        // global is different from styled, dom operation will be performed every update
        if (!cacheSourceMap && createGlobal.sourceMap) {
          cacheSourceMap = createGlobal.sourceMap
          delete createGlobal.sourceMap
        }

        rules.ruleCode += cacheSourceMap
      }

      oldRule = sheet.insertStyle(rules, true)
    }

    createGlobRules()
    createRules.push(createGlobRules)
  }

  // global style retention
  // In some cases, you do not need to reset the global style
  // such as in the case of pre-rendering
  function flush(type: 'all' | 'global' = 'all') {
    sheet.flush(type)
    selectorCache.clear()
    globalCache = {}
    modeIdentifier = []
    createRules = []
  }

  return {
    styled: styled as Styled,
    SystemProvider,
    createExtracts,
    flush,
    createGlobal,
    keyframes
  }
}
