import { styled } from 'system'

const Code = styled('code', {
  fontFamily: 'monospace',
  backgroundColor: '#eaeaea',
  padding: '3px 5px',
  borderRadius: 4
})

const Code2 = styled('code', {
  padding: '3px 5px',
  borderRadius: 4
})

function Page() {
  return (
    <>
      <h1>About</h1>
      <p>
        <Code2 />
        Demo using <Code>vite-plugin-ssr</Code>.
      </p>
    </>
  )
}

export { Page }
