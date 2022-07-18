import { styled } from '@styil/react'
import React from 'react'
import Home from './Home'

const Root = styled('div', () => ({
  maxWidth: 1280,
  margin: '0 auto',
  minHeight: '100vh',
  padding: '0 64px'
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
  return (
    <Root>
      <Home />
      <Footer>
        <span>根据 MIT 许可证发布</span>
        <span>Copyright © 2022-present Zoy-l</span>
      </Footer>
    </Root>
  )
}
