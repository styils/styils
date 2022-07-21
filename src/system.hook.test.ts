import React from 'react'
import { useInsertionEffect } from './system'

jest.mock('react', () => {
  const originalModule = jest.requireActual('react')

  return {
    __esModule: true,
    default: { ...originalModule, useInsertionEffect: undefined }
  }
})

describe('react hook', () => {
  it('useInsertionEffect downgrade', () => {
    expect(useInsertionEffect).toEqual(React.useLayoutEffect)
  })
})
