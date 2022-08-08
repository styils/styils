import { batch, createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { styled, SystemProvider, useSystem } from './theme'

const Button = styled(
  'button',
  (mode) => {
    return {
      color: mode.color
    }
  },
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
  const [size, setSize] = createSignal<'max' | 'small'>('max')

  const { setMode, mode, theme } = useSystem()

  // const ExtractElement = [
  //   Dynamic({
  //     component: 'meta',
  //     id: 'metaSelectorCacheId'
  //   }),
  //   Dynamic({
  //     component: 'style',
  //     id: 'globalStyleSSRId',
  //     children: 'ssrGlobalData'
  //   }),
  //   Dynamic({
  //     component: 'style',
  //     id: 'styleSSRId',
  //     children: 'ssrData'
  //   })
  // ]

  return (
    <div>
      {/* {ExtractElement} */}
      <Button
        onClick={() => {
          batch(() => {
            setMode(mode() === 'light' ? 'dark' : 'light')

            setSize(size() === 'max' ? 'small' : 'max')
          })
        }}
        variants={{ size: size() }}
      >
        hello soild ${size()}
      </Button>
      hello 123 {mode()} {theme().color}
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
