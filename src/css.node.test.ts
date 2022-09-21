/**
 * @jest-environment node
 */

import { createStyils, getCssValue as defaultGetCssValue, css as defaultCss } from './css'

describe('css node', () => {
  it('createStyils node', () => {
    const { getCssValue, css } = createStyils()

    css({
      width: 100
    })

    css({
      width: 100
    })

    css({
      height: 100
    })

    expect(getCssValue().join('')).toMatchSnapshot()
  })

  it('node default getCssValue ', () => {
    defaultCss({
      width: 100
    })

    defaultCss({
      width: 100
    })

    defaultCss({
      height: 100
    })

    expect(defaultGetCssValue().join('')).toMatchSnapshot()
  })
})
