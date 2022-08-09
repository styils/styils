import { batch, createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { styled, SystemProvider, useSystem } from './theme'

const Button = styled(
  'button',
  (mode) => {
    return {
      color: mode.color,
      height: '$height'
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
  const [type, setType] = createSignal<'a' | 'button'>('button')
  const [height, setHeight] = createSignal(0)

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
        vars={{
          height: `${height()}px`
        }}
        onClick={() => {
          batch(() => {
            setHeight(height() + 10)
            setMode(mode() === 'light' ? 'dark' : 'light')
            setType(type() === 'a' ? 'button' : 'a')
            setSize(size() === 'max' ? 'small' : 'max')
          })
        }}
        variants={{ size: size() }}
      >
        hello soild {size()} {type()}
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
