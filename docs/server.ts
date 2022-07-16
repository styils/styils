import path from 'path'
import express from 'express'
import vite, { createServer } from 'vite'
import compression from 'compression'
import sirv from 'sirv'

export async function server() {
  const isProd = process.env.NODE_ENV === 'production'
  const app = express()

  let viteServer: vite.ViteDevServer

  if (!isProd) {
    viteServer = await createServer({
      root: process.cwd(),
      logLevel: 'info',
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100
        }
      }
    })
    // // use vite's connect instance as middleware
    app.use(viteServer.middlewares)
  } else {
    app.use(compression())
    app.use(sirv(path.resolve(__dirname, 'dist/client')))
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      let template

      if (!isProd) {
        const { render } = await viteServer.ssrLoadModule('/entry/entry-server.tsx')
        template = await viteServer.transformIndexHtml(url, render(url))
      } else {
        // @ts-expect-error It will appear after packing
        const { render } = await import('./dist/server/entry-server.js')
        template = render(url)
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
    } catch (error: any) {
      !isProd && viteServer.ssrFixStacktrace(error)
      res.status(500).end(error.stack)
    }
  })

  return { app, vite }
}

server().then(({ app }) =>
  app.listen(5173, () => {
    console.log('http://localhost:5173')
  })
)
