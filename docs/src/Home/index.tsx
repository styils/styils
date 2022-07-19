import LogoSvg from '../../../logo.svg'
import StyilSvg from '../../../styil.svg'
import { styled } from '@styil/react'
import quickSvg from '../svg/quick.svg'
import copySvg from '../svg/copy.svg'
import sizeSvg from '../svg/size.svg'
import themeSvg from '../svg/theme.svg'
import okSvg from '../svg/ok.svg'
import tyoeSvg from '../svg/tyoe.svg'
import reactSvg from '../svg/react.svg'
import vueSvg from '../svg/vue.svg'
import htmlSvg from '../svg/html.svg'
import Switch, { SwitchWapper } from './Switch'
import Card, { CardBox } from './Card'

import React from 'react'
import {
  baseCode,
  errorCode,
  StyilCode,
  themeCode,
  variantsCode,
  ssrCode,
  keyframesCode,
  globalCode,
  mediaCode
} from './code'

const Logo = styled('img', {
  zIndex: 1,
  width: 180,
  filter: 'drop-shadow(0px 8px 6px rgba(26,58,70,0.8))'
})

const SupportLabel = styled('section', () => ({
  zIndex: 2,
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  marginRight: '2rem',
  color: '#707b8a',
  fontSize: '1.175rem',
  backgroundColor: '#e6e8eb8d',
  borderRadius: 12,
  padding: '10px 15px',
  backdropFilter: 'saturate(180%) blur(84px)',

  '& img': {
    height: '2rem',
    width: '2rem'
  },

  '& span': {
    paddingLeft: 6
  }
}))

const LogoWapper = styled('section', () => ({
  position: 'relative',
  width: '46%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@media screen and (max-width: 800px)': {
    display: 'none'
  },

  '&:after': {
    position: 'absolute',
    borderRadius: '50%',
    height: '100%',
    width: '80%',
    left: '50%',
    transform: 'translateX(-50%)',
    content: '',
    backgroundImage: 'linear-gradient(-45deg, #fb304f 50%,#00e155 50% )',
    filter: 'blur(62px)',
    opacity: 0.6
  },

  [`& ${Logo}`]: {
    animation: '10s ease 0s infinite none running complex'
  },

  [`& ${SwitchWapper}`]: {
    animation: '13s ease 1s infinite reverse none running complex',
    position: 'absolute',
    right: '20%',
    boxShadow: '0 2px 8px 2px rgb(104 112 118 / 0.17), 0 2px 4px -1px rgb(104 112 118 / 0.14);',
    top: 0
  },

  [`& ${SupportLabel}[datatype="react"]`]: {
    animation: '13s ease 0.5s infinite none running complex',
    boxShadow: '0 2px 8px 2px rgb(104 112 118 / 0.17), 0 2px 4px -1px rgb(104 112 118 / 0.14);',
    left: 60,
    bottom: 40
  },

  [`& ${SupportLabel}[datatype="html"]`]: {
    animation: '13s ease 1.5s infinite none running complex',
    boxShadow: '0 2px 8px 2px rgb(104 112 118 / 0.17), 0 2px 4px -1px rgb(104 112 118 / 0.14);',
    top: -20,
    left: 100
  },

  [`& ${SupportLabel}[datatype="vue"]`]: {
    boxShadow: '0 2px 8px 2px rgb(104 112 118 / 0.17), 0 2px 4px -1px rgb(104 112 118 / 0.14);',
    bottom: -40,
    right: 40
  },

  '@keyframes complex': {
    '0%': {
      transform: 'translateY(0px)'
    },
    '30%': {
      transform: 'translateY(-10px)'
    },
    '50%': {
      transform: 'translateY(4px)'
    },
    '70%': {
      transform: 'translateY(-15px)'
    },
    '100%': {
      transform: 'translateY(0px)'
    }
  }
}))

const Styil = styled('img', {
  height: 56,
  float: 'left',
  marginRight: 8
})

const SloganWapper = styled('section', () => ({
  width: '50%'
}))

const PrimaryWapper = styled('section', () => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '84px 0 96px 0',
  '@media screen and (max-width: 1000px)': {
    flexWrap: 'wrap',
    padding: '64px 0',

    [`& ${SloganWapper}`]: {
      width: '100%'
    },
    [`& ${LogoWapper}`]: {
      display: 'none'
    }
  }
}))

const CodeContent = styled('section', () => ({
  position: 'relative'
}))

