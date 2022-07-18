import React from 'react'
import ReactDOM from 'react-dom/client'
import { glob } from '@styil/react'
import StylsRouter from './router'
import './md.css'

glob({
  '*': {
    margin: 0,
    padding: 0
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StylsRouter />
  </React.StrictMode>
)
