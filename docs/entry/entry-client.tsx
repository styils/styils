import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Router } from './router'

ReactDOM.hydrateRoot(
  document.getElementById('app')!,
  <BrowserRouter>
    <Router />
  </BrowserRouter>
)
