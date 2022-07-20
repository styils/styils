import { styled } from '@styil/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Home from './Home'

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
    <Root>
      <Home />
      <Footer>
        <span>{t('license')}</span>
        <span>{t('copyright')}</span>
      </Footer>
    </Root>
  )
}
