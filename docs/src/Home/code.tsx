import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import { styled } from '@styil/react'

SyntaxHighlighter.registerLanguage('jsx', jsx)

export const variantsCode = `import { styled } from '@styil/react'

const Button = styled(
  'button',
  {
    fontSize: 14
  },
  // variants 为 styled 的第三个参数
  {
    size: {
      small: {
        fontSize: 12
      },
      large: {
        fontSize: 16
      }
    }
  }
)

render(<Button variants={{ size: 'small' }}>Button</Button>)
`

export const themeCode = `import { createSystem } from '@styil/react'

const { styled, SystemProvider, useSystem } = createSystem({
  theme(mode) {
    return {
      color: mode === 'light' ? '#333' : '#fff',
      ...other // 任何
    }
  }
})

const Button = styled('div', (theme) => {
  return {
    color: theme.color
  }
})

render(() => {
  const { mode, setMode, theme } = useSystem()

  return (
    <SystemProvider>
      <Button onClick={() => setMode('dark')}>hello styil {mode}</Button>
    </SystemProvider>
  )
})`

export const errorCode = `const Button = styled('div', () => ({
  transform: translateX(props.move);
}))

function foo() {
  const [move, setMove] = useState(0)

  return <Button move={move} />
}`

export const polymorphismCode = `const Button = styled('button', {})
<Button as="a" href="google.com">go</Button>
`

export const bashCode = `npm install @styil/react
# or
yarn add @styil/react
# or
pnpm add @styil/react
`

export const baseCode = `import { styled } from '@styil/react';

const Button = styled('button', {
  fontSize: '13px',
  padding: '10px 15px',
  '&:hover': {
    fontSize: 18, // 默认单位是 px
  },
});

render(<Button/>)
`

const CodeRoot = styled('div', () => ({
  display: 'flex',
  paddingBottom: 64,
  justifyContent: 'space-between',

  '& >*': {
    width: '45%'
  }
}))

const Code = styled('div', () => ({
  display: 'inline-block',
  borderRadius: 14,
  fontSize: 14,
  padding: 20,
  margin: 0,
  wordBreak: 'normal',
  overflowX: 'auto',
  color: '#fff',
  background: '#363449'
}))

const CodeHeader = styled('div', () => ({
  display: 'flex',
  marginBottom: 20,

  '& div': {
    width: 14,
    height: 14,
    borderRadius: '50%',
    marginRight: 10
  },
  '& div:nth-child(1)': {
    backgroundColor: '#F31260'
  },
  '& div:nth-child(2)': {
    backgroundColor: '#F5A524'
  },
  '& div:nth-child(3)': {
    backgroundColor: '#17C964'
  }
}))

const CodeWeapper = styled('div', () => ({}))

export const StyilCode = ({
  children,
  code,
  align = 'left',
  language = 'jsx'
}: {
  children: React.ReactNode
  language?: string
  code: string
  align?: 'left' | 'right'
}) => (
  <CodeRoot>
    {align === 'left' && <CodeWeapper>{children}</CodeWeapper>}
    <Code>
      <CodeHeader>
        <div />
        <div />
        <div />
      </CodeHeader>
      <SyntaxHighlighter language={language} useInlineStyles={false}>
        {code}
      </SyntaxHighlighter>
    </Code>
    {align === 'right' && <CodeWeapper>{children}</CodeWeapper>}
  </CodeRoot>
)
