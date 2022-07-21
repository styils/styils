import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx'
import './codeTheme.css'
import { SystemProvider } from './theme'

SyntaxHighlighter.registerLanguage('jsx', jsx)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <SystemProvider>
    <App />
  </SystemProvider>
)
