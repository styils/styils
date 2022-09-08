import { styled } from '../theme'
import React from 'react'

export const CardBox = styled('div', (theme) => ({
  backdropFilter: 'saturate(180%) blur(14px)',
  background: 'rgba(255, 255, 255, 0.05)',
  boxShadow: '0 2px 8px 2px rgb(104 112 118 / 0.07), 0 2px 4px -1px rgb(104 112 118 / 0.04);',
  borderRadius: '14px',
  display: 'flex',
  flexDirection: 'column',
  padding: 24,
  color: theme.secondColor
}))

const CardHeader = styled('section', (theme) => ({
  display: 'flex',
  alignItems: 'center',
  paddingBottom: 16,

  '& div': {
    width: 40,
    height: 40,
    flexShrink: 0,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0FB',

    '& img': {
      height: '60%',
      width: '60%'
    }
  },

  '& span': {
    marginLeft: 12,
    fontWeight: 500,
    color: theme.mainColor
  }
}))

export default function Card(props: {
  icon: React.ReactNode
  name: string
  children: React.ReactNode
}) {
  const { icon, name, children } = props

  return (
    <CardBox>
      <CardHeader>
        <div>{icon}</div>
        <span>{name}</span>
      </CardHeader>
      {children}
    </CardBox>
  )
}
