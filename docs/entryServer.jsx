import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './src/App'
import { getCssValue } from '@styil/react'
import { I18nextProvider } from 'react-i18next'
import i18n from './src/i18n'

export function render() {
  const style = getCssValue()
  const appHtml = ReactDOMServer.renderToString(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  )

  return { appHtml, style }
}
