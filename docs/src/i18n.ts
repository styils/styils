import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import cn from './locales/zh-cn.json'
import en from './locales/en-us.json'

const resources = {
  Zh: {
    translation: cn
  },
  En: {
    translation: en
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: import.meta.env.SSR ? 'En' : localStorage.getItem('styils-doc-key') ?? 'En',
  debug: false,
  interpolation: {
    escapeValue: false
  },
  detection: {
    caches: ['localStorage', 'sessionStorage', 'cookie']
  }
})

export default i18n
