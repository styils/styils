import { createSystem, glob } from 'styil-react'

const { styled } = createSystem({
  theme: (mode: 'light' | 'dark') => {
    return {
      dark: {
        bgColor: '#242424'
      },
      light: {
        bgColor: '#fff'
      }
    }[mode]
  },
  defaultMode: localStorage.getItem('styil-theme-mode') ?? 'light'
})

export { styled, glob }
