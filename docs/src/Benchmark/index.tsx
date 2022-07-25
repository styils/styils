import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { styled } from '../theme'

const BenchmarkRoot = styled('div', (theme) => ({
  minHeight: 'calc(100vh - 100px)',
  display: 'flex',
  paddingTop: 20,

  '& > div': {
    padding: '0 60px',

    '& ul': {
      display: 'flex'
    }
  },

  '& > ul': {
    flexShrink: 0,

    '& li': {
      fontSize: '14px',
      borderRadius: '12px',
      marginBottom: 14,
      display: 'block',
      lineHeight: '40px',
      padding: '0 20px',
      textAlign: 'center',
      color: theme.secondColor,
      backgroundColor: theme.bgSecondColor,
      boxShadow: theme.boxShadow,
      transition: 'all .3s',
      fontWeight: 500,

      '&:hover': {
        color: '#333',
        backgroundColor: '#e6e8eb'
      }
    }
  }
}))

export default function Benchmark() {
  return (
    <BenchmarkRoot>
      <ul>
        <li>
          <Link to="create-and-mount-button">创建并挂载按钮</Link>
        </li>
        <li>
          <Link to="change-a-variant">更改组件的变体</Link>
        </li>
        <li>
          <Link to="change-css-prop">更改道具中的值</Link>
        </li>
        <li>
          <Link to="sierpinski-triangle">谢尔宾斯基三角</Link>
        </li>
        <li>
          <Link to="mount-deep-tree">挂载深度样式</Link>
        </li>
        <li>
          <Link to="mount-wide-tree">挂载广度样式</Link>
        </li>
      </ul>
      <div>
        <Outlet />
      </div>
    </BenchmarkRoot>
  )
}
