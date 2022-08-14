import { createSystem } from '../../../src/indexSolid'

export const { styled, SystemProvider, useSystem, createExtracts } = createSystem({
  theme: (mode) => {
    return {
      light: {
        color: 'red'
      },
      dark: {
        color: 'blue'
      }
    }[mode]
  },
  defaultMode: 'light'
})
