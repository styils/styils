/* eslint-disable jsx-a11y/no-static-element-interactions */
import LogoSvg from '../../../logo.svg'
import StyilSvg from '../../../styils.svg'
import { styled, useSystem, keyframes } from '../theme'
import quickSvg from '../svg/quick.svg'
import copySvg from '../svg/copy.svg'
import sizeSvg from '../svg/size.svg'
import themeSvg from '../svg/theme.svg'
import okSvg from '../svg/ok.svg'
import tyoeSvg from '../svg/tyoe.svg'
import reactSvg from '../svg/react.svg'
import solidSvg from '../svg/solid.svg'
import vueSvg from '../svg/vue.svg'
import Switch, { SwitchWapper } from './Switch'
import Card, { CardBox } from './Card'
import { useTranslation } from 'react-i18next'

import React from 'react'
import { StyilCode } from './code'

const complex = keyframes({
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
})

const Logo = styled('img', {
  zIndex: 1,
  width: 200,
  height: 240,
  transition: 'all .3s',
  filter: 'drop-shadow(0px 8px 6px rgba(26,58,70,0.8))'
})

const Styils = styled('img', {
  display: 'block',
  height: 65,
  width: 295,
  marginRight: 8,
  marginBottom: 12,
  '@media screen and (max-width: 1000px)': {
    height: 50,
    width: 220
  }
})

const SupportLabel = styled('section', (theme) => {
  return {
    zIndex: 2,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    marginRight: 32,
    color: theme.secondColor,
    borderRadius: 12,
    padding: '10px 15px',
    backdropFilter: 'saturate(180%) blur(84px)',
    backgroundColor: theme.bgSecondColor,

    '& img': {
      height: 30,
      width: 30
    },

    '& span': {
      paddingLeft: 6
    }
  }
})

const LogoWapper = styled('section', (theme) => ({
  position: 'relative',
  width: '46%',
  height: 399,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,

  span: {
    fontWeight: 'bold',
    color: theme.mainColor
  },

  '&:after': {
    position: 'absolute',
    borderRadius: '51%',
    height: '65%',
    width: '80%',
    left: '50%',
    transform: 'translateX(-50%)',
    content: '""',
    backgroundImage: 'linear-gradient(-45deg, #fb304f 50%,#00e155 50% )',
    filter: 'blur(62px)',
    opacity: 0.6
  },

  '& > *': {
    userSelect: 'none'
  },

  [`& ${Logo}`]: {
    animation: `10s ease 0s infinite none running ${complex}`
  },

  [`& ${SwitchWapper}`]: {
    animation: `13s ease 1s infinite reverse none running ${complex}`,
    position: 'absolute',
    right: '20%',
    boxShadow: theme.boxShadow,
    top: 0
  },

  [`& ${SupportLabel}[datatype="react"]`]: {
    animation: `13s ease 1.5s infinite none running ${complex}`,
    boxShadow: theme.boxShadow,
    top: 40,
    left: 40,
    '@media screen and (max-width: 580px)': {
      left: 20
    }
  },

  [`& ${SupportLabel}[datatype="solid"]`]: {
    animation: `10s ease 1.2s infinite none running ${complex}`,
    boxShadow: theme.boxShadow,
    bottom: 40,
    left: 40,
    '& img': {
      width: 40,
      height: 40
    },
    '@media screen and (max-width: 580px)': {
      left: 0
    }
  },

  [`& ${SupportLabel}[datatype="vue"]`]: {
    animation: `13s ease 0.5s infinite none running ${complex}`,
    boxShadow: theme.boxShadow,
    bottom: 30,
    right: 20,
    '@media screen and (max-width: 580px)': {
      right: 0
    },
    '& img': {
      width: 40,
      height: 40
    }
  }
}))

const SloganWapper = styled('section', () => ({
  width: '50%'
}))

const PrimaryWapper = styled('section', () => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '48px 0 96px 0',

  '@media screen and (max-width: 1000px)': {
    flexWrap: 'wrap',
    flexDirection: 'column-reverse',
    alignItems: 'center',
    padding: '48px 0 48px 0',

    [`& ${SloganWapper}`]: {
      width: '100%'
    },
    [`& ${LogoWapper}`]: {
      width: '100%',
      marginBottom: 36
    }
  }
}))

const CodeContent = styled('section', () => ({
  position: 'relative'
}))

