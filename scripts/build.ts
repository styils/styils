import replace from '@rollup/plugin-replace'
import esbuild from 'rollup-plugin-esbuild'
import { rollup } from 'rollup'
import ts, { JsxEmit } from 'typescript'
import rimraf from 'rimraf'
import path from 'path'
import zlib from 'zlib'
import fs from 'fs'
import ora from 'ora'
import prettier from 'prettier'
import { box } from './colors'
import copy from 'rollup-plugin-copy'

const packageBaseName = '@styils'
const cwd = process.cwd()
const typeFile: any[] = []

const allFile = fs
  .readdirSync(path.join(cwd, 'src'))
  .filter((file) => {
    return file.indexOf('.test.ts') < 0 && file.indexOf('.spec.ts') < 0 && file.indexOf('.ts') >= 0
  })
  .map((file) => {
    return path.join(cwd, 'src', file)
  })

async function build(name: string, globalsName: string, prod = false) {
  const indexMap = {
    react: 'indexReact.ts',
    css: 'indexCSS.ts',
    base: 'indexBase.ts',
    solid: 'indexSolid.ts'
  }

  const inputPath = path.join(cwd, 'src', indexMap[name])

  rimraf.sync(path.join(cwd, 'dist', name))

  const plugins = [
    esbuild({
      include: /\.[jt]sx?$/,
      target: 'es2015',
      minify: prod
    })
  ]

  if (prod) {
    plugins.push(
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      copy({
        targets: [{ src: 'types/nativeCssTypes.d.ts', dest: `dist/${name}` }]
      })
    )
  }

  const bundle = await rollup({
    input: inputPath,
    plugins,
    external: ['react', 'solid-js', 'solid-js/web']
  })

  const globals: Record<string, any> =
    {
      react: { react: 'React' }
    }[name] ?? {}

  if (prod) {
    typeFile.push({ name, files: bundle.watchFiles })

    if (name !== 'solid') {
      await bundle.write({
        globals,
        file: path.join(cwd, 'dist', name, `index.prod.global.js`),
        format: 'iife',
        name: globalsName
      })
    }
  }

  await bundle.write({
    file: path.join(cwd, 'dist', name, `index${prod ? '.prod' : ''}.esm.js`),
    format: 'esm'
  })

  await bundle.write({
    file: path.join(cwd, 'dist', name, `index${prod ? '.prod' : ''}.cjs.js`),
    format: 'cjs'
  })
}

async function compile(fileNames: string[], options: ts.CompilerOptions) {
  const createdFiles = {}
  const host = ts.createCompilerHost(options)
  host.writeFile = (fileName: string, contents: string) => {
    createdFiles[fileName] = contents
    return createdFiles[fileName]
  }

  const program = ts.createProgram(fileNames, options, host)
  program.emit()

  return createdFiles
}

async function run() {
  const spinner = ora('Compiling Typescript')

  spinner.start()
  await Promise.all([
    build('react', 'styilsReact'),
    build('solid', 'styilsSolid'),
    build('css', 'styilCss'),
    build('base', 'styilBase'),
    build('solid', 'styilsSolid', true),
    build('react', 'styilReact', true),
    build('css', 'styilCss', true),
    build('base', 'styilBase', true)
  ])

  spinner.succeed('Enter javascript successfully')

  spinner.start('Compiling d.ts')
  const dtsSouce = await compile(allFile, {
    emitDeclarationOnly: true,
    jsx: JsxEmit.React,
    suppressImplicitAnyIndexErrors: false,
    useDefineForClassFields: true,
    skipLibCheck: false,
    esModuleInterop: false,
    allowSyntheticDefaultImports: true,
    forceConsistentCasingInFileNames: true,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    resolveJsonModule: true,
    declaration: true
  })

  spinner.succeed('Enter d.ts successfully')

  const distFiles: { name: string; files: string[] }[] = []
  const packageFiles: { name: string; files: string[] }[] = []

  const enterJsCode = prettier.format(
    `
  if (process.env.NODE_ENV === 'production') {
    module.exports = require('./index.prod.cjs.js')
  } else {
    module.exports = require('./index.cjs.js')
  }
  `,
    { parser: 'babel', singleQuote: true }
  )

  const enterNodeEsmCode = `export * from './index.js'`

  while (typeFile.length) {
    const { name, files } = typeFile.shift()!

    distFiles.push({
      name,
      files: fs
        .readdirSync(path.join(cwd, 'dist', name))
        .filter((file) => {
          return file.indexOf('prod') >= 0
        })
        .map((file) => {
          return path.join(cwd, 'dist', name, file)
        })
    })

    fs.writeFileSync(path.join(cwd, 'dist', name, 'index.js'), enterJsCode)
    fs.writeFileSync(path.join(cwd, 'dist', name, 'index.mjs'), enterNodeEsmCode)

    const nameMap = {
      css: 'CSS',
      react: 'React',
      base: 'Base',
      solid: 'Solid'
    }

    files.forEach((file: string) => {
      const dts = file.replace('.ts', '.d.ts')

      fs.writeFileSync(
        dts.replace('src', path.join('dist', name)).replace(`index${nameMap[name]}`, 'index'),
        prettier
          .format(dtsSouce[dts], { parser: 'typescript', singleQuote: true })
          .replace(`'nativeCssTypes';`, `'./nativeCssTypes';`)
      )
    })

    packageFiles.push({ name, files: fs.readdirSync(path.join(cwd, 'dist', name)) })
  }

  packageFiles.forEach(({ name, files }) => {
    // eslint-disable-next-line global-require
    const json = require('./package.temp.json')

    json.name = `${packageBaseName}/${name}`
    json.files = files

    if (/solid/.test(name)) {
      json.unpkg = 'index.prod.esm.js'
      json.jsdelivr = 'index.prod.esm.js'
      delete json.exports['./global']
    }

    fs.writeFileSync(
      path.join(cwd, 'dist', name, 'package.json'),
      prettier.format(JSON.stringify(json), { parser: 'json' })
    )
    fs.writeFileSync(
      path.join(cwd, 'dist', name, '.npmrc'),
      `registry=https://registry.npmjs.org/
//registry.npmjs.org/:always-auth=true
//registry.npmjs.org/:_authToken=\${NODE_AUTH_TOKEN}`
    )

    const README = fs.readFileSync(path.join(cwd, 'README.md'))
    const READMEEN = fs.readFileSync(path.join(cwd, 'README.ZH.md'))

    fs.writeFileSync(path.join(cwd, 'dist', name, 'README.md'), README)

    fs.writeFileSync(path.join(cwd, 'dist', name, 'README.ZH.md'), READMEEN)
  })

  distFiles.forEach((item) => {
    const { name, files } = item
    const types: Record<string, Record<'min' | 'gzp', string>> = {}

    files.forEach((file) => {
      let type = file.split('.')[2]

      if (type === 'global') {
        type = 'gjs'
      }

      const code = fs.readFileSync(file)

      const variantMins = (Buffer.byteLength(code) / 1000).toFixed(2)
      const variantGzip = Number(zlib.gzipSync(code, { level: 9 }).length / 1000).toFixed(2)

      types[type] = {
        min: variantMins,
        gzp: variantGzip
      }
    })

    console.log(box({ name: `${packageBaseName}/${name}`, types }))
  })
}

run()