const Slogan = styled('section', () => ({
  fontSize: 42,
  '@media screen and (max-width: 1000px)': {
    fontSize: 36,

    '& img': {
      height: 40
    }
  }
}))

const Introduce = styled('section', () => ({
  display: 'flex',
  flexWrap: 'wrap',
  margin: '0 -12px',

  [`& ${CardBox}`]: {
    margin: 12,
    width: 'calc(100% / 4 - 72px)',
    '@media screen and (max-width: 1000px)': {
      width: 'calc(100% / 2 - 72px)'
    },
    '@media screen and (max-width: 600px)': {
      width: 'calc(100% - 72px)'
    }
  }
}))

const Button = styled('button', () => ({
  textDecoration: 'none',
  display: 'inline-block',
  border: 'none',
  textAlign: 'center',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  transition: 'color .25s,border-color .25s,background-color .25s',
  borderRadius: '12px',
  padding: '0 20px',
  lineHeight: '40px',
  fontSize: '14px',
  cursor: 'pointer',

  '&:hover': {
    color: '#213547',
    backgroundColor: '#e5e5e5'
  }
}))

const ButtonGroup = styled('section', () => ({
  paddingTop: 62,
  [`& ${Button}`]: {
    marginRight: 16,
    backgroundColor: '#e6e8eb8d',

    '&:first-child': {
      backgroundColor: '#fb304f',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#f90428'
      }
    }
  }
}))

const InstallBox = styled('div', () => ({
  width: 'fit-content',
  padding: '0 20px',
  lineHeight: '40px',
  marginTop: 20,
  color: '#687076',
  backdropFilter: 'saturate(180%) blur(10px)',
  background: 'rgba(255, 255, 255, 0.3)',
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 2px 8px 2px rgb(104 112 118 / 0.07), 0 2px 4px -1px rgb(104 112 118 / 0.04)',
  strong: {
    paddingRight: 10
  },
  '& img': {
    cursor: 'pointer',
    display: 'block',
    height: 18,
    paddingLeft: 10
  }
}))

const Author = styled('section', () => ({
  position: 'absolute',
  height: '100%',

  '@media screen and (max-width: 1080px)': {
    display: 'none'
  },

  '& a': {
    fontSize: '14px',
    borderRadius: '12px',
    margin: '14px 0',
    display: 'block',
    lineHeight: '40px',
    padding: '0 20px',
    textAlign: 'center',
    color: '#687076',
    backgroundColor: '#e6e8eb8d',
    transition: 'all .3s',
    fontWeight: 500,

    '&:hover': {
      color: '#333',
      backgroundColor: '#e6e8eb'
    }
  },

  '& div': {
    top: 86,
    position: 'sticky'
  }
}))

const Title = styled('h1', () => ({
  textAlign: 'center',
  padding: 64
}))

