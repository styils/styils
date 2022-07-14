import type { AnyObject } from './types'
import { unitProps } from './unitProps'

const contentValuePattern =
  /(var|attr|counters?|url|(((repeating-)?(linear|radial))|conic)-gradient)\(|(no-)?(open|close)-quote/
const contentValues: Record<string, 'normal' | 'none' | 'initial' | 'inherit' | 'unset'> = {
  normal: 'normal',
  none: 'none',
  initial: 'initial',
  inherit: 'inherit',
  unset: 'unset'
}

function ruleToNative(key: string, value: string) {
  if (unitProps[key] && typeof value === 'number') {
    value = `${value}px`
  }

  // Exclude css variables, to css native writing
  key = /^--/.test(key) ? key : key.replace(/[A-Z]/g, '-$&').toLowerCase()

  if (key === 'content' && !contentValuePattern.test(value) && !contentValues[value]) {
    try {
      value = JSON.stringify(value).replace(/\\\\/g, '\\')
    } catch {
      // empty
    }
  }

  return `${key}:${value};`
}

function transformKey(property: string, selector = '') {
  if (property === ':global') {
    return ''
  }
  // Go over the selector and replace the matching multiple selectors if any
  // Return the current selector with the key matching multiple selectors if any
  // If the current key has a nested selector replace it
  // If there's a current selector concat it
  return selector
    ? selector.replace(/([^,])+/g, (sel) => {
        return property.replace(/(^:.*)|([^,])+/g, (key) => {
          return /&/.test(key) ? key.replace(/&/g, sel) : `${sel} ${key}`
        })
      })
    : property
}

function transformSpecial(atRule: AnyObject, selector?: string) {
  let blocks = ''
  let rule = ''

  const keys = Object.keys(atRule)
  const { length } = keys
  for (let index = 0; index < length; index++) {
    const key = keys[index]
    const value = atRule[key]

    if (typeof value === 'object') {
      blocks +=
        key.charCodeAt(0) === 64
          ? `${key}{${transformSpecial(value, selector)}}`
          : transformSpecial(value, transformKey(key, selector))
    } else if (value !== undefined) {
      rule += ruleToNative(key, value)
    }
  }

  rule = selector && rule ? `${selector}{${rule}}` : rule

  return `${rule}${blocks}`
}

/**
 * Parses the object into css
 */
export function parseRules(node: AnyObject, rootSelector = '') {
  const nodes = [rootSelector]
  const stack = [{ ...node }]

  const commonRules: string[] = []
  const frontRules: string[] = []
  const rearRules: string[] = []

  while (stack.length) {
    const item = stack.shift()!
    const selector = nodes.shift()!
    const keys = Object.keys(item)
    const { length } = keys

    let rule = ''
    let insertsNumber = 0

    for (let num = 0; num < length; num++) {
      const key = keys[num]
      const value = item[key]

      if (key.charCodeAt(0) === 64) {
        switch (key.charCodeAt(1)) {
          case 110:
          case 105: // @import, @namespace
            frontRules.push(`${key} ${value};`)
            continue
          case 102: // @fant-face
            frontRules.push(transformSpecial({ [key]: value }))
            continue
          case 115: // @media, @supports
          case 109:
            rearRules.push(transformSpecial({ [key]: value }, selector))
            continue
          default: // @keyframes, @counter-style, @page ...
            rearRules.push(transformSpecial({ [key]: value }))
            continue
        }
      } else if (value !== null && typeof value === 'object' && value.constructor === Object) {
        const currentKey = transformKey(key, selector)

        stack.splice(insertsNumber, 0, value)
        nodes.splice(insertsNumber, 0, currentKey)

        insertsNumber++
      } else if (value !== undefined && value !== null) {
        rule += ruleToNative(key, value as string)
      }
    }

    if (rule) {
      const block = selector ? `${selector}{${rule}}` : rule
      commonRules.push(block)
    }
  }

  const segmentRuleCode = [...new Set([...frontRules, ...commonRules, ...rearRules])]

  return {
    segmentRuleCode,
    ruleCode: segmentRuleCode.join('')
  }
}
