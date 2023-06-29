import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { styled } from '../theme'
import Link from '../Link'

const BenchmarkRoot = styled('div', (theme) => ({
  minHeight: 'calc(100vh - 100px)',
  display: 'flex',
  paddingTop: 20,

  '.start-test': {
    color: '#fff',
    backgroundColor: '#fb304f',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    margin: '0 20px',
    float: 'right',
    padding: '10px 15px'
  },

  '& > div': {
    flex: 1,
    padding: '0 60px',

    '& >ul': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',

      marginBottom: 20,

      '& li': {
        marginRight: 20
      },

      '& a': {
        display: 'block',

        borderRadius: '12px',
        lineHeight: '40px',
        padding: '0 20px',
        color: theme.secondColor,
        backgroundColor: theme.bgSecondColor,
        boxShadow: theme.boxShadow,
        '&:hover': {
          color: '#333',
          backgroundColor: '#e6e8eb'
        }
      }
    }
  },

  '& > ul': {
    flexShrink: 0,

    '& li': {
      marginBottom: 14
    },

    '& a': {
      flexShrink: 0,
      display: 'block',
      fontSize: '14px',
      borderRadius: '12px',
      lineHeight: '40px',
      width: '210px',
      textAlign: 'center',
      color: theme.secondColor,
      backgroundColor: theme.bgSecondColor,
      boxShadow: theme.boxShadow,

      fontWeight: 500,

      '&:hover': {
        color: '#333',
        backgroundColor: '#e6e8eb'
      }
    }
  }
}))

export default function Benchmark() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const router = useNavigate()

  useEffect(() => {
    if (pathname === '/benchmark') {
      router('create-and-mount-button')
    }
  }, [pathname, router])

  return (
    <BenchmarkRoot>
      <ul>
        <li>
          <Link to="create-and-mount-button">{t('create-and-mount-button')}</Link>
        </li>
        <li>
          <Link to="change-variant">{t('change-a-variant')}</Link>
        </li>
        <li>
          <Link to="change-css-prop">{t('change-css-prop')}</Link>
        </li>
        <li>
          <Link to="sierpinski-triangle">{t('sierpinski-triangle')}</Link>
        </li>
        <li>
          <Link to="mount-deep-tree">{t('mount-deep-tree')}</Link>
        </li>
        <li>
          <Link to="mount-wide-tree">{t('mount-wide-tree')}</Link>
        </li>
      </ul>

      <Outlet />
    </BenchmarkRoot>
  )
}
