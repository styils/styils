/**
 * @jest-environment node
 */
import {
  createSystem,
  createExtracts as defaultCreateExtracts,
  styled as defaultStyled,
  flush as defaultFlush
} from './reactSystem'

describe('css node', () => {
  it('createStyils node', () => {
    const { createExtracts, styled, flush } = createSystem()

    styled('div', {
      width: 100
    })

    styled('div', {
      width: 100
    })

    styled('div', {
      height: 100
    })

    expect(createExtracts().extractHtml).toMatchSnapshot()

    flush()
  })

  it('node default createExtracts ', () => {
    defaultStyled('div', {
      width: 100
    })

    defaultStyled('div', {
      width: 100
    })

    defaultStyled('div', {
      height: 100
    })

    expect(defaultCreateExtracts().extractHtml).toMatchSnapshot()

    defaultFlush()
  })
})
