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
        props[3]({
          height: 1,
          width: 2
        })
        return {}
      },
      () => {}
    )

    styled('', {})

    expect(document.documentElement.style[0]).toEqual('--css-11-height')
    expect(document.documentElement.style[1]).toEqual('--css-11-width')

    expect(document.documentElement.style.getPropertyValue('--css-11-height')).toEqual('1')
    expect(document.documentElement.style.getPropertyValue('--css-11-width')).toEqual('2')
  })
})
