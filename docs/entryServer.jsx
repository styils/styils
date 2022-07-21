import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './src/App'
import { getCssValue, SystemProvider } from './src/theme'

export function render() {
  const style = getCssValue()
  const appHtml = ReactDOMServer.renderToString(
    <SystemProvider>
      <App />
    </SystemProvider>
  )

  return { appHtml, style }
}
