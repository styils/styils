import { createSystem } from '@styils/vue'

export const { styled, SystemProvider, useSystem, createExtracts, createGlobal } = createSystem({
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
