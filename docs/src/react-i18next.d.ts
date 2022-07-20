import 'react-i18next'
import en from './locales/en-us.json'
import zh from './locales/zh-cn.json'

declare module 'react-i18next' {
  interface Resources {
    en: typeof en
    zh: typeof zh
  }
}
