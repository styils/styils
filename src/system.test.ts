import { createSystem, styled, flush, global } from './system'
import { render, fireEvent, getByText } from '@testing-library/react'
import React from 'react'

const meta = globalThis.document.createElement('meta')
const { document } = globalThis

jest.spyOn(globalThis.document, 'querySelector').mockImplementationOnce(() => {
  return meta
})

Object.defineProperty(globalThis, 'document', { value: undefined, writable: true })

describe('system', () => {
  beforeEach(() => {
    flush()
    globalThis.document = document
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

    const { container } = render(React.createElement(Button))

    expect(container).toMatchSnapshot()

    expect(document.documentElement).toMatchSnapshot()
  })

  it('styled with styled components', () => {
    const Button = styled('button', {
      backgroundColor: '#fff'
    })

    const Button2 = styled(Button, {
      color: 'red'
    })

    const { container } = render(React.createElement(Button2))
    expect(container).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
  })

  it('global', () => {
    global({
      body: {
        backgroundColor: '#fff'
      }
    })

    expect(document.documentElement).toMatchSnapshot()
  })

  it('with theme global', () => {
    const {
      global: globalTheme,
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

    const { container } = render(
      React.createElement(SystemProvider, {
        children: React.createElement(() => {
          const { mode, setMode } = useSystem()

          return React.createElement(
            'div',
            { onClick: () => setMode(mode === 'light' ? 'dark' : 'light') },
            mode
          )
        })
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
      global: globalTheme,
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

    const { container } = render(
      React.createElement(SystemProvider, {
        children: React.createElement(() => {
          const { mode, setMode } = useSystem()

          return React.createElement(
            'div',
            { onClick: () => setMode(mode === 'light' ? 'dark' : 'light') },
            mode
          )
        })
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

    render(React.createElement(Button))

    document.head.childNodes.forEach((item: HTMLStyleElement) => {
      expect(item.sheet.cssRules.length).toEqual(1)
    })

    flush()
  })

  it('styled className', () => {
    const Button = styled('button', {
      backgroundColor: 'gainsboro'
    })

    const { container } = render(React.createElement(Button, { className: 'foo' }))

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

    const { container } = render(React.createElement(Button))

    expect(`${Button}`).toEqual('.css-3465392085')
    expect(container).toMatchSnapshot()

    process.env.NODE_ENV = 'test'
  })

  it('styled namespace', async () => {
    const { styled: _styled } = await import('./system')

    const Button = _styled(
      { tag: 'button', namespace: 'button' },
      {
        borderRadius: '9999px'
      }
    )

    const { container } = render(React.createElement(Button))

    expect(`${Button}`).toEqual('.button-css-3465392085')
    expect(container).toMatchSnapshot()

    process.env.NODE_ENV = 'test'
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

      expect(['light', 'dark'].includes(mode)).toEqual(true)
      expect(theme.color).toEqual(typemap[mode])

      return React.createElement(
        'div',
        { 'data-testid': 'use-system', onClick: () => setMode('dark') },
        React.createElement(Button),
        mode
      )
    }

    const { container } = render(
      React.createElement(SystemProvider, { children: React.createElement(Wapper) })
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
      const [state, setState] = React.useState<'small' | 'max'>('small')

      return React.createElement(
        'div',
        { 'data-testid': 'styled-variants' },
        React.createElement(
          Button,
          { variants: { size: state }, onClick: () => setState('max') },
          state
        )
      )
    }

    const { container } = render(React.createElement(Wapper))

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
      const [state, setState] = React.useState<'small' | undefined>('small')

      return React.createElement(
        'div',
        { 'data-testid': 'styled-variants' },
        React.createElement(
          Button,
          { variants: { size: state }, onClick: () => setState(undefined) },
          state
        )
      )
    }

    const { container } = render(React.createElement(Wapper))

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

      expect(['light', 'dark'].includes(mode)).toEqual(true)
      expect(theme.color).toEqual(typemap[mode])

      return React.createElement(
        'div',
        { 'data-testid': 'use-system', onClick: () => setMode('dark') },
        React.createElement(Button, { variants: { color: mode as 'light' } }),
        mode
      )
    }

    const { container } = render(
      React.createElement(SystemProvider, { children: React.createElement(Wapper) })
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

      expect(['light', 'dark'].includes(mode)).toEqual(true)
      expect(theme.color).toEqual(typemap[mode])

      return React.createElement(
        'div',
        { 'data-testid': 'use-system', onClick: () => setMode(mode === 'dark' ? 'light' : 'dark') },
        React.createElement(Button),
        mode
      )
    }

    const { container } = render(
      React.createElement(SystemProvider, { children: React.createElement(Wapper) })
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
    meta.name = 'styils-cache'
    meta.content = `css-2242710476`
    document.head.appendChild(meta)

    const { styled: hydrateStyled, getCssValue } = createSystem()
    hydrateStyled('button', {
      backgroundColor: 'gainsboro',
      borderRadius: '9999px'
    })

    expect(getCssValue().html).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    document.head.removeChild(meta)
  })

  it('variants hydrate', () => {
    meta.name = 'styils-cache'
    meta.content = `css-2242710476|css-2242710476.size-max|css-2242710476.size-small`
    document.head.appendChild(meta)

    const { styled: hydrateStyled, getCssValue } = createSystem()
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

    expect(getCssValue().html).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    document.head.removeChild(meta)
  })

  it('namespace hydrate', () => {
    meta.name = 'styils-cache'
    meta.content = `ssr-css-2242710476|ssr-css-2242710476.ssr-size-max|ssr-css-2242710476.ssr-size-small`
    document.head.appendChild(meta)

    const { styled: hydrateStyled, getCssValue } = createSystem()
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

    expect(getCssValue().html).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    document.head.removeChild(meta)
  })

  it('global hydrate', () => {
    meta.name = 'styils-cache'
    meta.content = ''
    meta.setAttribute('mode', 'none')
    document.head.appendChild(meta)

    const { global: hydrateGlobal, getCssValue } = createSystem()
    hydrateGlobal({
      body: {
        backgroundColor: 'gainsboro',
        borderRadius: '9999px'
      }
    })

    expect(getCssValue().html).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()

    globalThis.document = document
    const { global: hydrateGlobal1, getCssValue: getCssValue1 } = createSystem()
    hydrateGlobal1({
      body: {
        backgroundColor: 'red',
        borderRadius: '99px'
      }
    })

    expect(getCssValue1().html).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    document.head.removeChild(meta)
  })

  it('render Element hydrate', async () => {
    const { styled: hydrateStyled, getCssValue } = createSystem()

    hydrateStyled('div', {
      backgroundColor: 'gainsboro',
      borderRadius: '9999px'
    })
    const { StyilRules } = getCssValue()

    globalThis.document = document
    const { container } = render(StyilRules)

    expect(container).toMatchSnapshot()
  })

  it('mix hydrate', async () => {
    globalThis.document = document

    styled('div', {
      backgroundColor: 'gainsboro',
      borderRadius: '9999px'
    })
    Object.defineProperty(globalThis, 'document', { value: undefined })
    const { styled: hydrateStyled, getCssValue } = createSystem()

    hydrateStyled('div', {
      backgroundColor: 'gainsboro',
      borderRadius: '9999px'
    })

    expect(getCssValue().html).toMatchSnapshot()
  })
})
