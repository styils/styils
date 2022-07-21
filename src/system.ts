import React from 'react'
import { createSelector } from './createSelector'
import { type SystemOptions, type Styled, type System } from './systemTypes'
import { CSSAttribute, type AnyObject } from './types'
import { parseRules } from './parse'
import { StyleSheet, type OldRule } from './sheet'

const selectorCache = new Set<string>([])
const globalCache: Record<
  string,
  {
    segmentRuleCode: string[]
    ruleCode: string
  }
> = {}
const cacheKey = '__styil_cache__'
const splitSymbol = '|'

const isBrowser = !!globalThis.document

export function createSystem<Theme extends AnyObject = {}>(
  options: SystemOptions<Theme> = {}
): System<Theme> {
  const {
    theme: inputTheme = () => ({} as AnyObject),
    defaultMode = 'none',
    sheetOptions = {}
  } = options
  const { key, container, speedy, nonce } = sheetOptions
  let globalMode = defaultMode

  if (isBrowser && !selectorCache.size) {
    const meta = document.getElementById(cacheKey) as HTMLMetaElement

    meta?.content.split(splitSymbol).forEach((name) => {
      selectorCache.add(name)
    })
  }

  const sheet = new StyleSheet({
    key: key ?? 'css',
    speedy: speedy === undefined ? process.env.NODE_ENV === 'production' : speedy,
    container: isBrowser ? container ?? document.head : null,
    nonce
  })

  const themeContent = React.createContext<{
    mode: string
    setMode: React.Dispatch<React.SetStateAction<string>>
    theme: Theme
  }>(
    // @ts-expect-error no value initially
    {}
  )

  const SystemProvider = (props: { children: React.ReactNode }) => {
    const [mode, setMode] = React.useState<string>(defaultMode)

    const updataMode = (value: string) => {
      setMode(value)
      globalMode = value
    }

    return React.createElement(
      themeContent.Provider,
      { value: { mode, setMode: updataMode, theme: inputTheme(mode) } },
      props.children
    )
  }

  const useSystem = () => {
    return React.useContext(themeContent)
  }

  const styled: Styled<Theme> = (tag, styles, interpolation) => {
    let inputTag = tag
    const inputNamespace = (tag as { namespace: string }).namespace ?? ''

    if (typeof tag === 'object' && tag.tag) {
      inputTag = tag.tag
    }

    const modeIdentifier: Record<string, { targetClassName: string; namespaceJoiner: string }> = {}

    function createRule(
      mode: string,
      inputTargetInfo: { targetClassName: string; namespaceJoiner: string }
    ) {
      const identifier = modeIdentifier[mode]

      if (identifier) {
        const { namespaceJoiner, targetClassName } = identifier
        inputTargetInfo.namespaceJoiner = namespaceJoiner
        inputTargetInfo.targetClassName = targetClassName
        return
      }

      const theme = inputTheme(mode)
      const style = typeof styles === 'function' ? styles(theme, mode) : styles

      const variants =
        typeof interpolation === 'function' ? interpolation(theme, mode) : interpolation

      const selector = createSelector(style)

      let targetClassName = selector
      let namespaceJoiner = ''

      if (inputNamespace) {
        targetClassName = `${inputNamespace}-${selector}`
        namespaceJoiner = `${inputNamespace}-`
      }

      if (!selectorCache.has(targetClassName)) {
        selectorCache.add(targetClassName)
        sheet.insertStyle(parseRules(style, `.${targetClassName}`))
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
              sheet.insertStyle(parseRules(value, `.${variantsClassName}`))
            }
          }
        }
      }

      inputTargetInfo.targetClassName = targetClassName
      inputTargetInfo.namespaceJoiner = namespaceJoiner

      modeIdentifier[mode] = {
        targetClassName,
        namespaceJoiner
      }
    }

    const targetInfo = {
      targetClassName: '',
      namespaceJoiner: ''
    }

    createRule(defaultMode, targetInfo)

    const styledComponent = React.forwardRef<HTMLElement, AnyObject>((props, ref) => {
      const { as = inputTag, className = '', variants: variantsProps, ...rest } = props
      let variantsClassName = ''

      const { mode } = useSystem()

      if (mode !== undefined) {
        createRule(mode, targetInfo)
      }

      if (variantsProps) {
        const variantsPropsKeys = Object.keys(variantsProps)
        let variantsPropsIndex = variantsPropsKeys.length

        while (variantsPropsIndex--) {
          const key = variantsPropsKeys[variantsPropsIndex]
          const value = variantsProps[key]

          if (value !== undefined && value !== null) {
            variantsClassName += ` ${targetInfo.namespaceJoiner}${key}-${value}`
          }
        }
      }

      return React.createElement(as, {
        className: `${className ? className + ' ' : className}${
          targetInfo.targetClassName
        }${variantsClassName}`,
        ref,
        ...rest
      })
    })

    if (process.env.NODE_ENV !== 'production') {
      styledComponent.displayName = styledComponent.displayName ?? targetInfo.targetClassName
    }

    Object.defineProperty(styledComponent, 'toString', {
      value() {
        // Cross-rendering, after being fetched, child components will not be recalculated
        createRule(globalMode, targetInfo)
        return `.${targetInfo.targetClassName}`
      }
    })

    return styledComponent
  }

  function getCssValue() {
    return `
      <meta id="${cacheKey}" name="styil-cache" content="${[...selectorCache].join(splitSymbol)}">
      <style data-styil="${sheet.key}">${sheet.ssrData}</style>
    `
  }

  function global(styles: CSSAttribute | ((theme: Theme, mode: string) => CSSAttribute)) {
    let oldRule: OldRule[]
    let currentMode = defaultMode

    function createGlobRules(mode: string) {
      let rules: { segmentRuleCode: string[]; ruleCode: string }
      const cache = globalCache[mode]

      if (globalCache[mode]) {
        rules = cache
      } else {
        rules = parseRules(typeof styles === 'function' ? styles(inputTheme(mode), mode) : styles)
        globalCache[mode] = rules
      }

      if (oldRule) {
        const tagIndex: number[] = []
        oldRule.forEach((rule) => {
          if (!tagIndex[rule.tagIndex]) tagIndex[rule.tagIndex] = 0

          sheet.flushSingle({
            tag: rule.tag,
            index: sheet.speedy ? rule.index - tagIndex[rule.tagIndex] : rule.index
          })

          tagIndex[rule.tagIndex]++
        })
      }

      oldRule = sheet.insertStyle(rules)
    }

    createGlobRules(defaultMode)

    return function Glob() {
      const { mode } = useSystem()

      if (mode !== undefined && mode !== currentMode) {
        createGlobRules(mode)
        currentMode = mode
      }

      return null
    }
  }

  function flush() {
    sheet.flush()
    selectorCache.clear()
  }

  return { styled, SystemProvider, useSystem, getCssValue, flush, global }
}

export const { styled, getCssValue, flush, global } = createSystem()
