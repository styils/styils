/**
 * @jest-environment node
 */

import { createStyil, getCssValue as defaultGetCssValue, css as defaultCss } from './css'

describe('css node', () => {
  it('createStyil node', () => {
    const { getCssValue, css } = createStyil()

    css({
      width: 100
    })

    css({
      width: 100
    })

    css({
      height: 100
    })

    expect(getCssValue().join('')).toEqual(
      '.css-1473887168{width:100px;}.css-2950234073{height:100px;}'
    )
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

    expect(defaultGetCssValue().join('')).toEqual(
      '.css-1473887168{width:100px;}.css-2950234073{height:100px;}'
    )
  })
})
