import { Outlet } from 'react-router-dom'
import { styled } from '@styil/react'
import logo from '../../../logo.svg'
import styil from '../../../styil.svg'

const DocsRoot = styled('section', () => ({
  // margin: '0 auto'
}))

const Aside = styled('aside', () => ({
  paddingRight: '2rem',
  paddingTop: '2rem',

  '& >a': {
    fontWeight: 600,
    textDecoration: 'none',
    color: 'rgb(15, 23, 42)'
  },
  '& ul': {
    marginTop: '1rem',
    paddingLeft: '1.5rem',
    borderLeft: '1px solid rgb(226, 232, 240)'
  },

  '& ul li': {
    listStyle: 'none',
    margin: '0.5rem 0',

    '& a': {
      color: '#334155',
      textDecoration: 'none'
    }
  }
}))

const Header = styled('section', () => ({
  height: 64,
  display: 'flex',
  alignItems: 'center'
}))

const Styil = styled('div', () => ({
  display: 'flex',
  alignItems: 'center',
  '& img:first-child': {
    height: 24,
    marginRight: 10
  },

  '& img:last-child': {
    height: 16
  }
}))

export default function Docs() {
  return (
    <DocsRoot>
      <Header>
        <Styil>
          <img src={logo} alt="logo" />
          <img src={styil} alt="styil" />
        </Styil>
      </Header>
      <Aside>
        <a href="#1">概述</a>
        <ul>
          <li>
            <a href="#2">介绍</a>
          </li>
          <li>
            <a href="#1">常见问题</a>
          </li>
          <li>
            <a href="#2">基准测试</a>
          </li>
        </ul>
        <a href="#1">使用 React</a>
        <ul>
          <li>
            <a href="#2">安装</a>
          </li>
        </ul>
        <a href="#1">使用 CSS</a>
        <ul>
          <li>
            <a href="#2">安装</a>
          </li>
        </ul>
        <a href="#1">API</a>
        <ul>
          <li>
            <a href="#2">安装</a>
          </li>
        </ul>
      </Aside>
      <Outlet />
    </DocsRoot>
  )
}
