import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './src/App'
import { createExtracts, SystemProvider, flush } from './src/theme'

export function render(url) {
  const appHtml = ReactDOMServer.renderToString(
    <SystemProvider>
      <StaticRouter location={'/styils' + url}>
        <App />
      </StaticRouter>
    </SystemProvider>
  )

  const { extractHtml } = createExtracts()
  flush('global')

  return { appHtml, style: extractHtml }
}
