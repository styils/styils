import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './codeTheme.css'
import { SystemProvider } from './theme'

// SSG
ReactDOM[process.env.NODE_ENV === 'production' ? 'hydrate' : 'render'](
  <SystemProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SystemProvider>,
  document.getElementById('root')
)
