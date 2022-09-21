import { createBaseSystem } from './baseSystem'

const { createExtracts } = createBaseSystem(
  {},
  () => {},
  () => {},
  () => {}
)

describe('base system', () => {
  it('Isomorphic rendering remains consistent', () => {
    const style = document.createElement('style')
    style.setAttribute('data-ssr', 'styils-css-ssr')
    style.textContent = 'body{color:red}'

    const style1 = document.createElement('style')
    style1.setAttribute('data-ssr', 'styils-css-ssr')
    style1.textContent = 'body{color:blue}'

    const globStyle = document.createElement('style')
    globStyle.setAttribute('data-ssr', 'styils-css-ssr-global')
    globStyle.textContent = '.foo{}'

    document.head.appendChild(style)
    document.head.appendChild(style1)
    document.head.appendChild(globStyle)

    const { extractHtml } = createExtracts()

    expect(extractHtml).toMatch(/data-ssr="styils-css-ssr"/)
    expect(extractHtml).toMatch(/data-ssr="styils-css-ssr-global"/)
    expect(extractHtml).toMatch(/color:blue/)
    expect(extractHtml).toMatch(/color:red/)
    expect(extractHtml).toMatch(/foo{}/)
  })

  it('production isomorphic rendering remains consistent', () => {
    const style = document.createElement('style')
    style.setAttribute('id', 'styils-css-ssr')
    style.textContent = 'body{color:red}button{color:blue}'

    const globStyle = document.createElement('style')
    globStyle.setAttribute('id', 'styils-css-ssr-global')
    globStyle.textContent = '.foo{}'

    document.head.appendChild(style)
    document.head.appendChild(globStyle)

    process.env.NODE_ENV = 'production'
    const { extractHtml } = createExtracts()

    expect(extractHtml).toMatch(/id="styils-css-ssr"/)
    expect(extractHtml).toMatch(/id="styils-css-ssr-global"/)
    expect(extractHtml).toMatch(/color:blue/)
    expect(extractHtml).toMatch(/color:red/)
    expect(extractHtml).toMatch(/foo{}/)

    process.env.NODE_ENV = 'test'
  })

  it('parse vars', () => {
    const { styled } = createBaseSystem(
      {},
      () => {},
      (...props: any) => {
        expect(
          props[3]({
            height: 1,
            width: 2
          })
        ).toEqual({ '--css-124759-height': 1, '--css-124759-width': 2 })
        return {}
      },
      () => {}
    )

    styled('', {})
  })

  it('parse vars variants error', () => {
    console.error = jest.fn()
    const { styled } = createBaseSystem(
      {},
      () => {},
      (...props: any) => {
        expect(
          props[3]({
            height: 1,
            width: 2
          })
        ).toEqual({ '--css-124759-height': 1, '--css-124759-width': 2 })
        return {}
      },
      () => {}
    )

    styled(
      '',
      {},
      {
        size: {
          max: {
            color: '$height'
          }
        }
      }
    )

    expect(console.error).toHaveBeenCalledWith(
      `vars are not supported in variants: { key:'color', value:'$height' }`
    )
  })
})
