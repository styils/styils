import {
  createSystem,
  styled,
  flush,
  createGlobal,
  keyframes,
  createExtracts,
  systemContext
} from './solidSystem'
import { render, fireEvent, getByText } from 'solid-testing-library'
import { Dynamic } from 'solid-js/web'
import { createSignal } from 'solid-js'

const meta = globalThis.document.createElement('meta')
const { document } = globalThis

jest.spyOn(globalThis.document, 'getElementById').mockImplementationOnce(() => {
  return meta
})

Object.defineProperty(globalThis, 'document', { value: undefined, writable: true })

describe('solidjs system', () => {
  beforeEach(() => {
    flush()
    globalThis.document = document
    document.documentElement.removeAttribute('style')
  })
  it('systemContext', () => {
    expect(!!systemContext).toEqual(true)
  })
  it('styled', () => {
    const Button = styled('button', {
      backgroundColor: 'gainsboro',
      borderRadius: '9999px',
      fontWeight: 500,
      padding: '0.75em 1em',
      border: 0,
      transition: 'all 200ms ease',

      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, .3)'
      }
    })

    const { container } = render(Dynamic({ component: Button }))
    const { extractElement } = createExtracts()
    expect(container).toMatchSnapshot()

    const { container: containerExtractElement } = render(() => extractElement)

    expect(containerExtractElement).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
  })

  it('styled with css state', () => {
    const Button = styled('button', {
      backgroundColor: '$bg'
    })

    const { container } = render(() => {
      const [color, setColor] = createSignal('red')
      return Dynamic({
        component: Button,
        onClick: () => {
          setColor('blue')
        },
        vars: {
          get bg() {
            return color()
          }
        },
        children: color
      })
    })

    expect(container).toMatchSnapshot()
    fireEvent.click(getByText(container, 'red'))
    expect(container).toMatchSnapshot()
  })

  it('styled with sourceMap', () => {
    // @ts-expect-error
    styled.sourceMap = '1'
    styled('button', {
      backgroundColor: 'gainsboro'
    })

    // @ts-expect-error
    expect(styled.sourceMap).toEqual(undefined)
    expect(document.documentElement).toMatchSnapshot()
  })

  it('styled with theme and sourceMap', () => {
    const {
      styled: themeStyled,
      useSystem: useThemeSystem,
      SystemProvider: ThemeSystemProvider,
      flush: themeFlush
    } = createSystem({
      theme: (mode) => ({ light: { color: 'red' }, dark: { color: 'blue' } }[mode]),
      defaultMode: 'light'
    })

    // @ts-expect-error
    themeStyled.sourceMap = '1'
    const Button = themeStyled('button', (theme) => ({
      backgroundColor: theme.color
    }))

    function Test() {
      const { mode, setMode } = useThemeSystem()

      return Dynamic({
        component: Button,
        onClick: () => {
          setMode(mode() === 'light' ? 'dark' : 'light')
        },
        children: mode
      })
    }

    const { container } = render(
      Dynamic({
        component: ThemeSystemProvider,
        children: Test
      })
    )

    // @ts-expect-error
    expect(styled.sourceMap).toEqual(undefined)
    expect(document.documentElement).toMatchSnapshot()

    fireEvent.click(getByText(container, 'light'))

    // @ts-expect-error
    expect(styled.sourceMap).toEqual(undefined)
    expect(document.documentElement).toMatchSnapshot()

    themeFlush()
  })

  it('styled with styled components', () => {
    const Button = styled('button', {
      backgroundColor: '#fff'
    })

    const Button2 = styled(Button, {
      color: 'red'
    })

    const { container } = render(Dynamic({ component: Button2 }))
    expect(container).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
  })

  it('keyframes css', () => {
    const out = keyframes({
      from: {
        transform: 'rotate(0deg)'
      },
      to: {
        transform: 'rotate(360deg)'
      }
    })

    document.head.childNodes.forEach((item) => {
      expect(item.textContent).toEqual(
        '@keyframes css-854127283{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}'
      )
    })

    expect(out).toEqual('css-854127283')
  })

  it('createGlobal', () => {
    createGlobal({
      body: {
        backgroundColor: '#fff'
      }
    })

    expect(document.documentElement).toMatchSnapshot()
  })

  it('createGlobal with sourceMap', () => {
    // @ts-expect-error
    createGlobal.sourceMap = 'sourceMap'
    createGlobal({
      body: {
        backgroundColor: '#fff'
      }
    })

    // @ts-expect-error
    expect(createGlobal.sourceMap).toEqual(undefined)
    expect(document.documentElement).toMatchSnapshot()
  })

  it('with theme createGlobal and sourcemap', () => {
    const {
      createGlobal: globalTheme,
      useSystem,
      SystemProvider,
      flush
    } = createSystem({
      theme: (mode) => {
        return {
          dark: {
            color: 'red'
          },
          light: {
            color: 'blue'
          }
        }[mode]
      },
      defaultMode: 'light'
    })

    // @ts-expect-error
    globalTheme.sourceMap = '1'
    globalTheme((theme) => ({
      body: {
        backgroundColor: theme.color
      }
    }))

    function Test() {
      const { mode, setMode } = useSystem()

      return Dynamic({
        component: 'div',
        onClick: () => {
          setMode(mode() === 'light' ? 'dark' : 'light')
        },
        children: mode
      })
    }

    const { container } = render(
      Dynamic({
        component: SystemProvider,
        children: Test
      })
    )

    fireEvent.click(getByText(container, 'light'))
    expect(document.documentElement).toMatchSnapshot()

    flush()
  })

  it('with theme createGlobal', () => {
    const {
      createGlobal: globalTheme,
      useSystem,
      SystemProvider,
      flush
    } = createSystem({
      theme: (mode) => {
        return {
          dark: {
            color: 'red'
          },
          light: {
            color: 'blue'
          }
        }[mode]
      },
      defaultMode: 'light'
    })

    globalTheme((theme) => ({
      body: {
        backgroundColor: theme.color
      }
    }))

    function Test() {
      const { mode, setMode } = useSystem()

      return Dynamic({
        component: 'div',
        onClick: () => {
          setMode(mode() === 'light' ? 'dark' : 'light')
        },
        children: mode
      })
    }

    const { container } = render(
      Dynamic({
        component: SystemProvider,
        children: Test
      })
    )

    expect(container).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    fireEvent.click(getByText(container, 'light'))
    expect(container).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    fireEvent.click(getByText(container, 'dark'))
    expect(container).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()

    flush()
  })

  it('delete old rules', () => {
    const {
      createGlobal: globalTheme,
      useSystem,
      SystemProvider,
      flush
    } = createSystem({
      theme: (mode) => {
        return {
          dark: {
            color: 'red'
          },
          light: {
            color: 'blue'
          }
        }[mode]
      },
      defaultMode: 'light',
      sheetOptions: { speedy: true }
    })

    globalTheme((theme) => ({
      body: {
        backgroundColor: theme.color
      }
    }))

    function Test() {
      const { mode, setMode } = useSystem()

      return Dynamic({
        component: 'div',
        onClick: () => {
          setMode(mode() === 'light' ? 'dark' : 'light')
        },
        children: mode
      })
    }

    const { container } = render(
      Dynamic({
        component: SystemProvider,
        children: Test
      })
    )

    let styleHtml: HTMLStyleElement

    document.head.childNodes.forEach((item: HTMLStyleElement) => {
      styleHtml = item
    })

    expect(styleHtml.sheet.cssRules.length).toEqual(1)
    expect(styleHtml.sheet.cssRules[0].cssText).toEqual('body {background-color: blue;}')

    fireEvent.click(getByText(container, 'light'))
    expect(styleHtml.sheet.cssRules.length).toEqual(1)
    expect(styleHtml.sheet.cssRules[0].cssText).toEqual('body {background-color: red;}')
    fireEvent.click(getByText(container, 'dark'))
    expect(styleHtml.sheet.cssRules.length).toEqual(1)
    expect(styleHtml.sheet.cssRules[0].cssText).toEqual('body {background-color: blue;}')

    flush()
  })

  it('styled speedy', () => {
    const { flush, styled: thmeStyle } = createSystem({ sheetOptions: { speedy: true } })

    const Button = thmeStyle('button', {
      backgroundColor: 'gainsboro'
    })

    render(Dynamic({ component: Button }))

    document.head.childNodes.forEach((item: HTMLStyleElement) => {
      expect(item.sheet.cssRules.length).toEqual(1)
    })

    flush()
  })

  it('styled className', () => {
    const Button = styled('button', {
      backgroundColor: 'gainsboro'
    })

    const { container } = render(Dynamic({ component: Button, class: 'foo' }))

    expect(container).toMatchSnapshot()

    expect(document.documentElement).toMatchSnapshot()
  })

  it('styled toString', () => {
    const Button = styled('button', {
      backgroundColor: 'gainsboro',
      borderRadius: '9999px',
      fontWeight: 500,
      padding: '0.75em 1em',
      border: 0,
      transition: 'all 200ms ease',

      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, .3)'
      }
    })

    expect(`${Button}`).toEqual('.css-3397010960')
  })

  it('styled production', () => {
    process.env.NODE_ENV = 'production'
    const Button = styled(
      'button',
      {
        borderRadius: '9999px'
      },
      {
        size: {
          small: {
            fontSize: 14
          }
        }
      }
    )

    const { container } = render(Dynamic({ component: Button }))

    expect(`${Button}`).toEqual('.css-3465392085')
    expect(container).toMatchSnapshot()

    process.env.NODE_ENV = 'test'
  })

  it('styled namespace', async () => {
    const { styled: _styled, flush } = await import('./solidSystem')

    const Button = _styled(
      { tag: 'button', namespace: 'button' },
      {
        borderRadius: '9999px'
      }
    )

    const { container } = render(Dynamic({ component: Button }))

    expect(`${Button}`).toEqual('.button-css-3465392085')
    expect(container).toMatchSnapshot()

    process.env.NODE_ENV = 'test'

    flush()
  })

  it('createSystem', async () => {
    const {
      styled: themeStyled,
      SystemProvider,
      useSystem,
      flush
    } = createSystem({
      theme: (mode) => {
        return {
          color: mode === 'light' ? 'red' : 'blue'
        }
      },
      defaultMode: 'light'
    })

    const Button = themeStyled('button', (theme) => ({
      color: theme.color
    }))

    const typemap = {
      dark: 'blue',
      light: 'red'
    }

    function Wapper() {
      const { mode, setMode, theme } = useSystem()

      expect(['light', 'dark'].includes(mode())).toEqual(true)

      expect(theme().color).toEqual(typemap[mode()])

      return Dynamic({
        component: 'div',
        'data-testid': 'use-system',
        onClick: () => {
          setMode('dark')
        },
        children: [
          Dynamic({
            component: Button
          }),
          mode
        ]
      })
    }

    const { container } = render(
      Dynamic({
        component: SystemProvider,
        children: Wapper
      })
    )

    expect(container).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    fireEvent.click(getByText(container, 'light'))
    expect(container).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()

    flush()
  })

  it('variants', async () => {
    const Button = styled(
      'button',
      {
        color: 'red'
      },
      {
        size: {
          small: {
            fontSize: 14
          },
          max: {
            fontSize: 99
          }
        }
      }
    )

    function Wapper() {
      const [state, setState] = createSignal<'small' | 'max'>('small')

      return Dynamic({
        component: 'div',
        'data-testid': 'use-system',
        onClick: () => setState('max'),
        children: [
          Dynamic({
            component: Button
          }),
          state()
        ]
      })
    }

    const { container } = render(() => Wapper)

    expect(container).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()

    fireEvent.click(getByText(container, 'small'))

    expect(container).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
  })

  it('variants single', async () => {
    const Button = styled(
      'button',
      {
        color: 'red'
      },
      {
        size: {
          small: {
            fontSize: 14
          }
        }
      }
    )

    function Wapper() {
      const [state, setState] = createSignal<'small' | undefined>('small')

      return Dynamic({
        component: 'div',
        'data-testid': 'use-system',
        onClick: () => setState(undefined),
        children: [
          Dynamic({
            component: Button
          }),
          state()
        ]
      })
    }

    const { container } = render(() => Wapper)

    expect(container).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()

    fireEvent.click(getByText(container, 'small'))

    expect(container).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
  })

  it('variants theme', async () => {
    const {
      styled: themeStyled,
      SystemProvider,
      useSystem,
      flush
    } = createSystem({
      theme: (mode) => {
        return {
          color: mode === 'light' ? 'red' : 'blue'
        }
      },
      defaultMode: 'light'
    })

    const Button = themeStyled(
      'button',
      {
        color: 'red'
      },
      (theme) => ({
        color: {
          dark: {
            color: theme.color
          },
          light: {
            color: theme.color
          }
        }
      })
    )

    const typemap = {
      dark: 'blue',
      light: 'red'
    }

    function Wapper() {
      const { mode, setMode, theme } = useSystem()

      expect(['light', 'dark'].includes(mode())).toEqual(true)
      expect(theme().color).toEqual(typemap[mode()])

      return Dynamic({
        component: 'div',
        'data-testid': 'use-system',
        onClick: () => setMode('dark'),
        children: [
          Dynamic({
            component: Button,
            variants: {
              color: mode() as 'light'
            }
          }),
          mode
        ]
      })
    }

    const { container } = render(
      Dynamic({
        component: SystemProvider,
        children: Wapper
      })
    )

    expect(container).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    fireEvent.click(getByText(container, 'light'))
    expect(container).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()

    flush()
  })

  it('theme does not render repeatedly', async () => {
    const {
      styled: themeStyled,
      SystemProvider,
      useSystem,
      flush
    } = createSystem({
      theme: (mode) => {
        return {
          color: mode === 'light' ? 'red' : 'blue'
        }
      },
      defaultMode: 'light'
    })

    const Button = themeStyled('button', (theme) => ({
      color: theme.color
    }))

    const typemap = {
      dark: 'blue',
      light: 'red'
    }

    function Wapper() {
      const { mode, setMode, theme } = useSystem()

      expect(['light', 'dark'].includes(mode())).toEqual(true)
      expect(theme().color).toEqual(typemap[mode()])

      return Dynamic({
        component: 'div',
        'data-testid': 'use-system',
        onClick: () => setMode(mode() === 'dark' ? 'light' : 'dark'),
        children: [Button, mode]
      })
    }

    const { container } = render(
      Dynamic({
        component: SystemProvider,
        children: Wapper
      })
    )

    expect(container).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    fireEvent.click(getByText(container, 'light'))
    expect(container).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()

    fireEvent.click(getByText(container, 'dark'))
    expect(container).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()

    flush()
  })
})

