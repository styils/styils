import React from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'

const activeStyle = {
  color: '#333',
  backgroundColor: '#e6e8eb'
}

export default function Link({ children, ...rest }: NavLinkProps) {
  return (
    <NavLink style={({ isActive }) => (isActive ? activeStyle : {})} {...rest}>
      {children}
    </NavLink>
  )
}
