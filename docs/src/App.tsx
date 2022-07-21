import { styled, global } from './theme'
import React from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'
import Home from './Home'

import i18n from './i18n'

const Glob = global((theme) => ({
  html: {
    'scroll-behavior': 'smooth'
  },
  a: {
    textDecoration: 'none'
  },
  body: {
    color: theme.mainColor,
    fontSize: 16,
    backgroundColor: theme.bgColor
  },
  '*': {
    margin: 0,
    padding: 0
  }
}))

const Root = styled('div', () => ({
  maxWidth: 1280,
  margin: '0 auto',
  minHeight: '100vh',
  padding: '0 64px',
  transition: 'padding .3s',
  '@media screen and (max-width: 900px)': {
    padding: '0 28px'
  }
}))

const Footer = styled('footer', () => ({
  textAlign: 'center',
  padding: '20px 0',

  '& span': {
    display: 'block',
    color: 'rgb(100, 116, 139)',
    fontSize: '0.875rem'
  }
}))

export default function App() {
  const { t } = useTranslation()

  return (
    <I18nextProvider i18n={i18n}>
      <Root>
        <Glob />
        <Home />
        <Footer>
          <span>{t('license')}</span>
          <span>{t('copyright')}</span>
        </Footer>
      </Root>
    </I18nextProvider>
  )
}
