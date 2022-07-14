// import { styled } from 'system'
import { styled } from '../../test'

const Code = styled('code', {
  fontFamily: 'monospace',
  backgroundColor: '#eaeaea',
  padding: '3px 5px',
  borderRadius: 4
})

function Page() {
  return (
    <>
      <h1>About</h1>
      <p>
        Demo using <Code>vite-plugin-ssr</Code>.
      </p>
    </>
  )
}

export { Page }
