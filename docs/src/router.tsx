import { Routes, HashRouter, Route } from 'react-router-dom'
import { styled } from '@styil/react'
import Home from './Home'
import Docs from './Docs'

const Root = styled('div', () => ({
  maxWidth: 1280,
  margin: '0 auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
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

const Main = styled('main', () => ({
  flex: 1
}))

export default function StylsRouter() {
  return (
    <Root>
      <Main>
        <HashRouter>
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="/docs" element={<Docs />}>
              <Route />
            </Route>
          </Routes>
        </HashRouter>
      </Main>
      <Footer>
        <span>根据 MIT 许可证发布</span>
        <span>Copyright © 2022-present contributors of styil</span>
      </Footer>
    </Root>
  )
}
