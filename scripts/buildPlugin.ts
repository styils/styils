import { transformSync } from 'esbuild'
import path from 'path'
import fs from 'fs-extra'

const cwd = process.cwd()

function run() {
  const babelPluginPath = path.join(cwd, 'babel-plugin')
  const vitePluginPath = path.join(cwd, 'vite-plugin')

  const babelPluginSoucrePath = path.join(babelPluginPath, 'src')
  const vitePluginSoucrePath = path.join(vitePluginPath, 'src')

  const babelPluginDistPath = path.join(babelPluginPath, 'dist')
  const vitePluginDistPath = path.join(vitePluginPath, 'dist')

  fs.removeSync(babelPluginDistPath)
  fs.removeSync(vitePluginDistPath)

  const babelPluginFiles = fs.readdirSync(babelPluginSoucrePath).filter((file) => {
    return fs.lstatSync(path.join(babelPluginSoucrePath, file)).isFile() && !/\.test\./.test(file)
  })
  babelPluginFiles.forEach((file) => {
    const filePath = path.join(babelPluginSoucrePath, file)
    const code = fs.readFileSync(filePath).toString()
    const resCjs = transformSync(code, {
      loader: 'ts',
      format: 'cjs'
    })

    const libFileCjsPath = path.join(babelPluginDistPath, file).replace('.ts', '.js')
    console.log('babel-plugin:', file, '->', file.replace('.ts', '.js'))
    fs.outputFileSync(libFileCjsPath, resCjs.code)

    const resEsm = transformSync(code, {
      loader: 'ts',
      format: 'esm'
    })

    const libFileEsmPath = path.join(babelPluginDistPath, file).replace('.ts', '.mjs')
    console.log('babel-plugin', file, '->', file.replace('.ts', '.mjs'))
    fs.outputFileSync(libFileEsmPath, resEsm.code)
  })

  const vitePluginFiles = fs.readdirSync(vitePluginSoucrePath).filter((file) => {
    return fs.lstatSync(path.join(vitePluginSoucrePath, file)).isFile() && !/\.test\./.test(file)
  })

  vitePluginFiles.forEach((file) => {
    const filePath = path.join(vitePluginSoucrePath, file)
    const code = fs.readFileSync(filePath).toString()
    const resCjs = transformSync(code, {
      loader: 'ts',
      format: 'cjs'
    })

    const libFileCjsPath = path.join(vitePluginDistPath, file).replace('.ts', '.js')
    console.log('vite-plugin', file, '->', file.replace('.ts', '.js'))
    fs.outputFileSync(libFileCjsPath, resCjs.code)

    const resEsm = transformSync(code, {
      loader: 'ts',
      format: 'esm'
    })

    const libFileEsmPath = path.join(vitePluginDistPath, file).replace('.ts', '.mjs')
    console.log('vite-plugin', file, '->', file.replace('.ts', '.mjs'))
    fs.outputFileSync(libFileEsmPath, resEsm.code)
  })
}

run()
