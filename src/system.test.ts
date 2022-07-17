import { createSystem, styled, flush } from './system'
import { render, fireEvent, getByText } from '@testing-library/react'
import React from 'react'

describe('system', () => {
  beforeEach(() => {
    flush()
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

  it('hydrate', () => {
    const meta = document.createElement('meta')
    meta.name = 'styil-cache'
    meta.id = '__styls_cache__'
    meta.content = `css-2242710476`
    globalThis.document.head.appendChild(meta)

    jest.spyOn(document, 'getElementById').mockImplementationOnce(() => {
      return meta
    })

    const { styled: hydrateStyled, getCssValue } = createSystem()
    const Button = hydrateStyled('button', {
      backgroundColor: 'gainsboro',
      borderRadius: '9999px'
    })

    render(React.createElement(Button))

    expect(getCssValue()).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    globalThis.document.head.removeChild(meta)
  })

  it('hydrate variants', () => {
    const meta = document.createElement('meta')
    meta.name = 'styil-cache'
    meta.id = '__styls_cache__'
    meta.content = `css-2242710476|css-2242710476.size-max|css-2242710476.size-small`
    globalThis.document.head.appendChild(meta)

    jest.spyOn(document, 'getElementById').mockImplementationOnce(() => {
      return meta
    })

    const { styled: hydrateStyled, getCssValue } = createSystem()
    const Button = hydrateStyled(
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

    render(React.createElement(Button))

    expect(getCssValue()).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    globalThis.document.head.removeChild(meta)
  })

  it('hydrate namespace', () => {
    const meta = document.createElement('meta')
    meta.name = 'styil-cache'
    meta.id = '__styls_cache__'
    meta.content = `ssr-css-2242710476|ssr-css-2242710476.ssr-size-max|ssr-css-2242710476.ssr-size-small`
    globalThis.document.head.appendChild(meta)

    jest.spyOn(document, 'getElementById').mockImplementationOnce(() => {
      return meta
    })

    const { styled: hydrateStyled, getCssValue } = createSystem()
    const Button = hydrateStyled(
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

    render(React.createElement(Button, { variants: { size: 'small' } }))

    expect(getCssValue()).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    globalThis.document.head.removeChild(meta)
  })
})
