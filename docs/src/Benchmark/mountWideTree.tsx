import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import Link from '../Link'

export const mountWideTree = import.meta.glob('./bench/mount-wide-tree/*.tsx', { eager: true })

export default function Home() {
  const { pathname } = useLocation()
  const router = useNavigate()

  useEffect(() => {
    if (pathname === '/benchmark/mount-wide-tree') {
      router('stitches-react')
    }
  }, [pathname, router])

  return (
    <div>
      <ul>
        <li>
          <Link to="stitches-react">Stitches React</Link>
        </li>
        <li>
          <Link to="styled-components">Styled components</Link>
        </li>
        <li>
          <Link to="emotion">Emotion</Link>
        </li>
        <li>
          <Link to="styils-react">styils-react</Link>
        </li>
        <li>
          <Link to="baseline">baseline</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  )
}
