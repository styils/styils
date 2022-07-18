import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'
import { render } from './dist/server/entryServer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')

;(async () => {
  const { appHtml, style } = render()

  const html = template.replace(`<!--app-html-->`, appHtml).replace('<!--styil-->', style)

  const filePath = `dist/index.html`
  fs.writeFileSync(toAbsolute(filePath), html)
  console.log('pre-rendered:', filePath)
})()
