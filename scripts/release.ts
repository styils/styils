import fs from 'fs'
import path from 'path'
import shell from 'shelljs'

import packageTemp from './package.temp.json'

const args = process.argv.slice(2)

function publish(args: string[]) {
  // eslint-disable-next-line prefer-const
  let [version, type] = args
  let command = 'npm publish'
  version = version.slice(1)
  packageTemp.version = version

  const isAlpha = /alpha/.test(version)
  const isBeta = /beta/.test(version)

  if (isAlpha) {
    command += ' --tag alpha'
  }

  if (isBeta) {
    command += ' --tag beta'
  }

  const targetPath: string[] = []

  switch (type) {
    case 'react':
    case 'css':
    case 'base':
      targetPath.push(path.join(__dirname, '..', 'dist', type))
      break
    case 'all':
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;['react', 'css', 'base'].forEach((id) => {
        targetPath.push(path.join(__dirname, '..', 'dist', id))
      })
      break
    default:
      console.log(`wrong tag ${type}, support{react, css, base, ass}`)
      process.exit(1)
  }

  fs.writeFileSync(path.join(__dirname, 'package.temp.json'), JSON.stringify(packageTemp))
  shell.exec('pnpm run build')

  try {
    targetPath.forEach((p) => {
      shell.exec(`cd ${p}&&${command}`)
    })
  } catch (err) {
    console.log(err?.message)
  }
}

publish(args)
