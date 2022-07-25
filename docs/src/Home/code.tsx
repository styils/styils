import { styled } from '../theme'
import reactSvg from '../svg/react.svg'
import vueSvg from '../svg/vue.svg'
import htmlSvg from '../svg/html.svg'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'

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

const Code = styled('div', (theme) => ({
  display: 'inline-block',
  borderRadius: 14,
  fontSize: 14,
  padding: '15px 20px 20px',
  margin: 0,
  wordBreak: 'normal',
  overflowX: 'auto',
  color: '#fff',
  background: theme.codeBg
}))

const CodeHeader = styled('div', () => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 16,

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
  disabledType,
  variants = { padding: undefined }
}: {
  children: React.ReactNode
  language?: string
  code: string
  disabledType?: boolean
  variants?: { padding: 'false' }
}) => {
  const { t } = useTranslation()
  const variantsCode = `import { styled } from '@styil/react'

const Button = styled(
  'button',
  {
    fontSize: 14
  },
  // ${t('variantsCode')}
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

  const themeCode = `import { createSystem } from '@styil/react'

const { styled, SystemProvider, useSystem } = createSystem({
  theme(mode) {
    return {
      color: mode === 'light' ? '#333' : '#fff',
      ...other // ${t('themeCode')}
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

  const errorCode = `const Side = styled('div', () => ({
  transform: translateX(\`\${props.move}px\`);
}))

function foo() {
  // ${t('errorCode')}
  const [move, setMove] = useState(0)
  return <Side move={move} />
}`

  const baseCode = `import { styled } from '@styil/react';

// ${t('baseCode.1')}
const Image = styled({tag:'img',namespce:'label'},{ ... })

const Button = styled('button', {
  // ${t('baseCode.2')}
  ':global':{
    body:{
      ...
    },
  }
  fontSize: '13px',
  padding: '10px 15px',
  '&:hover': {
    fontSize: 18, // ${t('baseCode.3')}
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

  const ssrCode = `import React from 'react'
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

  const keyframesCode = `const Foo = styled('div',{
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

  const globalCode = `import { global, SystemProvider } from '@styil/react'

global({
  body: {
    backgroundColor: 'red'
  }
})
// or
global((theme) => ({
  body: {
    backgroundColor: theme.color
  }
}))
// or
const Foo = styled('div',{
  // ${t('globalCode')}
  ':global':{
    body: { backgroundColor: 'red' }
  }
}
`

  const mediaCode = `const Root = styled('div', () => ({
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

  const codes = {
    mediaCode,
    globalCode,
    baseCode,
    ssrCode,
    keyframesCode,
    errorCode,
    themeCode,
    variantsCode
  }

  const codeRef = React.createRef<HTMLPreElement>()

  React.useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [codeRef])

  return (
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
        <pre>
          <code className="language-jsx" ref={codeRef}>
            {codes[code]}
          </code>
        </pre>
      </Code>
    </CodeRoot>
  )
}
