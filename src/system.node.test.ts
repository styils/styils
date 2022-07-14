/**
 * @jest-environment node
 */
import { createSystem, getCssValue as defaultGetCssValue, styled as defaultStyled } from './system'

describe('css node', () => {
  it('createStyls node', () => {
    const { getCssValue, styled } = createSystem()

    styled('div', {
      width: 100
    })

    styled('div', {
      width: 100
    })

    styled('div', {
      height: 100
    })

    expect(getCssValue()).toEqual('.css-1473887168{width:100px;}.css-2950234073{height:100px;}')
  })

  it('node default getCssValue ', () => {
    defaultStyled('div', {
      width: 100
    })

    defaultStyled('div', {
      width: 100
    })

    defaultStyled('div', {
      height: 100
    })

    expect(defaultGetCssValue()).toEqual(
      '.css-1473887168{width:100px;}.css-2950234073{height:100px;}'
    )
  })
})
