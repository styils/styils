import { StyleSheetOptions } from './types'
import { createSelector } from './createSelector'
import { StyleSheet } from './sheet'
import { parseRules } from './parse'
import { CSSAttribute } from 'nativeCssTypes'

export function createStyil(options: Partial<StyleSheetOptions> = {}) {
  const { key = 'css', container, speedy, nonce } = options

  const globalCache = new Set<string>([])

  const sheet = new StyleSheet({
    key,
    speedy: speedy === undefined ? process.env.NODE_ENV === 'production' : speedy,
    container: globalThis.document ? container ?? globalThis.document.head : null,
    nonce
  })

  function createStyle(options: { styles: CSSAttribute; keyframes?: boolean; glob?: boolean }) {
    const { styles, keyframes, glob } = options
    const className = `${key}-${createSelector(styles)}`

    if (!globalCache.has(className)) {
      globalCache.add(className)

      sheet.insertStyle(
        parseRules(
          keyframes ? { [`@keyframes ${className}`]: styles } : styles,
          glob ? undefined : `.${className}`
        )
      )
    }

    return glob ? undefined : className
  }

  function css(styles: CSSAttribute) {
    return createStyle({ styles })
  }

  function glob(styles: CSSAttribute) {
    return createStyle({ styles, glob: true })
  }

  function keyframes(styles: CSSAttribute) {
    return createStyle({ styles, keyframes: true })
  }

  function getCssValue() {
    return sheet.ssrData
  }

  function flush() {
    sheet.flush()
    globalCache.clear()
  }

  return { css, glob, keyframes, getCssValue, flush }
}

export const { css, glob, keyframes, getCssValue, flush } = createStyil()
