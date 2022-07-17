import { styled } from '@styls/react'
import React from 'react'

export const CardBox = styled('div', () => ({
  backdropFilter: 'saturate(180%) blur(14px)',
  background: 'rgba(255, 255, 255, 0.05)',
  boxShadow: '0 2px 8px 2px rgb(104 112 118 / 0.07), 0 2px 4px -1px rgb(104 112 118 / 0.04);',
  borderRadius: '14px',
  display: 'flex',
  flexDirection: 'column',
  padding: 24,
  color: '#687076'
}))

const CardHeader = styled('section', () => ({
  display: 'flex',
  alignItems: 'center',

  paddingBottom: 16,

  '& div': {
    width: 40,
    height: 40,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0FB',

    '& svg': {
      height: '60%',
      width: '60%'
    }
  },

  '& span': {
    marginLeft: 16,
    color: '#11181C',
    fontWeight: 500,
    fontSize: '1.1rem'
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
