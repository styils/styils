import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './src/App'
import { getCssValue, SystemProvider, flush } from './src/theme'

export function render(url) {
  const appHtml = ReactDOMServer.renderToString(
    <SystemProvider>
      <StaticRouter location={'/styil' + url}>
        <App />
      </StaticRouter>
    </SystemProvider>
  )

  const { html } = getCssValue()
  flush('global')

  return { appHtml, style: html }
}
