/**
 * @jest-environment node
 */
import {
  createSystem,
  getCssValue as defaultGetCssValue,
  styled as defaultStyled,
  flush as defaultFlush
} from './system'

describe('css node', () => {
  it('createStyil node', () => {
    const { getCssValue, styled, flush } = createSystem()

    styled('div', {
      width: 100
    })

    styled('div', {
      width: 100
    })

    styled('div', {
      height: 100
    })

    expect(getCssValue()).toMatchSnapshot()

    flush()
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

    expect(defaultGetCssValue()).toMatchSnapshot()

    defaultFlush()
  })
})
