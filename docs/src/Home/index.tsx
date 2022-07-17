import logo from '../../../logo.svg'
import styil from '../../../styil.svg'
import { styled } from '@styil/react'
import { FcElectricity, FcWorkflow, FcServices, FcRuler } from 'react-icons/fc'
import { FaReact, FaVuejs } from 'react-icons/fa'
import { AiOutlineHtml5 } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import Switch, { SwitchWapper } from './Switch'
import Card, { CardBox } from './Card'

const Root = styled('div', () => ({
  ':global': {
    body: {
      margin: 0
    }
  },
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto'
}))

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

  '& svg': {
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

const PrimaryWapper = styled('section', () => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '100px 0 126px 0'
}))

const Slogan = styled('section', () => ({
  fontSize: '2.5rem'
}))

const SloganWapper = styled('section', () => ({
  width: '50%'
}))

const Introduce = styled('section', () => ({
  display: 'flex',
  flexWrap: 'wrap',
  margin: '0 -12px',

  [`& ${CardBox}`]: {
    margin: 12,
    width: 'calc(100% / 4 - 72px)'
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

    '&:first-child': {
      backgroundColor: '#fb304f',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#f90428'
      }
    }
  }
}))

export default function Home() {
  return (
    <Root>
      <PrimaryWapper>
        <SloganWapper>
          <Slogan>
            <Styil src={styil} /> 有接近于零的运行时、SSR、主题和完全类型化的API, 它的大小只有3kb。
          </Slogan>

          <ButtonGroup>
            <Button as={Link} to="/docs">
              快速开始
            </Button>
            <Button>在Github上查看</Button>
          </ButtonGroup>
        </SloganWapper>

        <LogoWapper>
          <Logo src={logo} />
          <Switch />
          <SupportLabel datatype="html">
            <AiOutlineHtml5 fill="rgb(207,101,54)" />
            <span>Html</span>
          </SupportLabel>
          <SupportLabel datatype="react">
            <FaReact fill="rgb(130,218,246)" />
            <span>React</span>
          </SupportLabel>
          <SupportLabel datatype="vue">
            <FaVuejs />
            <span>Vue (开发中)</span>
          </SupportLabel>
        </LogoWapper>
      </PrimaryWapper>

      <Introduce>
        <Card icon={<FcElectricity />} name="快速的">
          在运行时避免不必要的样式道具，避免重复计算渲染。
        </Card>
        <Card icon={<FcWorkflow />} name="完全类型化">
          灵活的 API 和完整 TypeScript 类型。
        </Card>
        <Card icon={<FcServices />} name="主题化">
          提供一种自定义主题的简单方法，您可以更改颜色、字体、断点和您需要的一切。
        </Card>
        <Card icon={<FcRuler />} name="够小的">
          提供完整的功能的同时, 只有3kb的大小开销。
        </Card>
      </Introduce>
    </Root>
  )
}
