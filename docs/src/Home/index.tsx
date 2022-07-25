import LogoSvg from '../../../logo.svg'
import StyilSvg from '../../../styil.svg'
import { styled, useSystem } from '../theme'
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
import { useTranslation } from 'react-i18next'

import React from 'react'
import { StyilCode } from './code'

const Logo = styled('img', {
  zIndex: 1,
  width: 200,
  height: 240,
  transition: 'all .3s',
  filter: 'drop-shadow(0px 8px 6px rgba(26,58,70,0.8))'
})

const Styil = styled('img', {
  display: 'block',
  height: 56,
  width: 210,
  marginRight: 8,
  marginBottom: 12,
  '@media screen and (max-width: 1000px)': {
    height: 50,
    width: 180
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
    },
    aa: 1
  }
})

const LogoWapper = styled('section', (theme) => ({
  position: 'relative',
  width: '46%',
  height: 399,
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

  '& > *': {
    userSelect: 'none'
  },

  [`& ${Logo}`]: {
    animation: '10s ease 0s infinite none running complex'
  },

  [`& ${SwitchWapper}`]: {
    animation: '13s ease 1s infinite reverse none running complex',
    position: 'absolute',
    right: '20%',
    boxShadow: theme.boxShadow,
    top: 0
  },

  [`& ${SupportLabel}[datatype="react"]`]: {
    animation: '13s ease 1.5s infinite none running complex',
    boxShadow: theme.boxShadow,
    top: 40,
    left: 40,
    '@media screen and (max-width: 580px)': {
      left: 20
    }
  },

  [`& ${SupportLabel}[datatype="html"]`]: {
    animation: '13s ease 0.5s infinite none running complex',
    boxShadow: theme.boxShadow,
    left: 20,
    bottom: 70,
    fontSize: 24,
    '@media screen and (max-width: 580px)': {
      left: 0
    },
    '& img': {
      width: 40,
      height: 40
    }
  },

  [`& ${SupportLabel}[datatype="vue"]`]: {
    boxShadow: theme.boxShadow,
    bottom: 0,
    right: 20,
    '@media screen and (max-width: 580px)': {
      right: 0
    }
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

const SloganWapper = styled('section', () => ({
  width: '50%'
}))

const PrimaryWapper = styled('section', () => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '64px 0 96px 0',

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
  fontWeight: 700,
  whiteSpace: 'pre-wrap',

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

  '& a': {
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

  '& div': {
    top: 86,
    position: 'sticky'
  }
}))

const Translate = styled('div', (theme) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  zIndex: '99',
  position: 'absolute',
  top: '10%',
  right: 0,
  height: 32,
  borderTopLeftRadius: 12,
  borderBottomLeftRadius: 12,
  padding: '8px 15px',
  fontWeight: 500,
  userSelect: 'none',
  boxShadow: theme.boxShadow,

  '&:active svg': {
    transform: 'scale(1.5)'
  },
  '& svg': {
    transition: 'all .3s',
    paddingRight: 8
  }
}))

const Title = styled('h1', () => ({
  textAlign: 'center',
  padding: 48
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

  const { t, i18n } = useTranslation()
  const { setMode, mode } = useSystem()
  const [check, setCheck] = React.useState(mode !== 'light')

  return (
    <>
      <Translate
        onClick={() => {
          const currentLanguage = i18n.language === 'Zh' ? 'En' : 'Zh'
          localStorage.setItem('styil-doc-key', currentLanguage)
          i18n.changeLanguage(currentLanguage)
        }}
      >
        <svg fill="currentColor" viewBox="0 0 24 24" height="1.5em" width="1.5em">
          <path d="M5 15v2a2 2 0 0 0 1.85 1.995L7 19h3v2H7a4 4 0 0 1-4-4v-2h2zm13-5l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16 10h2zm-1 2.885L15.753 16h2.492L17 12.885zM8 2v2h4v7H8v3H6v-3H2V4h4V2h2zm9 1a4 4 0 0 1 4 4v2h-2V7a2 2 0 0 0-2-2h-3V3h3zM6 6H4v3h2V6zm4 0H8v3h2V6z" />
        </svg>
        {i18n.language}
      </Translate>

      <PrimaryWapper>
        <SloganWapper>
          <Slogan>
            <Styil alt="styil" src={StyilSvg} />
            <span>{t('slogan')}</span>
          </Slogan>

          <ButtonGroup>
            <Button as="a" href="#quick">
              {t('quick')}
            </Button>
            <Button as="a" href="https://github.com/zoy-l/styil" target="_blank">
              {t('github')}
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
          <Logo alt="styil-logo" src={LogoSvg} />
          <Switch
            checked={check}
            onChange={(value) => {
              const mode = value ? 'dark' : 'light'
              setCheck(value)
              setMode(mode)
              localStorage.setItem('styil-theme-mode', mode)
            }}
          />
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
            <span>Vue ({t('plan')})</span>
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
            <a href="#base">{t('withBase')}</a>
            <a href="#variants">{t('withVariants')}</a>
            <a href="#theme">{t('withTheme')}</a>
            <a href="#ssr">{t('withSSR')}</a>
            <a href="#keyframes">{t('withKeyframes')}</a>
            <a href="#global">{t('withGlobal')}</a>
            <a href="#media">{t('withMedia')}</a>
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
          <p>{t('withVariantsDesc.2')}</p>
        </StyilCode>

        <StyilCode code={'errorCode'} disabledType>
          <p>{t('withVariantsDesc.3')}</p>
        </StyilCode>

        <StyilCode code={'themeCode'}>
          <h2 id="theme">{t('withTheme')}</h2>
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('withThemeDesc') }} />
          </p>
        </StyilCode>

        <StyilCode code={'ssrCode'}>
          <h2 id="ssr">{t('withSSR')}</h2>
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('withSSRDesc.1') }} />
          </p>
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('withSSRDesc.2') }} />
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
