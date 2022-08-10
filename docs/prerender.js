// import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'
import { format } from 'prettier'

import fs from 'fs-extra'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const toAbsolute = (p) => path.resolve(__dirname, p)

fs.writeFileSync(
  toAbsolute('./dist/server/entryServer.js'),
  fs
    .readFileSync(toAbsolute('./dist/server/entryServer.js'))
    .toString()
    .replace(/styled\$2\(/g, 'styled$2.default(')
    .replace(/styled\$4\(/g, 'styled$4.default(')
)

const template = fs.readFileSync(toAbsolute('./dist/index.html'), 'utf-8')

function getKebabCase2(str) {
  return str.replace(/[A-Z]/g, function (item) {
    return '-' + item.toLowerCase()
  })
}

const routesBenchmarkPrerender = fs
  .readdirSync(toAbsolute('src/Benchmark'))
  .filter((item) => {
    return !fs.lstatSync(toAbsolute(`src/Benchmark/${item}`)).isDirectory()
  })
  .map((file) => {
    const name = getKebabCase2(file.replace(/\.tsx$/, ''))
    return name === 'index' ? `/benchmark` : `/benchmark/${name}`
  })

const routesBenchmarkChildPrerender = fs
  .readdirSync(toAbsolute('src/Benchmark/bench'))
  .filter((item) => {
    return fs.lstatSync(toAbsolute(`src/Benchmark/bench/${item}`)).isDirectory() && item !== 'utils'
  })
  .map((dir) => {
    return fs.readdirSync(`src/Benchmark/bench/${dir}`).map((child) => {
      const name = getKebabCase2(child.replace(/\.tsx$/, ''))

      return `/benchmark/${dir}/${name}`
    })
  })
  .flat()

;(async () => {
  const { render } = await import('./dist/server/entryServer.js')

  // pre-render each route...
  for (const url of ['/', ...routesBenchmarkPrerender, ...routesBenchmarkChildPrerender]) {
    const { appHtml, style } = render(url)

    const html = format(
      template.replace(`<!--app-html-->`, appHtml).replace('<!--styils-->', style),
      { parser: 'html' }
    )

    const filePath = `dist${url === '/' ? '/index' : url}.html`
    fs.outputFileSync(toAbsolute(filePath), html)
    console.log('pre-rendered:', filePath)
  }
})()
