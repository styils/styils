import { useState } from 'react'

function App() {
  const [count, setCount] = useState<'small' | 'max'>('small')

  return (
    <>
      <button className="hello" onClick={() => setCount('max')}>
        {count}
      </button>
    </>
  )
}

export default App
