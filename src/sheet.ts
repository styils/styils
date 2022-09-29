/**
 * https://github.com/emotion-js/emotion/tree/main/packages/sheet
 */

import { Rules, StyleSheetOptions } from './types'

export interface OldRule {
  tag: HTMLStyleElement
  index: number
  tagIndex?: number
}

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
   * ssr css data
   */
  ssrData = []

  /**
   * ssr global css data
   */
  ssrGlobalData = []

  constructor(options: StyleSheetOptions) {
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

  insertStyle({ ruleCode, segmentRuleCode }: Rules, glob = false) {
    if (this.container) {
      if (process.env.NODE_ENV !== 'production') {
        return [this.insert(ruleCode)]
      }

      const ruleIndexs: OldRule[] = []
      for (let index = 0; index < segmentRuleCode.length; index++) {
        ruleIndexs.push(this.insert(segmentRuleCode[index]) as OldRule)
      }

      return ruleIndexs
    }

    this[glob ? 'ssrGlobalData' : 'ssrData'].push(segmentRuleCode.join(''))
  }

  insert(rule: string) {
    const scope = process.env.NODE_ENV !== 'production' ? 1 : 65000
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.insertIndex % scope === 0) {
      const tag = document.createElement('style')

      tag.setAttribute('data-styils', this.key)
      if (this.nonce !== undefined) {
        tag.setAttribute('nonce', this.nonce)
      }
      tag.appendChild(document.createTextNode(''))

      this.insertTag(tag)
    }
    const tagIndex = this.tags.length - 1
    const tag = this.tags[tagIndex]

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

    let oldRule: OldRule

    if (process.env.NODE_ENV !== 'production') {
      tag.appendChild(document.createTextNode(rule))
      oldRule = { tag, index: tagIndex }
    } else {
      try {
        // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools
        // here tag.sheet is required unless manually modified
        oldRule = { tag, index: tag.sheet!.insertRule(rule, tag.sheet!.cssRules.length), tagIndex }
      } catch (error) {
        console.error(`There was a problem inserting the following rule: "${rule}"`, error?.message)
      }
    }

    this.insertIndex++
    return oldRule
  }

  flushSingle({ tag, index }: { tag: HTMLStyleElement; index: number }) {
    if (process.env.NODE_ENV !== 'production') {
      this.container.removeChild(tag)
      this.tags.splice(index, 1)
    } else {
      tag.sheet.deleteRule(index)
    }
  }

  flush(type: 'all' | 'global' = 'all') {
    this.tags.forEach((tag) => tag.parentNode && tag.parentNode.removeChild(tag))
    if (type !== 'global') {
      this.ssrGlobalData = []
    }
    this.ssrData = []
    this.tags = []
    this.insertIndex = 0

    if (process.env.NODE_ENV !== 'production') {
      this.alreadyInsertedOrderInsensitiveRule = false
    }
  }
}