describe('hydrate', () => {
  beforeEach(() => {
    globalThis.document = undefined
  })
  it('base hydrate', async () => {
    meta.id = 'styils-css-cache'
    meta.name = 'styils-cache'
    meta.content = `css-2242710476`
    document.head.appendChild(meta)

    const { styled: hydrateStyled, createExtracts } = createSystem()
    hydrateStyled('button', {
      backgroundColor: 'gainsboro',
      borderRadius: '9999px'
    })

    globalThis.document = document
    expect(createExtracts().extractHtml).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    document.head.removeChild(meta)
  })

  it('variants hydrate', () => {
    meta.id = 'styils-css-cache'
    meta.name = 'styils-cache'
    meta.content = `css-2242710476|css-2242710476.size-max|css-2242710476.size-small`
    document.head.appendChild(meta)

    const { styled: hydrateStyled, createExtracts } = createSystem()
    hydrateStyled(
      'button',
      {
        backgroundColor: 'gainsboro',
        borderRadius: '9999px'
      },
      {
        size: {
          small: {
            fontSize: 14
          },
          max: {
            fontSize: 12
          }
        }
      }
    )

    globalThis.document = document
    expect(createExtracts().extractHtml).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    document.head.removeChild(meta)
  })

  it('namespace hydrate', () => {
    meta.id = 'styils-css-cache'
    meta.name = 'styils-cache'
    meta.content = `ssr-css-2242710476|ssr-css-2242710476.ssr-size-max|ssr-css-2242710476.ssr-size-small`
    document.head.appendChild(meta)

    const { styled: hydrateStyled, createExtracts } = createSystem()
    hydrateStyled(
      { tag: 'button', namespace: 'ssr' },
      {
        backgroundColor: 'gainsboro',
        borderRadius: '9999px'
      },
      {
        size: {
          small: {
            fontSize: 14
          },
          max: {
            fontSize: 12
          }
        }
      }
    )

    globalThis.document = document
    expect(createExtracts().extractHtml).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    document.head.removeChild(meta)
  })

  it('createGlobal hydrate', () => {
    meta.id = 'styils-css-cache'
    meta.name = 'styils-cache'
    meta.content = ''
    meta.setAttribute('mode', 'none')
    document.head.appendChild(meta)

    const { createGlobal: hydrateGlobal, createExtracts } = createSystem()
    hydrateGlobal({
      body: {
        backgroundColor: 'gainsboro',
        borderRadius: '9999px'
      }
    })

    globalThis.document = document
    expect(createExtracts().extractHtml).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()

    const { createGlobal: hydrateGlobal1, createExtracts: getCssValue1 } = createSystem()
    hydrateGlobal1({
      body: {
        backgroundColor: 'red',
        borderRadius: '99px'
      }
    })

    expect(getCssValue1().extractHtml).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    document.head.removeChild(meta)
  })

  it('createGlobal hydrate with sourcemap', () => {
    meta.id = 'styils-css-cache'
    meta.name = 'styils-cache'
    meta.content = 'css-2242710476'
    meta.setAttribute('mode', 'none')
    document.head.appendChild(meta)

    const { styled: sstyled } = createSystem()
    // @ts-expect-error
    sstyled.sourceMap = '1'
    sstyled('button', {
      backgroundColor: 'gainsboro',
      borderRadius: '9999px'
    })

    expect(document.documentElement).toMatchSnapshot()
    document.head.removeChild(meta)
  })

  it('render Element hydrate', async () => {
    const { styled: hydrateStyled, createExtracts } = createSystem()

    hydrateStyled('div', {
      backgroundColor: 'gainsboro',
      borderRadius: '9999px'
    })
    globalThis.document = document
    const { extractElement } = createExtracts()
    const { container } = render(() => extractElement)

    expect(container).toMatchSnapshot()
  })

  it('mix hydrate', async () => {
    globalThis.document = document

    styled('div', {
      backgroundColor: 'gainsboro',
      borderRadius: '9999px'
    })
    Object.defineProperty(globalThis, 'document', { value: undefined })
    const { styled: hydrateStyled, createExtracts } = createSystem()

    hydrateStyled('div', {
      backgroundColor: 'gainsboro',
      borderRadius: '9999px'
    })

    globalThis.document = document
    expect(createExtracts().extractHtml).toMatchSnapshot()
  })

  it('production css content', () => {
    const { styled: hydrateStyled, createExtracts } = createSystem()

    hydrateStyled('div', {
      backgroundColor: 'gainsboro',
      borderRadius: '9999px'
    })

    hydrateStyled('div', {
      backgroundColor: 'gainsboro',
      borderRadius: '999px'
    })
    globalThis.document = document
    process.env.NODE_ENV = 'production'
    const { extractElement } = createExtracts()
    const { container } = render(() => extractElement)

    expect(container).toMatchSnapshot()
    process.env.NODE_ENV = 'test'
  })
})
