import { defineComponent } from 'vue'
import {
  createSystem,
  styled,
  createGlobal,
  ComponentProps,
  StyledProps,
  NativeComponent
} from '../../dist/vue'

const { styled: styleTheme } = createSystem({
  theme: () => ({ color: 'red', bg: 'blue' }),
  defaultMode: 'light'
})

const Anthor = styled(
  'a',
  {
    width: '$width' as any,
    height: '$height',
    '.foo': {
      width: '$width',
      padding: '$123'
    }
  },
  {
    size: {
      small: {
        width: '100',
        '.foo': {
          height: '$height1',
          width: '$width1'
        },
        borderRightWidth: '$targetSize',
        borderBottomWidth: '$targetSize',
        borderLeftWidth: '$targetSize',
        marginLeft: '$targetSizeX',
        marginTop: '$targetSizeY'
      }
    }
  }
)

const Anthor1 = styled(
  'a',
  () => ({
    '.foo': {
      height: '$height',
      width: '$width',
      padding: '$123'
    }
    // height: 100 as any
  }),
  {
    size: {
      small: {
        width: '100',
        '.foo': {
          height: '$height1',
          width: '$width1'
        },
        display: 'flex',
        borderRightWidth: '$targetSize',
        borderBottomWidth: '$targetSize',
        borderLeftWidth: '$targetSize',
        marginLeft: '$targetSizeX',
        marginTop: '$targetSizeY'
      }
    }
  }
)

export function render1() {
  return (
    <Anthor1
      vars={{
        height: 1
      }}
    />
  )
}

// @ts-expect-error Do not expose to the outside world
styled.sourceMap

// @ts-expect-error Do not expose to the outside world
createGlobal.sourceMap

type CProps<T extends NativeComponent> = StyledProps<T, {}, ''>

function Tst<T extends NativeComponent = 'button'>(props: CProps<T>) {}

Tst({
  as: 'a'
})

export function asButton() {
  return [
    <Anthor
      key={1}
      vars={{
        height: 1,
        width1: 2,
        // @ts-expect-error test
        foo: 2
      }}
      as="button"
      variants={{ size: 'small' }}
      ref={(ref: HTMLButtonElement) => {
        expectType<HTMLButtonElement, typeof ref>(ref)
      }}
    />,
    <Anthor1
      key={2}
      vars={{
        height1: 1,
        targetSize: 'foo'
      }}
    />
  ]
}

const Link = function Link(props: { href: string }) {
  return <a href="#1">hi</a>
}

const Link2 = defineComponent({
  props: ['123', 'hello']
})

type LinkProps = ComponentProps<typeof Link>

type LinkProps2 = ComponentProps<typeof Link2>

expectType<LinkProps, { href: string }>({ href: '1' })

expectType<
  LinkProps2,
  {
    readonly 123?: any
    readonly hello?: any
  }
>({})

const ToLink = styleTheme(Link, (theme) => {
  expectType<
    {
      color: string
      bg: string
    },
    typeof theme
  >(theme)
  return {}
})

const ToLink2 = styled(ToLink, {})

expectType<typeof ToLink, typeof ToLink2>(ToLink2)

export function renderToLink() {
  return (
    <ToLink
      href=""
      key="1"
      ref={(ref: HTMLAnchorElement) => {
        ref.href
      }}
    />
  )
}

const ButtonDark = styled(
  'button',
  {},
  {
    disabled: {
      true: {
        fontSize: 14
      }
    }
  }
)

export function renderButtonDark() {
  return <ButtonDark variants={{ disabled: true }} />
}

const ButtonCount = styled(
  'button',
  {
    display: 'block' as any,
    height: '$height'
  },
  {
    disabled: {
      1: {
        fontSize: 14
      }
    }
  }
)

export function renderButtonCount() {
  return (
    <ButtonCount
      variants={{ disabled: 1 }}
      vars={{
        height: 1
      }}
    />
  )
}
