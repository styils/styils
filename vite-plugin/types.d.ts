import { Options } from '@styils/babel-plugin'
import { PluginOption } from 'vite'
export { Options }
export default (options?: Options & { enforce?: 'pre' | 'post' }) => PluginOption
