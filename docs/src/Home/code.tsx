import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { styled } from '@styil/react'
import reactSvg from '../svg/react.svg'
import vueSvg from '../svg/vue.svg'
import htmlSvg from '../svg/html.svg'
import React from 'react'

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

export const errorCode = `const Side = styled('div', () => ({
  transform: translateX(\`\${props.move}px\`);
}))

function foo() {
  // 每次 setMove 将创建多个几乎完全相同的CSS规则, 这种情况我们应该使用 style
  const [move, setMove] = useState(0)
  return <Side move={move} />
}`

export const baseCode = `import { styled } from '@styil/react';

// 我们可以添加 namespce 在开发类库的时候这可能很有用
const Image = styled({tag:'img',namespce:'label'},{ ... })

const Button = styled('button', {
  // :global 内的样式将生成全局样式
  ':global':{
    body:{
      ...
    },
  }
  fontSize: '13px',
  padding: '10px 15px',
  '&:hover': {
    fontSize: 18, // 默认单位是 px
  },
  '& .foo':{
    ...
  },
  [\`& \${Image}\`]:{
    ...
  }
});

render(<Button as="a" href="google.com"><Image/></Button>)
`

export const ssrCode = `import React from 'react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { getCssValue } from '@styil/react'
// import { getCssValue } from 'to-path'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <style
            dangerouslySetInnerHTML={{ __html: getCssValue() }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
`

export const keyframesCode = `const Foo = styled('div',{
  '@keyframes superAnimation': {
    '11.1%': {
      opacity: '0.9999'
    },
    '111%': {
      opacity: '1'
    }
  }
})
// or
import { keyframes } from '@styil/react'

const out = keyframes({
  from: {
    transform: 'rotate(0deg)'
  },
  to: {
    transform: 'rotate(360deg)'
  }
})

const Foo = styled('div',{
  animation: \`13s ease 1.5s infinite none running \${out}\`
})
,
`

export const globalCode = `import { global, SystemProvider } from '@styil/react'

global({
  body: {
    backgroundColor: 'red'
  }
})
// or
// 要使用主题功能, 必须被 \`SystemProvider\` 包裹
const Glob = global((theme) => ({
  body: {
    backgroundColor: theme.color
  }
}))
// or
const Foo = styled('div',{
  // 在styled内使用
  ':global':{
    body: { backgroundColor: 'red' }
  }
}

render(
  <SystemProvider>
    <Glob />
  </SystemProvider>
)
,
`

export const mediaCode = `const Root = styled('div', () => ({
  maxWidth: 1280,
  margin: '0 auto',
  minHeight: '100vh',
  padding: '0 64px',
  transition: 'padding .3s',
  '@media screen and (max-width: 900px)': {
    padding: '0 28px'
  }
}))
`

const CodeRoot = styled(
  'div',
  () => ({
    maxWidth: 1280,
    width: '55%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 64,
    transition: 'width .3s',
    '@media screen and (max-width: 1080px)': {
      width: '100%'
    }
  }),
  {
    padding: {
      false: {
        paddingBottom: 14
      }
    }
  }
)

const Code = styled('div', () => ({
  display: 'inline-block',
  borderRadius: 14,
  fontSize: 14,
  padding: '15px 20px 20px',
  margin: 0,
  wordBreak: 'normal',
  overflowX: 'auto',
  color: '#fff',
  background: '#363449'
}))

const CodeHeader = styled('div', () => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 20,

  '& section:first-child': {
    display: 'flex',
    alignItems: 'center',

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
  },

  '& section:last-child': {
    '& > img': {
      float: 'left',
      padding: '4px 8px',
      borderRadius: 6,
      margin: '0 10px',
      width: 18,
      height: 18,
      backgroundColor: 'rgba(0,0,0,0.1)'
    }
  }
}))

const CodeWeapper = styled('div', () => ({
  paddingBottom: 14,
  '& h2': {
    marginBottom: 6
  },
  '& strong': {
    color: '#fb304f',
    padding: 4
  },
  '& p': {
    lineHeight: 1.75,
    '&::before': {
      content: '-',
      padding: '0 8px'
    }
  }
}))

export const StyilCode = ({
  children,
  code,
  language = 'jsx',
  disabledType,
  variants = { padding: undefined }
}: {
  children: React.ReactNode
  language?: string
  code: string
  disabledType?: boolean
  variants?: { padding: 'false' }
}) => (
  <CodeRoot variants={variants}>
    <CodeWeapper>{children}</CodeWeapper>
    <Code>
      <CodeHeader>
        <section>
          <div />
          <div />
          <div />
        </section>
        {!disabledType && (
          <section>
            <img src={htmlSvg} alt="html" />
            <img src={reactSvg} alt="react" />
            <img src={vueSvg} alt="vue" />
          </section>
        )}
      </CodeHeader>
      <SyntaxHighlighter language={language} useInlineStyles={false}>
        {code}
      </SyntaxHighlighter>
    </Code>
  </CodeRoot>
)
