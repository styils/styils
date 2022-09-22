import { css, glob, keyframes, createStyils, flush } from './css'

describe('css', () => {
  afterEach(() => {
    flush()
  })

  it('base css', () => {
    const out = css({ foo: 1 })

    document.head.childNodes.forEach((item) => {
      expect(item.textContent).toEqual('.css-2165983570{foo:1px;}')
    })

    expect(out).toEqual('css-2165983570')
  })

  it('global css', () => {
    const out = glob({ body: { backgroundColor: 'red' } })
    document.head.childNodes.forEach((item) => {
      expect(item.textContent).toEqual('body{background-color:red;}')
    })

    expect(out).toEqual(undefined)
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
        '@keyframes css-524936959{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}'
      )
    })

    expect(out).toEqual('css-524936959')
  })

  it('createStyils', () => {
    const { css, flush } = createStyils({
      key: 'abc',
      container: document.body,
      nonce: '123456'
    })
    const out = css({
      width: 'auto'
    })

    expect(document.documentElement).toMatchSnapshot()

    expect(out).toEqual('abc-3169980522')
    flush()
  })

  it('createStyils speedy', () => {
    process.env.NODE_ENV = 'production'
    const { css } = createStyils()
    const out = css({
      width: 'auto',
      '.foo': {
        height: 'auto'
      }
    })

    expect(document.documentElement).toMatchSnapshot()

    expect(out).toEqual('css-3676222078')
  })
})
