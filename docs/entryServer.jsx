import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './src/App'
import { getCssValue } from '@styil/react'

export function render() {
  const style = getCssValue()
  const appHtml = ReactDOMServer.renderToString(<App />)

  return { appHtml, style }
}
