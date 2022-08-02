import { createSystem } from '@styils/react'

export const { styled, SystemProvider, getCssValue } = createSystem({
  theme(mode) {
    return {
      color: mode === 'light' ? 'red' : 'blue'
    }
  }
})
