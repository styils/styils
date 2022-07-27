import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './src/App'
import { getCssValue, SystemProvider } from './src/theme'

export function render(url) {
  const appHtml = ReactDOMServer.renderToString(
    <SystemProvider>
      <StaticRouter location={'/styil' + url}>
        <App />
      </StaticRouter>
    </SystemProvider>
  )

  const style = getCssValue()

  return { appHtml, style }
}
