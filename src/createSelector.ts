import { CSSAttribute } from 'nativeCssTypes'

/**
 * Generates the needed className
 */
export function createSelector(styles: CSSAttribute) {
  const stringify = JSON.stringify(styles)

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
