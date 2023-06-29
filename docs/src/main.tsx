import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { App } from './App'
import './codeTheme.css'
import { SystemProvider } from './theme'

// SSG
ReactDOM.render(
  <SystemProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </SystemProvider>,
  document.getElementById('root')
)
