/**
 * https://github.com/emotion-js/emotion/tree/main/packages/sheet
 */

import { Rules, StyleSheetOptions } from './types'

export class StyleSheet {
  /**
   * used to record whether another rule is inserted before
   */
  private alreadyInsertedOrderInsensitiveRule = false

  /**
   * used to record the number of inserts
   */
  private insertIndex = 0

  /**
   * use insertRule, the production default `true`, and the development environment default to `appendChild`
   * @def
   */
  speedy: boolean

  /**
   * insert a list of style tags
   */
  tags: HTMLStyleElement[] = []

  /**
   * Using Node instead of HTMLElement since container may be a ShadowRoot
   */
  container: Node

  /**
   * random value
   * https://web.dev/csp/
   */
  nonce?: string

  /**
   * this will be set as the value of the style tag attribute that get inserted.
   */
  key: string

  /**
   * ssr data
   */
  ssrData = ''

  constructor(options: StyleSheetOptions) {
    this.speedy = options.speedy
    this.nonce = options.nonce
    this.key = options.key
    this.container = options.container
  }

  insertTag(tag: HTMLStyleElement) {
    let before: Node | null = null
    if (this.tags.length !== 0) {
      before = this.tags[this.tags.length - 1].nextSibling
    }
    this.container.insertBefore(tag, before)

    this.tags.push(tag)
  }

  insertStyle({ ruleCode, segmentRuleCode }: Rules) {
    if (this.container) {
      if (this.speedy) {
        for (let index = 0; index < segmentRuleCode.length; index++) {
          this.insert(segmentRuleCode[index])
        }
      } else {
        this.insert(ruleCode)
      }
    } else {
      this.ssrData += ruleCode
    }
  }

  insert(rule: string) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.insertIndex % (this.speedy ? 65000 : 1) === 0) {
      const tag = document.createElement('style')

      tag.setAttribute('data-styil', this.key)
      if (this.nonce !== undefined) {
        tag.setAttribute('nonce', this.nonce)
      }
      tag.appendChild(document.createTextNode(''))

      this.insertTag(tag)
    }
    const tag = this.tags[this.tags.length - 1]

    if (process.env.NODE_ENV !== 'production') {
      // is `@import`
      const isImportRule = rule.charCodeAt(0) === 64 && rule.charCodeAt(1) === 105

      if (isImportRule && this.alreadyInsertedOrderInsensitiveRule) {
        // this would only cause problem in speedy mode
        // but we don't want enabling speedy to affect the observable behavior
        // so we report this error at all times
        console.error(
          [
            `You're attempting to insert the following rule:\n${rule}\n\n`,
            '`@import` rules must be before all other types of rules in a stylesheet but other rules have already been inserted.',
            'Please ensure that `@import` rules are before all other rules.'
          ].join('')
        )
      }

      this.alreadyInsertedOrderInsensitiveRule =
        this.alreadyInsertedOrderInsensitiveRule || !isImportRule
    }

    if (this.speedy) {
      try {
        // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools
        // here tag.sheet is required unless manually modified
        tag.sheet!.insertRule(rule, tag.sheet!.cssRules.length)
      } catch (error) {
        if (
          process.env.NODE_ENV !== 'production' &&
          !/:(-moz-placeholder|-moz-focus-inner|-moz-focusring|-ms-input-placeholder|-moz-read-write|-moz-read-only|-ms-clear){/.test(
            rule
          )
        ) {
          console.error(
            `There was a problem inserting the following rule: "${rule}"`,
            error?.message
          )
        }
      }
    } else {
      tag.appendChild(document.createTextNode(rule))
    }

    this.insertIndex++
  }

  flush() {
    this.tags.forEach((tag) => tag.parentNode && tag.parentNode.removeChild(tag))
    this.ssrData = ''
    this.tags = []
    this.insertIndex = 0

    if (process.env.NODE_ENV !== 'production') {
      this.alreadyInsertedOrderInsensitiveRule = false
    }
  }
}
