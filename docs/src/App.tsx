import { styled, global } from './theme'
import React from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Home from './Home'
import Benchmark from './Benchmark'

import ChangeVariant, { changeVariant } from './Benchmark/changeVariant'
import ChangeCSSProp, { changeCssProp } from './Benchmark/changeCssProp'

import CreateMountButton, { createMountButton } from './Benchmark/createAndMountButton'
import MountDeepTren, { mountDeepTree } from './Benchmark/mountDeepTree'

import MoutWideTree, { mountWideTree } from './Benchmark/mountWideTree'
import SierpinskiTriangle, { sierpinskiTriangle } from './Benchmark/sierpinskiTriangle'
import i18n from './i18n'

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
    fontSize: 16,
    backgroundColor: theme.bgColor,
    fontDisplay: 'optional',
    fontFamily: `PingFang SC,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`
  },
  '*': {
    color: theme.mainColor,
    listStyle: 'none',
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

const Header = styled('header', (theme) => ({
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
  top: '10%',
  right: 0,
  height: 32,
  zIndex: '99',
  position: 'absolute',
  display: 'flex',
  alignItems: 'flex-end',
  flexDirection: 'column',

  '& >*': {
    backdropFilter: 'saturate(180%) blur(84px)',
    backgroundColor: theme.bgSecondColor,
    marginBottom: 16,
    padding: '8px 15px',
    cursor: 'pointer',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,

    fontWeight: 500,
    userSelect: 'none',
    boxShadow: theme.boxShadow
  }
}))

const Translate = styled('div', {
  display: 'flex',
  alignItems: 'center',

  '&:active svg': {
    transform: 'scale(1.5)'
  },
  '& svg': {
    transition: 'all .3s',
    paddingRight: 8
  }
})

export default function App() {
  const { t } = useTranslation()

  const { pathname } = useLocation()

  const isBench = pathname.indexOf('benchmark') >= 0

  return (
    <I18nextProvider i18n={i18n}>
      <Root>
        <Header>
          <Translate
            onClick={() => {
              const currentLanguage = i18n.language === 'Zh' ? 'En' : 'Zh'
              localStorage.setItem('styil-doc-key', currentLanguage)
              i18n.changeLanguage(currentLanguage)
            }}
          >
            <svg fill="currentColor" viewBox="0 0 24 24" height="1.5em" width="1.5em">
              <path d="M5 15v2a2 2 0 0 0 1.85 1.995L7 19h3v2H7a4 4 0 0 1-4-4v-2h2zm13-5l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16 10h2zm-1 2.885L15.753 16h2.492L17 12.885zM8 2v2h4v7H8v3H6v-3H2V4h4V2h2zm9 1a4 4 0 0 1 4 4v2h-2V7a2 2 0 0 0-2-2h-3V3h3zM6 6H4v3h2V6zm4 0H8v3h2V6z" />
            </svg>
            {i18n.language}
          </Translate>
          {isBench ? (
            <Link to="/styil/">{t('back')}</Link>
          ) : (
            <Link to="/styil/benchmark/">{t('bench')}</Link>
          )}
        </Header>
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
