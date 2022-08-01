import plugin from '.'
import { transformSync } from '@babel/core'

describe('transform api', () => {
  it('sourcemap', () => {
    const code = `
      import {styled} from '@styils/react'
      const Button:string = styled('div', {
        color:'red'
      })

      render(<Button/>)
      `

    const res = transformSync(code, {
      plugins: [plugin],
      filename: 'test.js'
    })?.code

    expect(res).toMatch('sourceMappingURL=data:application/json;charset=utf-8;base64')
  })

  it('dynamic rendering', () => {
    const code = `
      import {styled} from '@styils/react'
      function test(){
        const Button = styled('div', {
          color:'red'
        })
      }
      `

    const res = transformSync(code, {
      plugins: [[plugin, { sourceFileName: 'test.js' }]]
    })?.code

    expect(res).toMatch('sourceMappingURL=data:application/json;charset=utf-8;base64')
    expect(res).toMatchSnapshot()
  })

  it('not sourceFileName', () => {
    const code = `
      import {styled} from '@styils/react'
      styled('div', {
        color:'red'
      })
      `

    try {
      transformSync(code, {
        plugins: [plugin]
      })?.code
    } catch (err: any) {
      expect(err.message).toEqual(
        'unknown: To compile using api, you need to pass in `sourceFileName`'
      )
    }
  })

  it('plugin already exists', () => {
    try {
      transformSync(``, {
        plugins: [plugin],
        parserOpts: {
          plugins: ['jsx', 'flow']
        }
      })
      expect(true).toEqual(true)
    } catch {
      expect(false).toEqual(true)
    }

    try {
      transformSync(``, {
        plugins: [plugin],
        parserOpts: {
          plugins: ['jsx', ['flow', {}]]
        }
      })
      expect(true).toEqual(true)
    } catch {
      expect(false).toEqual(true)
    }
  })

  it('precompiled', () => {
    const code = `
    import { styled1 } from '../theme';
    styled('div', {
      color: 'red'
    });`

    const res = transformSync(code, {
      plugins: [[plugin, { sourceFileName: 'test.js', importPaths: /theme$/ }]]
    })?.code

    expect(/styled\.sourceMap/.test(res!)).toEqual(false)

    const code1 = `
    import { styled } from '../theme';
    const Button = styled('div', {
      color: 'red'
    });`

    const res1 = transformSync(code1, {
      plugins: [[plugin, { sourceFileName: 'test.js', importPaths: /theme$/ }]]
    })?.code

    expect(/styled\.sourceMap/.test(res1!)).toEqual(true)

    const code2 = `
    import styled from '../theme';
    const Button = styled('div', {
      color: 'red'
    });`

    const res2 = transformSync(code2, {
      plugins: [[plugin, { sourceFileName: 'test.js', importPaths: /theme$/ }]]
    })?.code

    expect(res2).toMatch(`styled.sourceMap = "/*# sourceMappingURL=data:application/`)

    const code3 = `
    import styled from 'styled';
    styled('div', {
      color: 'red'
    });`

    const res3 = transformSync(code3, {
      plugins: [[plugin, { sourceFileName: 'test.js', importPaths: /theme$/ }]]
    })?.code

    expect(/styled\.sourceMap/.test(res3!)).toEqual(false)
  })

  it('global', () => {
    const code = `
    import {global} from '@styils/react'

    global({
      color:'red'
    })
    `

    const res = transformSync(code, {
      plugins: [[plugin, { sourceFileName: 'test.js' }]]
    })?.code

    expect(res).toMatchSnapshot()
  })

  it('global be wrapped', () => {
    const code = `
    import {global} from '@styils/react'

    if (true){
      global({
        color:'red'
      })
    }
    `

    const res = transformSync(code, {
      plugins: [[plugin, { sourceFileName: 'test.js' }]]
    })?.code

    expect(res).toMatchSnapshot()
  })
})
