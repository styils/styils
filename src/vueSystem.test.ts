/**
 * @jest-environment jsdom
 * @jest-environment-options {"customExportConditions": ["node","node-addons"]}
 */

import {
  createSystem,
  styled,
  flush,
  createGlobal,
  keyframes,
  createExtracts,
  systemContext
} from './vueSystem'
import { mount } from '@vue/test-utils'
import { h, ref } from 'vue'

const meta = globalThis.document.createElement('meta')
const { document } = globalThis

jest.spyOn(globalThis.document, 'getElementById').mockImplementationOnce(() => {
  return meta
})

Object.defineProperty(globalThis, 'document', { value: undefined, writable: true })

describe('vuejs system', () => {
  beforeEach(() => {
    flush()
    globalThis.document = document
    document.head.childNodes.forEach((tag) => {
      document.head.removeChild(tag)
    })
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

    const container = mount(Button)

    const { extractElement } = createExtracts()

    expect(container.html()).toMatchSnapshot()
    const ssr = mount(() => extractElement)
    expect(ssr.html).toMatchSnapshot()

    expect(document.documentElement).toMatchSnapshot()
  })

  it('styled with css state', () => {
    const Button = styled('button', {
      backgroundColor: '$bg'
    })

    const container = mount(
      h({
        setup() {
          const color = ref('red')
          return () =>
            h(
              Button,
              {
                onClick: () => {
                  color.value = 'blue'
                },
                vars: {
                  bg: color.value
                }
              },
              () => color.value
            )
        }
      })
    )

    expect(container.html()).toMatchSnapshot()
    container.find('button').trigger('click')
    expect(container.html()).toMatchSnapshot()
  })

  it('styled multiple Variants', () => {
    const Button = styled(
      'button',
      {
        backgroundColor: 'gainsboro'
      },
      {
        outer: {
          true: {
            padding: '4px'
          }
        },
        fixed: {
          true: {
            width: '6px',
            height: '6px'
          }
        }
      }
    )

    const container = mount(h(Button, { variants: { fixed: true, outer: true } }))

    expect(container.html()).toMatchSnapshot()
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

    const container = mount(
      h(ThemeSystemProvider, {}, () =>
        h({
          setup() {
            const { mode, setMode } = useThemeSystem()

            return () =>
              h(
                Button,
                {
                  onClick: () => {
                    setMode(mode.value === 'light' ? 'dark' : 'light')
                  }
                },
                () => mode.value
              )
          }
        })
      )
    )

    // @ts-expect-error
    expect(styled.sourceMap).toEqual(undefined)
    expect(document.documentElement).toMatchSnapshot()
    container.find('button').trigger('click')

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

    const container = mount(Button2)
    expect(container.html()).toMatchSnapshot()
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
      flush: ThemeFlush
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

    const container = mount(
      h(SystemProvider, {}, () =>
        h({
          setup() {
            const { mode, setMode } = useSystem()

            return () =>
              h(
                'div',
                {
                  onClick: () => {
                    setMode(mode.value === 'light' ? 'dark' : 'light')
                  }
                },
                () => mode.value
              )
          }
        })
      )
    )

    container.find('div').trigger('click')
    expect(document.documentElement).toMatchSnapshot()

    ThemeFlush()
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
    const container = mount(
      h(SystemProvider, {}, () =>
        h({
          setup() {
            const { mode, setMode } = useSystem()
            return () =>
              h(
                'div',
                {
                  onClick: () => {
                    setMode(mode.value === 'light' ? 'dark' : 'light')
                  }
                },
                () => mode.value
              )
          }
        })
      )
    )
    expect(container.html()).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    container.find('div').trigger('click')
    expect(container.html()).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    container.find('div').trigger('click')
    expect(container.html()).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    flush()
  })

  it('delete old rules', () => {
    process.env.NODE_ENV = 'production'
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

    const container = mount(
      h(SystemProvider, {}, () =>
        h({
          setup() {
            const { mode, setMode } = useSystem()

            return () =>
              h(
                'div',
                {
                  onClick: () => {
                    setMode(mode.value === 'light' ? 'dark' : 'light')
                  }
                },
                () => mode.value
              )
          }
        })
      )
    )

    let styleHtml: HTMLStyleElement

    document.head.childNodes.forEach((item: HTMLStyleElement) => {
      styleHtml = item
    })

    expect(styleHtml.sheet.cssRules.length).toEqual(1)
    expect(styleHtml.sheet.cssRules[0].cssText).toEqual('body {background-color: blue;}')

    container.find('div').trigger('click')
    expect(styleHtml.sheet.cssRules.length).toEqual(1)
    expect(styleHtml.sheet.cssRules[0].cssText).toEqual('body {background-color: red;}')

    container.find('div').trigger('click')
    expect(styleHtml.sheet.cssRules.length).toEqual(1)
    expect(styleHtml.sheet.cssRules[0].cssText).toEqual('body {background-color: blue;}')

    flush()

    process.env.NODE_ENV = 'test'
  })

  it('styled speedy', () => {
    process.env.NODE_ENV = 'production'
    const { flush, styled: thmeStyle } = createSystem()

    const Button = thmeStyle('button', {
      backgroundColor: 'gainsboro'
    })

    mount(h(Button))

    document.head.childNodes.forEach((item: HTMLStyleElement) => {
      expect(item.sheet.cssRules.length).toEqual(1)
    })

    flush()
    process.env.NODE_ENV = 'test'
  })

  it('styled className', () => {
    const Button = styled('button', {
      backgroundColor: 'gainsboro'
    })

    const container = mount(h(Button, { class: 'foo' }))

    expect(container.html()).toMatchSnapshot()

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

    const container = mount(h(Button))

    expect(`${Button}`).toEqual('.css-3465392085')
    expect(container.html()).toMatchSnapshot()

    process.env.NODE_ENV = 'test'
  })

  it('styled namespace', async () => {
    const { styled: _styled, flush } = await import('./vueSystem')

    const Button = _styled(
      { tag: 'button', namespace: 'button' },
      {
        borderRadius: '9999px'
      }
    )

    const container = mount(h(Button))

    expect(`${Button}`).toEqual('.button-css-3465392085')
    expect(container.html()).toMatchSnapshot()

    process.env.NODE_ENV = 'test'

    flush()
  })

  it('createSystem base', async () => {
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

    const container = mount(
      h(SystemProvider, {}, () =>
        h({
          setup() {
            const { mode, theme } = useSystem()

            expect(['light', 'dark'].includes(mode.value)).toEqual(true)
            expect(theme.color).toEqual(typemap[mode.value])

            return () =>
              h(
                'div',
                {
                  'data-testid': 'use-system',
                  onClick: () => {
                    mode.value = 'dark'
                  }
                },
                () => [h(Button), mode.value]
              )
          }
        })
      )
    )

    expect(container.html()).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    container.find('div').trigger('click')
    expect(container.html()).toMatchSnapshot()
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
      const state = ref<'small' | 'max'>('small')

      return h('div', { 'data-testid': 'styled-variants' }, () =>
        h(
          Button,
          {
            variants: { size: state.value },
            onClick: () => {
              state.value = 'max'
            }
          },
          () => state.value
        )
      )
    }

    const container = mount(Wapper)

    expect(container.html()).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()

    container.find('div').trigger('click')

    expect(container.html()).toMatchSnapshot()
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
      const state = ref<'small' | undefined>('small')

      return h('div', { 'data-testid': 'styled-variants' }, () =>
        h(
          Button,
          {
            variants: { size: state.value },
            onClick: () => {
              state.value = undefined
            }
          },
          () => state.value
        )
      )
    }

    const container = mount(Wapper)

    expect(container.html()).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()

    container.find('div').trigger('click')

    expect(container.html()).toMatchSnapshot()
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

    const container = mount(
      h(SystemProvider, {}, () =>
        h({
          setup() {
            const { mode, theme, setMode } = useSystem()

            expect(['light', 'dark'].includes(mode.value)).toEqual(true)
            expect(theme.color).toEqual(typemap[mode.value])

            return () =>
              h(
                Button,
                {
                  variants: { color: mode.value as 'light' },
                  'data-testid': 'use-system',
                  onClick: () => {
                    setMode('dark')
                  }
                },
                () => mode.value
              )
          }
        })
      )
    )

    expect(container.html()).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    container.find('button').trigger('click')
    expect(container.html()).toMatchSnapshot()
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

    const container = mount(
      h(SystemProvider, {}, () =>
        h({
          setup() {
            const { mode, theme, setMode } = useSystem()

            expect(['light', 'dark'].includes(mode.value)).toEqual(true)
            expect(theme.color).toEqual(typemap[mode.value])

            return () =>
              h(
                'div',
                {
                  'data-testid': 'use-system',
                  onClick: () => {
                    setMode(mode.value === 'dark' ? 'light' : 'dark')
                  }
                },
                () => [h(Button), mode]
              )
          }
        })
      )
    )

    expect(container.html()).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()
    container.find('div').trigger('click')
    expect(container.html()).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()

    container.find('div').trigger('click')
    expect(container.html()).toMatchSnapshot()
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

    expect(createExtracts().extractHtml).toMatchSnapshot()
    expect(document.documentElement).toMatchSnapshot()

    globalThis.document = document
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

    const { styled: sstyled, flush: themeFlush } = createSystem()
    // @ts-expect-error
    sstyled.sourceMap = '1'
    sstyled('button', {
      backgroundColor: 'gainsboro',
      borderRadius: '9999px'
    })

    expect(document.documentElement).toMatchSnapshot()
    document.head.removeChild(meta)
    themeFlush()
  })

  it('render Element hydrate', async () => {
    const { styled: hydrateStyled, createExtracts } = createSystem()

    hydrateStyled('div', {
      backgroundColor: 'gainsboro',
      borderRadius: '9999px'
    })
    const { extractElement } = createExtracts()

    globalThis.document = document
    const container = mount(() => extractElement)

    expect(container.html()).toMatchSnapshot()
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
    const container = mount(() => extractElement)

    expect(container.html()).toMatchSnapshot()
    process.env.NODE_ENV = 'test'
  })
})
