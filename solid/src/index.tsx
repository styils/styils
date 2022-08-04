import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { createSystem } from '../../src/solidSystem'

const { styled, SystemProvider, useSystem } = createSystem({
  theme: (mode) => {
    return {
      light: {
        color: 'red'
      },
      dark: {
        color: 'blue'
      }
    }[mode]
  },
  defaultMode: 'light'
})

const Button = styled(
  'button',
  (mode) => ({
    color: mode.color
  }),
  {
    size: {
      small: {
        fontSize: 32
      },
      max: {
        fontSize: 12
      }
    }
  }
)

const App = () => {
  const [size] = createSignal<'max' | 'small'>('max')

  const { setMode, mode } = useSystem()

  return (
    <div>
      <Button
        as="a"
        onClick={() => {
          setMode(mode() === 'light' ? 'dark' : 'light')

          // setMode(mode() === 'light' ? 'dark' : 'light')
          // setSize(size() === 'max' ? 'small' : 'max')
        }}
        variants={{ size: size() }}
      >
        hello soild ${size()}
      </Button>
      hello 123
    </div>
  )
}

render(
  () => (
    <SystemProvider>
      <App />
    </SystemProvider>
  ),
  document.getElementById('root') as HTMLElement
)
