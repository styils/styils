import styilsPlugin from '.'

type Test = {
  transform: (code: string, id: string) => Promise<string>
}
describe('vite plugin', () => {
  it('base', async () => {
    const plugin = styilsPlugin() as Test

    const code = await plugin.transform(
      `
    import { styled } from '@styils/react'

    const Button = styled('button', {})
    `,
      'src/index.ts'
    )

    expect(code).toMatch(/sourceMap/)
  })

  it('base enforce post not .vue', async () => {
    const plugin = styilsPlugin() as Test

    const code = await plugin.transform(
      `
    import { styled } from '@styils/react'

    const Button = styled('button', {})
    `,
      'src/index.vue'
    )

    expect(/sourceMap/.test(code)).toEqual(false)
  })

  it('parameter url', async () => {
    const plugin = styilsPlugin() as Test

    const code = await plugin.transform(
      `
    import { styled } from '@styils/react'

    const Button = styled('button', {})
    `,
      'src/index.ts?test=1'
    )

    expect(code).toMatch(/sourceMap/)
  })

  it('node_modules url', async () => {
    const plugin = styilsPlugin() as Test

    const code = await plugin.transform(
      `
    import { styled } from '@styils/react'

    const Button = styled('button', {})
    `,
      'node_modules/src/index.ts?test=1'
    )

    expect(/sourceMap/.test(code)).toEqual(false)
  })

  it('not babel code', async () => {
    const plugin = styilsPlugin() as Test

    const code = await plugin.transform(
      `
    `,
      'src/index.ts?test=1'
    )

    expect(/sourceMap/.test(code)).toEqual(false)
  })

  it('not babel code', async () => {
    const plugin = styilsPlugin() as Test

    const code = await plugin.transform(
      `
    `,
      'src/index.ts?test=1'
    )

    expect(/sourceMap/.test(code)).toEqual(false)
  })
})
