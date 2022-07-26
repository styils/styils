import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router-dom'
import { styled } from '../theme'

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
    padding: '10px 15px'
  },

  '& > div': {
    flex: 1,
    padding: '0 60px',
    '& p': {
      marginTop: 20,
      color: theme.secondColor
    },
    '& >div': {
      '& >ul': {
        display: 'flex',
        alignItems: 'center',
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
      padding: '0 20px',
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
  return (
    <BenchmarkRoot>
      <ul>
        <li>
          <Link to="create-and-mount-button">{t('create-and-mount-button')}</Link>
        </li>
        <li>
          <Link to="change-a-variant">{t('change-a-variant')}</Link>
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
      <div>
        <Outlet />
        <p>- {t('benchmarkDesc')}</p>
      </div>
    </BenchmarkRoot>
  )
}
