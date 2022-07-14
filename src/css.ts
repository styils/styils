import { StyleSheetOptions, type CSSAttribute, type Rules } from './types'
import { StyleSheet } from './sheet'
import { parseRules } from './parse'
import { createSelector } from './createSelector'

export function createStyls(options: Partial<StyleSheetOptions> = {}) {
  const { key, container, speedy, nonce } = options

  const cacheStyle: Record<string, Rules> = {}

  const sheet = new StyleSheet({
    key: key ?? 'css',
    speedy: speedy === undefined ? process.env.NODE_ENV === 'production' : speedy,
    container: globalThis.document ? container ?? globalThis.document.head : null,
    nonce
  })

  function createStyle(options: { styles: CSSAttribute; keyframes?: boolean; glob?: boolean }) {
    const { styles, keyframes, glob } = options
    const className = createSelector(styles)

    if (!cacheStyle[className]) {
      cacheStyle[className] = parseRules(
        keyframes ? { [`@keyframes ${className}`]: styles } : styles,
        glob ? undefined : `.${className}`
      )
      sheet.insertStyle(cacheStyle[className])
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

  return { css, glob, keyframes, getCssValue }
}

export const { css, glob, keyframes, getCssValue } = createStyls()
