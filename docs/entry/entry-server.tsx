import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import logoUrl from './logo.svg'
import { Router } from './router'

export function render(url: string) {
  const pages = ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <Router />
    </StaticRouter>
  )

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" href="${logoUrl}" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="" />
      <title>styls css-in-js</title>
    </head>
    <body>
      <div id="app">${pages}</div>
    </body>
  </html>`
}