const Slogan = styled('section', () => ({
  fontSize: 36,
  fontWeight: 600,

  '@media screen and (max-width: 1000px)': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: 28,
    maxWidth: 600,
    margin: '0 auto'
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

const Button = styled('button', (theme) => ({
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
  color: theme.secondColor,
  boxShadow: theme.boxShadow,
  backgroundColor: theme.bgSecondColor,

  '&:hover': {
    color: '#333',
    backgroundColor: '#e6e8eb'
  }
}))

const ButtonGroup = styled('section', () => ({
  paddingTop: 62,
  '@media screen and (max-width: 1000px)': {
    textAlign: 'center',

    '& > div': {
      margin: '20px auto 0 auto'
    }
  },

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

const InstallBox = styled('div', (theme) => ({
  width: 'fit-content',
  padding: '0 20px',
  lineHeight: '40px',
  marginTop: 20,
  color: theme.secondColor,
  backdropFilter: 'saturate(180%) blur(10px)',
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  boxShadow: theme.boxShadow,
  strong: {
    paddingRight: 10
  },
  '& img': {
    cursor: 'pointer',
    display: 'block',
    height: 18,
    width: 18,
    paddingLeft: 10
  }
}))

const Author = styled('section', (theme) => ({
  position: 'absolute',
  height: '100%',

  '@media screen and (max-width: 1080px)': {
    display: 'none'
  },

  '& >div>div': {
    cursor: 'pointer',
    fontSize: '14px',
    borderRadius: '12px',
    marginBottom: 14,
    display: 'block',
    lineHeight: '40px',
    padding: '0 20px',
    textAlign: 'center',
    color: theme.secondColor,
    backgroundColor: theme.bgSecondColor,
    boxShadow: theme.boxShadow,
    transition: 'all .3s',
    fontWeight: 500,

    '&:hover': {
      color: '#333',
      backgroundColor: '#e6e8eb'
    }
  },

  '& >div': {
    top: 86,
    position: 'sticky'
  }
}))

const Title = styled('h1', () => ({
  textAlign: 'center',
  padding: 48
}))

export default function Home() {
  const installVueRef = React.useRef<HTMLPreElement>(null)
  const installReactRef = React.useRef<HTMLPreElement>(null)
  const installSolidRef = React.useRef<HTMLPreElement>(null)
  const [copySolidIcon, setCopySolidIcon] = React.useState(copySvg)
  const [copyReactIcon, setCopyReactIcon] = React.useState(copySvg)
  const [copyVueIcon, setCopyVueIcon] = React.useState(copySvg)

  const copyVue = React.useCallback(() => {
    navigator.clipboard.writeText(installVueRef.current.innerText).then(() => {
      setCopyVueIcon(okSvg)

      const timer = setTimeout(() => {
        setCopyVueIcon(copySvg)
        clearTimeout(timer)
      }, 1000)
    })
  }, [])

  const copySolid = React.useCallback(() => {
    navigator.clipboard.writeText(installSolidRef.current.innerText).then(() => {
      setCopySolidIcon(okSvg)

      const timer = setTimeout(() => {
        setCopySolidIcon(copySvg)
        clearTimeout(timer)
      }, 1000)
    })
  }, [])

  const copyReact = React.useCallback(() => {
    navigator.clipboard.writeText(installReactRef.current.innerText).then(() => {
      setCopyReactIcon(okSvg)

      const timer = setTimeout(() => {
        setCopyReactIcon(copySvg)
        clearTimeout(timer)
      }, 1000)
    })
  }, [])

  const { t } = useTranslation()
  const { setMode, mode } = useSystem()
  const [check, setCheck] = React.useState(mode !== 'light')

  function onScrollToAnchor(anchor: string) {
    document.getElementById(anchor).scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <PrimaryWapper>
        <SloganWapper>
          <Slogan>
            <Styils alt="styils" src={StyilSvg} />
            <span>{t('slogan')}</span>
          </Slogan>

          <ButtonGroup>
            <Button onClick={() => onScrollToAnchor('base')}>{t('quick')}</Button>
            <Button as="a" href="https://github.com/styils/styils" target="_blank">
              {t('github')}
            </Button>
            <InstallBox>
              <strong>$</strong>
              <pre ref={installReactRef}>npm install @styils/react</pre>
              <img src={copyReactIcon} alt="copy" onClick={() => copyReact()} aria-hidden="true" />
            </InstallBox>
            <InstallBox>
              <strong>$</strong>
              <pre ref={installSolidRef}>npm install @styils/solid</pre>
              <img src={copySolidIcon} alt="copy" onClick={() => copySolid()} aria-hidden="true" />
            </InstallBox>
            <InstallBox>
              <strong>$</strong>
              <pre ref={installVueRef}>npm install @styils/vue</pre>
              <img src={copyVueIcon} alt="copy" onClick={() => copyVue()} aria-hidden="true" />
            </InstallBox>
          </ButtonGroup>
        </SloganWapper>

        <LogoWapper>
          <Logo alt="styils-logo" src={LogoSvg} />
          <Switch
            checked={check}
            onChange={(value) => {
              const mode = value ? 'dark' : 'light'
              setCheck(value)
              setMode(mode)
              localStorage.setItem('styils-theme-mode', mode)
            }}
          />
          <SupportLabel datatype="vue">
            <img src={vueSvg} alt="vue" />
            <span>Vue</span>
          </SupportLabel>
          <SupportLabel datatype="react">
            <img src={reactSvg} alt="react" />
            <span>React</span>
          </SupportLabel>
          <SupportLabel datatype="solid">
            <img src={solidSvg} alt="solid" />
            <span>Solid</span>
          </SupportLabel>
        </LogoWapper>
      </PrimaryWapper>

      <Introduce>
        <Card icon={<img src={quickSvg} alt="quick" />} name={t('fast')}>
          {t('fastDesc')}
        </Card>
        <Card icon={<img src={tyoeSvg} alt="type" />} name={t('typescript')}>
          {t('typescriptDesc')}
        </Card>
        <Card icon={<img src={themeSvg} alt="theme" />} name={t('theme')}>
          {t('themeDesc')}
        </Card>
        <Card icon={<img src={sizeSvg} alt="size" />} name={t('small')}>
          {t('smallDesc')}
        </Card>
      </Introduce>
      <Title id="quick">{t('quick')}</Title>
      <CodeContent>
        <Author>
          <div>
            <div onClick={() => onScrollToAnchor('base')}>{t('withBase')}</div>
            <div onClick={() => onScrollToAnchor('variants')}>{t('withVariants')}</div>
            <div onClick={() => onScrollToAnchor('vars')}>{t('withVars')}</div>
            <div onClick={() => onScrollToAnchor('theme')}>{t('withTheme')}</div>
            <div onClick={() => onScrollToAnchor('ssr')}>{t('withSSR')}</div>
            <div onClick={() => onScrollToAnchor('keyframes')}>{t('withKeyframes')}</div>
            <div onClick={() => onScrollToAnchor('global')}>{t('withGlobal')}</div>
            <div onClick={() => onScrollToAnchor('media')}>{t('withMedia')}</div>
          </div>
        </Author>

        <StyilCode code={'baseCode'}>
          <h2 id="base">{t('withBase')}</h2>
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('withBaseDesc.1') }} />
          </p>
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('withBaseDesc.2') }} />
          </p>
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('withBaseDesc.3') }} />
          </p>
        </StyilCode>

        <StyilCode code={'variantsCode'} variants={{ padding: 'false' }}>
          <h2 id="variants">{t('withVariants')}</h2>
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('withVariantsDesc.1') }} />
          </p>
        </StyilCode>

        <StyilCode code={'errorCode'} disabledType>
          <p>{t('withVariantsDesc.2')}</p>
        </StyilCode>

        <StyilCode code={'varsCode'}>
          <h2 id="vars">{t('withVars')}</h2>
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('withVarsDesc.3') }} />
          </p>
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('withVarsDesc.4') }} />
          </p>
        </StyilCode>

        <StyilCode code={'themeCode'}>
          <h2 id="theme">{t('withTheme')}</h2>
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('withThemeDesc') }} />
          </p>
        </StyilCode>

        <StyilCode code={'ssrCode'} variants={{ padding: 'false' }}>
          <h2 id="ssr">{t('withSSR')}</h2>
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('withSSRDesc.1') }} />
          </p>
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('withSSRDesc.2') }} />
          </p>
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('withSSRDesc.3') }} />
          </p>
        </StyilCode>
        <StyilCode code={'ssrBaseCode'}>
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('withSSRDesc.4') }} />
          </p>
        </StyilCode>

        <StyilCode code={'keyframesCode'}>
          <h2 id="keyframes">{t('withKeyframes')}</h2>
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('withKeyframesDesc') }} />
          </p>
        </StyilCode>

        <StyilCode code={'globalCode'}>
          <h2 id="global">{t('withGlobal')}</h2>
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('withGlobalDesc') }} />
          </p>
        </StyilCode>

        <StyilCode code={'mediaCode'} variants={{ padding: 'false' }}>
          <h2 id="media">{t('withMedia')}</h2>
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('withMediaDesc') }} />
          </p>
        </StyilCode>
      </CodeContent>
    </>
  )
}
