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

  it('transform .vue file', async () => {
    const plugin = styilsPlugin({ importPaths: /theme/ }) as Test

    const code = await plugin.transform(
      `
      <script lang="ts" setup>
import { ref } from 'vue'
import { styled, useSystem, createGlobal } from './theme'

const Button = styled(
  'button',
  (mode) => ({}),
)

createGlobal({
  body: {
    backgroundColor: 'cadetblue'
  }
})
</script>
    `,
      'src/test.vue'
    )

    expect(code).toMatchSnapshot()
  })

  it('transform .vue file1', async () => {
    const plugin = styilsPlugin({ importPaths: /theme/ }) as Test

    const code = await plugin.transform(
      `
      <script lang="ts" setup>
import { ref } from 'vue'
import { styled, useSystem, createGlobal } from './theme'

styled(
  'button',
  (mode) => ({}),
)
</script>
    `,
      'src/test.vue'
    )

    expect(code).toMatchSnapshot()
  })

  it('transform .vue file2', async () => {
    const plugin = styilsPlugin({ importPaths: './theme' }) as Test

    const code = await plugin.transform(
      `
      <script lang="ts" setup>
import { ref } from 'vue'
import { styled, useSystem, createGlobal } from './theme'

let button = styled(
  'button',
  (mode) => ({}),
)
</script>
    `,
      'src/test.vue'
    )

    expect(code).toMatchSnapshot()
  })

  it('transform .vue file3', async () => {
    const plugin = styilsPlugin({ identifier: { styled: 'sx' } }) as Test

    const code = await plugin.transform(
      `
      <script lang="ts" setup>
import { ref } from 'vue'
import { sx, useSystem, createGlobal } from '@styils/vue'

let button = sx(
  'button',
  (mode) => ({}),
)
</script>
    `,
      'src/test.vue'
    )

    expect(code).toMatchSnapshot()
  })

  it('transform .vue file4', async () => {
    const plugin = styilsPlugin({ identifier: { createGlobal: 'gl' } }) as Test

    const code = await plugin.transform(
      `
      <script lang="ts" setup>
import { ref } from 'vue'
import { sx, useSystem, createGlobal as gl } from '@styils/vue'

gl({})
</script>
    `,
      'src/test.vue'
    )

    expect(code).toMatchSnapshot()
  })
})
