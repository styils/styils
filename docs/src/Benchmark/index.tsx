import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function Benchmark() {
  return (
    <div>
      <ul>
        <li>
          <Link to="create-and-mount-button">Create and mount a new button</Link>
        </li>
        <li>
          <Link to="change-a-variant">Change a variant on a mounted component</Link>
        </li>
        <li>
          <Link to="change-css-prop">Change a value inside a CSS prop</Link>
        </li>
        <li>
          <Link to="sierpinski-triangle">Sierpinski Triangle</Link>
        </li>
        <li>
          <Link to="mount-deep-tree">Mount deep tree</Link>
        </li>
        <li>
          <Link to="mount-wide-tree">Mount wide tree</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  )
}
