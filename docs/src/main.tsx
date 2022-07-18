import React from 'react'
import ReactDOM from 'react-dom/client'
import { glob } from '@styil/react'
import App from './router'
import './md.css'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx'

SyntaxHighlighter.registerLanguage('jsx', jsx)

glob({
  html: {
    'scroll-behavior': 'smooth'
  },
  '*': {
    margin: 0,
    padding: 0
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
