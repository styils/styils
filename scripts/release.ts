import fs from 'fs'
import path from 'path'
import shell from 'shelljs'
import { format } from 'prettier'
import packageTemp from './package.temp.json'

const args = process.argv.slice(2)[0].slice(1)

async function publish(args: string) {
  let command = 'pnpm publish'
  let version = ''
  let tag = ''
  let type = ''

  const arg = args.split('-')
  if (arg.length === 2) {
    version = arg[0]
    type = arg[1]
  } else if (arg.length === 3) {
    version = arg[0]
    tag = arg[1]
    type = arg[2]
  } else {
    console.log(`unsupported format ${args}, example: v1.1.1-alpha-react or v1.1.1-react`)
    process.exit(1)
  }

  if (tag === 'alpha') {
    tag = '-alpha'
    command += ' --tag alpha'
  }

  if (tag === 'beta') {
    tag = '-beta'
    command += ' --tag beta'
  }

  const targetPath: string[] = []

  switch (type) {
    case 'react':
    case 'css':
    case 'base':
    case 'solid':
    case 'vue':
      targetPath.push(path.join(__dirname, '..', 'dist', type))
      break
    case 'plugin':
      targetPath.push(
        path.join(__dirname, '..', 'babel-plugin'),
        path.join(__dirname, '..', 'vite-plugin')
      )
      break
    case 'all':
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;['react', 'css', 'base', 'solid'].forEach((id) => {
        targetPath.push(path.join(__dirname, '..', 'dist', id))
      })
      break
    default:
      console.log(`wrong tag ${type}, support{react, css, solid, base}`)
      process.exit(1)
  }

  if (type !== 'plugin') {
    packageTemp.version = `${version}${tag}`

    fs.writeFileSync(path.join(__dirname, 'package.temp.json'), JSON.stringify(packageTemp))
  } else {
    // eslint-disable-next-line global-require
    const packageBabelJson = require('../babel-plugin/package.json')

    packageBabelJson.version = `${version}${tag}`

    fs.writeFileSync(
      path.join(__dirname, '..', 'babel-plugin', 'package.json'),
      format(JSON.stringify(packageBabelJson), { parser: 'json' })
    )

    // eslint-disable-next-line global-require
    const packageViteJson = require('../vite-plugin/package.json')

    packageViteJson.version = `${version}${tag}`

    fs.writeFileSync(
      path.join(__dirname, '..', 'vite-plugin', 'package.json'),
      format(JSON.stringify(packageViteJson), { parser: 'json' })
    )

    fs.writeFileSync(
      path.join(__dirname, '..', 'babel-plugin', '.npmrc'),
      `registry=https://registry.npmjs.org/
//registry.npmjs.org/:always-auth=true
//registry.npmjs.org/:_authToken=\${NODE_AUTH_TOKEN}
`
    )

    fs.writeFileSync(
      path.join(__dirname, '..', 'vite-plugin', '.npmrc'),
      `registry=https://registry.npmjs.org/
//registry.npmjs.org/:always-auth=true
//registry.npmjs.org/:_authToken=\${NODE_AUTH_TOKEN}
`
    )
  }

  try {
    targetPath.forEach((p) => {
      shell.exec(`cd ${p}&&${command} --no-git-checks`)
    })
  } catch (err) {
    console.log(err?.message)
  }
}

publish(args)
