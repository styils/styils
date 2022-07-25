import { styled, global } from './theme'
import React from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'
import { Link, Route, Routes } from 'react-router-dom'
import Home from './Home'

import i18n from './i18n'
import Benchmark from './Benchmark'

import ChangeVariant, { changeVariant } from './Benchmark/changeVariant'
import ChangeCSSProp, { changeCssProp } from './Benchmark/changeCssProp'

import CreateMountButton, { createMountButton } from './Benchmark/createAndMountButton'
import MountDeepTren, { mountDeepTree } from './Benchmark/mountDeepTree'

import MoutWideTree, { mountWideTree } from './Benchmark/mountWideTree'
import SierpinskiTriangle, { sierpinskiTriangle } from './Benchmark/sierpinskiTriangle'

function getPathElement(modules: Record<string, any>, base: string) {
  const child = []

  Object.keys(modules).forEach((path) => {
    child.push({
      path: path.replace('.tsx', '').replace(`./bench/${base}/`, ''),
      Element: modules[path].default
    })
  })

  return child
}

global((theme) => ({
  html: {
    'scroll-behavior': 'smooth'
  },
  a: {
    textDecoration: 'none'
  },
  body: {
    color: theme.mainColor,
    fontSize: 16,
    backgroundColor: theme.bgColor,
    fontDisplay: 'optional',
    fontFamily: `PingFang SC,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`
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
      <header>
        <Link to="/styil">Home</Link>
        <Link to="/styil/benchmark">benchmark</Link>
      </header>
      <Root>
        <Routes>
          <Route path="/styil" element={<Home />} />
          <Route path="/styil/benchmark" element={<Benchmark />}>
            <Route path="change-a-variant" element={<ChangeVariant />}>
              {getPathElement(changeVariant, 'change-a-variant').map(({ path, Element }) => {
                return <Route key={path} path={path} element={<Element />} />
              })}
            </Route>
            <Route path="change-css-prop" element={<ChangeCSSProp />}>
              {getPathElement(changeCssProp, 'change-css-prop').map(({ path, Element }) => {
                return <Route key={path} path={path} element={<Element />} />
              })}
            </Route>

            <Route path="create-and-mount-button" element={<CreateMountButton />}>
              {getPathElement(createMountButton, 'create-and-mount-button').map(
                ({ path, Element }) => {
                  return <Route key={path} path={path} element={<Element />} />
                }
              )}
            </Route>
            <Route path="mount-deep-tree" element={<MountDeepTren />}>
              {getPathElement(mountDeepTree, 'mount-deep-tree').map(({ path, Element }) => {
                return <Route key={path} path={path} element={<Element />} />
              })}
            </Route>

            <Route path="mount-wide-tree" element={<MoutWideTree />}>
              {getPathElement(mountWideTree, 'mount-wide-tree').map(({ path, Element }) => {
                return <Route key={path} path={path} element={<Element />} />
              })}
            </Route>
            <Route path="sierpinski-triangle" element={<SierpinskiTriangle />}>
              {getPathElement(sierpinskiTriangle, 'sierpinski-triangle').map(
                ({ path, Element }) => {
                  return <Route key={path} path={path} element={<Element />} />
                }
              )}
            </Route>
          </Route>
        </Routes>

        <Footer>
          <span>{t('license')}</span>
          <span>{t('copyright')}</span>
        </Footer>
      </Root>
    </I18nextProvider>
  )
}
