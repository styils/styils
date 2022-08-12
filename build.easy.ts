import { BuildConfig } from 'build-easy'

export default {
  moduleType: 'cjs',
  target: 'node',
  packageDirName: '.',
  packages: ['babel-plugin', 'vite-plugin'],
  tsCompilerOptions: {
    noEmit: false
  }
} as BuildConfig
