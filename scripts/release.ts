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

  const targetPath = path.join(__dirname, '..', 'dist', type)

  fs.writeFileSync(path.join(__dirname, 'package.temp.json'), JSON.stringify(packageTemp))
  shell.exec('pnpm run build')

  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    require(path.join(targetPath, 'package.json'))
    shell.exec(`cd ${targetPath}&&${command}`)
  } catch (err) {
    console.log(err?.message)
  }
}

publish(args)
