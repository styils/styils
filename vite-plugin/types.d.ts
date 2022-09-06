import { Options } from '@styils/babel-plugin'
import { PluginOption } from 'vite'
export { Options }

declare function Plugin(options?: Options & { enforce?: 'pre' | 'post' }): PluginOption

export default Plugin