export default function Home() {
  const installRef = React.useRef<HTMLPreElement>(null)
  const [copyCssIcon, setCopyCssIcon] = React.useState(copySvg)
  const [copyReactIcon, setCopyReactIcon] = React.useState(copySvg)

  const copyCss = React.useCallback(() => {
    navigator.clipboard.writeText(installRef.current.innerText).then(() => {
      setCopyCssIcon(okSvg)

      const timer = setTimeout(() => {
        setCopyCssIcon(copySvg)
        clearTimeout(timer)
      }, 1000)
    })
  }, [])

  const copyReact = React.useCallback(() => {
    navigator.clipboard.writeText(installRef.current.innerText).then(() => {
      setCopyReactIcon(okSvg)

      const timer = setTimeout(() => {
        setCopyReactIcon(copySvg)
        clearTimeout(timer)
      }, 1000)
    })
  }, [])

  return (
    <>
      <PrimaryWapper>
        <SloganWapper>
          <Slogan>
            <Styil src={StyilSvg} /> 有接近于零的运行时、SSR、主题和完全类型化的API,
            它的大小只有3kb。
          </Slogan>

          <ButtonGroup>
            <Button as="a" href="#quick">
              快速开始
            </Button>
            <Button as="a" href="https://github.com/zoy-l/styil" target="_blank">
              在Github上查看
            </Button>
            <InstallBox>
              <strong>$</strong>
              <pre ref={installRef}>npm install @styil/react</pre>
              <img src={copyReactIcon} alt="copy" onClick={() => copyReact()} aria-hidden="true" />
            </InstallBox>
            <InstallBox>
              <strong>$</strong>
              <pre ref={installRef}>npm install @styil/css</pre>
              <img src={copyCssIcon} alt="copy" onClick={() => copyCss()} aria-hidden="true" />
            </InstallBox>
          </ButtonGroup>
        </SloganWapper>

        <LogoWapper>
          <Logo src={LogoSvg} />
          <Switch />
          <SupportLabel datatype="html">
            <img src={htmlSvg} alt="html" />
            <span>Html</span>
          </SupportLabel>
          <SupportLabel datatype="react">
            <img src={reactSvg} alt="react" />
            <span>React</span>
          </SupportLabel>
          <SupportLabel datatype="vue">
            <img src={vueSvg} alt="vue" />
            <span>Vue (开发中)</span>
          </SupportLabel>
        </LogoWapper>
      </PrimaryWapper>

      <Introduce>
        <Card icon={<img src={quickSvg} alt="quick" />} name="快速的">
          在运行时避免不必要的样式道具，避免重复计算渲染。
        </Card>
        <Card icon={<img src={tyoeSvg} alt="type" />} name="完全类型化">
          灵活的 API 和完整 TypeScript 类型。
        </Card>
        <Card icon={<img src={themeSvg} alt="theme" />} name="主题化">
          提供一种自定义主题的简单方法，您可以更改颜色、字体、断点和您需要的一切。
        </Card>
        <Card icon={<img src={sizeSvg} alt="size" />} name="够小的">
          提供完整的功能的同时, 只有3kb的大小开销。
        </Card>
      </Introduce>
      <Title id="quick">快速开始</Title>
      <CodeContent>
        <Author>
          <div>
            <a href="#base">基础使用</a>
            <a href="#variants">动态渲染</a>
            <a href="#theme">使用主题</a>
            <a href="#ssr">服务端渲染</a>
            <a href="#keyframes">动画 Keyframes</a>
            <a href="#global">全局 Global</a>
            <a href="#media">查询 Media</a>
          </div>
        </Author>

        <StyilCode code={baseCode}>
          <h2 id="base">基础使用</h2>
          <p>
            在用法上和其它上的 <strong>CSS In JS</strong> 框架几乎没有区别
          </p>
          <p>
            支持特殊嵌套选择器<strong>`&`</strong>及<strong>CSS</strong>所有原生选择器,
            还提供了一个多态<strong>`as`</strong>属性，用于定义组件渲染的标签
          </p>
          <p>
            此外，如果使用<strong>Typescript</strong>, 添加<strong>`as`</strong>
            道具时，道具定义会更新
          </p>
        </StyilCode>

        <StyilCode code={variantsCode} variants={{ padding: 'false' }}>
          <h2 id="variants">动态渲染</h2>
          <p>
            创建的样式组件都带有一个<strong>`variants`</strong>
            属性
          </p>
          <p>可以定义单个动态规则、多个动态规则，甚至是复合动态规则</p>
        </StyilCode>

        <StyilCode code={errorCode} disabledType>
          <p>
            动态插值代替 props 道具传递，因为通过props传值会带来较大的性能开销,
            此外我们可能写出下面这段代码。
          </p>
        </StyilCode>

        <StyilCode code={themeCode}>
          <h2 id="theme">使用主题</h2>
          <p>
            <strong>Styil</strong>
            提供完全自由的主题体验。根据需要可以将它们应用到任何你想要的地方。
          </p>
        </StyilCode>

        <StyilCode code={ssrCode}>
          <h2 id="ssr">服务端渲染</h2>
          <p>
            <strong>Styil</strong>
            提供完全自由的主题体验。根据需要可以将它们应用到任何你想要的地方。
          </p>
          <p>
            如果使用主题<strong>getCssValue</strong>
            应该从<strong>createSystem</strong>导出
          </p>
        </StyilCode>

        <StyilCode code={keyframesCode}>
          <h2 id="keyframes">动画 Keyframes</h2>
          <p>
            <strong>Styil</strong> 提供两种方式定义, 任你喜欢。
          </p>
        </StyilCode>

        <StyilCode code={globalCode}>
          <h2 id="global">全局 Global</h2>
          <p>
            <strong>Styil</strong> 提供两种方式定义, 任你喜欢。
          </p>
        </StyilCode>

        <StyilCode code={mediaCode} variants={{ padding: 'false' }}>
          <h2 id="media">查询 Media</h2>
          <p>
            就像在常规<strong>CSS</strong>中使用媒体查询一样，可以将<strong>@media</strong>
            直接放在<strong>CSS</strong>块中。
          </p>
        </StyilCode>
      </CodeContent>
    </>
  )
}
