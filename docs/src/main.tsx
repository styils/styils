import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './codeTheme.css'
import { SystemProvider } from './theme'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <SystemProvider>
    <App />
  </SystemProvider>
)
