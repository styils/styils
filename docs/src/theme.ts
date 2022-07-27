import { createSystem } from '@styil/react'

const { styled, SystemProvider, getCssValue, global, useSystem, flush } = createSystem({
  theme: (mode: 'light' | 'dark') => {
    return {
      dark: {
        codeBg: '#36344943',
        bgColor: '#242424',
        bgSecondColor: 'rgba(255, 255, 255, 0.05)',
        mainColor: '#fff',
        secondColor: 'rgba(235, 235, 235, 0.6)',
        boxShadow: '0 2px 8px 2px rgb(104 112 118 / 0.07), 0 2px 4px -1px rgb(104 112 118 / 0.04)'
      },
      light: {
        codeBg: '#363449',
        bgColor: '#fff',
        mainColor: 'rgb(33, 53, 71)',
        secondColor: '#687076',
        bgSecondColor: 'rgba(255, 255, 255, 0.05)',
        boxShadow: '0 2px 8px 2px rgb(104 112 118 / 0.07), 0 2px 4px -1px rgb(104 112 118 / 0.04)'
      }
    }[mode]
  },
  defaultMode: import.meta.env.SSR ? 'light' : localStorage.getItem('styil-theme-mode') ?? 'light'
})

export { styled, global, getCssValue, SystemProvider, useSystem, flush }
