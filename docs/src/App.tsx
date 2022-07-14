import { useState } from 'react'
import Logo from './logo.svg'

function App() {
  const [count, setCount] = useState<'small' | 'max'>('small')

  return (
    <>
      <img src={Logo} alt="logo" />
      <button className="hello" onClick={() => setCount('max')}>
        {count}
      </button>
    </>
  )
}

export default App
