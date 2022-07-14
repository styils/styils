import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SystemProvider } from 'system'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SystemProvider>
      <App />
    </SystemProvider>
  </React.StrictMode>
)
