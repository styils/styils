import express from 'express'
import compression from 'compression'
import { renderPage } from 'vite-plugin-ssr'
import { createServer } from 'vite'
import sirv from 'sirv'

const isProduction = process.env.NODE_ENV === 'production'
const root = `${__dirname}/..`

startServer()

async function startServer() {
  const app = express()

  app.use(compression())

  if (isProduction) {
    app.use(sirv(`${root}/dist/client`))
  } else {
    const viteDevMiddleware = (
      await createServer({
        root,
        server: { middlewareMode: 'ssr' }
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl
    const pageContextInit = {
      url
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext

    if (!httpResponse) return next()
    const { body, statusCode, contentType } = httpResponse

    res.status(statusCode).type(contentType).send(body)
  })

  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
