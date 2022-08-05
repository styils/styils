import { createSystem } from '../../src/solidSystem'

export const { styled, SystemProvider, useSystem } = createSystem({
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
