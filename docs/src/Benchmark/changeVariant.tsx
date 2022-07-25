import { Link, Outlet } from 'react-router-dom'
import React from 'react'

export const changeVariant = import.meta.glob('./bench/change-a-variant/*.tsx', { eager: true })

export default function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link to="stitches-react-vc17">Stitches React</Link>
        </li>
        <li>
          <Link to="styled-components">Styled Components</Link>
        </li>
        <li>
          <Link to="styil-react">styil-react</Link>
        </li>
        <li>
          <Link to="emotion">Emotion</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  )
}
