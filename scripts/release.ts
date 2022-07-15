import fs from 'fs'
import path from 'path'
import shell from 'shelljs'

import packageTemp from './package.temp.json'

const args = process.argv.slice(2)[0].slice(1)

function publish(args: string) {
  let command = 'npm publish'
  const [version, tag, type] = args.split('-')
  packageTemp.version = `${version}-${tag}`

  if (tag === 'alpha') {
    command += ' --tag alpha'
  }

  if (tag === 'beta') {
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
