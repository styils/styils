import { useState } from 'react'

import './App.css'
import { styled, useSystem } from './connone'

const Buto = styled(
  'div',
  (theme) => ({
    color: theme.color,
    display: 'block',
    width: '502px',
    backgroundColor: 'blue',
    '&:after': {
      content: 'hello'
    }
  }),
  (theme) => ({
    size: {
      small: {
        height: 100,
        backgroundColor: theme.color
      },
      max: {
        height: 200,
        backgroundColor: theme.color
      }
    }
  })
)

function App() {
  const [count, setCount] = useState<'small' | 'max'>('small')
  const { setMode, mode } = useSystem()

  // const [count1, setCount1] = useState(100)

  return (
    <>
      1{/* <Buto1 /> */}
      <Buto variants={{ size: count }} className="hello"></Buto>
      {/* <Buto count={count} /> */}
      <button className="hello" onClick={() => setCount('max')}>
        {count}
      </button>
      <button
        className="hello"
        onClick={() => {
          setMode(mode === 'max' ? 'light' : 'max')
        }}
      >
        {mode}
      </button>
      {/* <button className="hello" onClick={() => setCount1(count1 + 1)}>
        {count1}
      </button> */}
    </>
  )
}

export default App
