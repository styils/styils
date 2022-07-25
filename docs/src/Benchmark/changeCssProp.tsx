import { Link, Outlet } from 'react-router-dom'
import React from 'react'

export const changeCssProp = import.meta.glob('./bench/change-css-prop/*.tsx', { eager: true })

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
          <Link to="emotion">Emotion</Link>
        </li>
        <li>
          <Link to="baseline">Styil-react</Link>
        </li>
        <li>
          <Link to="baseline">Baseline</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  )
}
