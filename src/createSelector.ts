import { CSSAttribute } from 'nativeCssTypes'
import type { AnyObject } from './types'

/**
 * Generates the needed className
 */
export function createSelector(styles: CSSAttribute) {
  let stringify = ''
  // Get a string representation of the object or the value that is called 'styles'
  // Retrieve the className from cache or hash it in place
  const stack: AnyObject[] = [{ ...styles }]
  while (stack.length !== 0) {
    const node = stack.shift()!
    const keys = Object.keys(node)
    const { length } = keys

    for (let i = length - 1; i >= 0; i--) {
      const key = keys[i]
      if (typeof node[key] === 'object') {
        stack.push(node[key])
        stringify += key
        continue
      }
      stringify += `${key}${node[key]}`
    }
  }

  // Convert input to class name.
  // is the initial value of 11.
  let index = 0
  let value = 11

  while (index < stringify.length) {
    // the multiplicative constant 101 is chosen to be prime,
    // unsigned integer
    value = (101 * value + stringify.charCodeAt(index++)) >>> 0
  }

  return value
}
