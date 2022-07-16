import react from '@vitejs/plugin-react'
import { UserConfig, PluginOption } from 'vite'
import { format } from 'prettier'
import path from 'path'
import fs from 'fs'

function genRouter(): PluginOption {
  const virtualRouterModuleId = 'documents-router'

  const resolvedVirtualModuleId = `virtual:${virtualRouterModuleId}`
  const pagesPath = path.join(__dirname, 'pages')

  const pages = fs.readdirSync(pagesPath).map((item) => {
    return {
      name: item,
      path: path.join(__dirname, 'pages', item)
    }
  })

  let importString = ``
  let exportString = ``
  let routerConfig = ``

  pages.forEach((item) => {
    return fs.readdirSync(item.path).forEach((child) => {
      let name = child.replace(path.extname(child), '')

      if (name === 'index') {
        name = ''
      }

      importString += `import ${item.name}${name} from '${path.join(item.path, child)}';\n`

      exportString += `${item.name}${name},`

      routerConfig += `{
        name: '${item.name}${name}',
        path: '${item.name}/${name}',
        component: ${item.name}${name}
      },`
    })
  })

  exportString = `export const components = {${exportString}};`
  routerConfig = `export const routers = [${routerConfig}];`

  return {
    name: 'gen-router',
    resolveId(id) {
      if (id === virtualRouterModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return format(
          `
          ${importString}
          ${routerConfig}

          ${exportString}
        `,
          { parser: 'babel' }
        )
      }
    }
  }
}

const config: UserConfig = {
  plugins: [react(), genRouter()],
  resolve: {
    alias: {
      'styls-react': path.join(__dirname, '..', 'src', 'indexReact'),
      system: path.join(__dirname, 'common', 'system')
    }
  }
}

export default config
