import React from 'react'
import ReactDOM from 'react-dom/client'
import { global } from '@styil/react'
import App from './App'
import './codeTheme.css'
import i18n from './i18n'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx'
import { I18nextProvider } from 'react-i18next'

SyntaxHighlighter.registerLanguage('jsx', jsx)

global({
  html: {
    'scroll-behavior': 'smooth'
  },
  a: {
    textDecoration: 'none'
  },
  body: {
    color: 'rgb(33, 53, 71)',
    fontSize: 16
  },
  '*': {
    margin: 0,
    padding: 0
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
)
