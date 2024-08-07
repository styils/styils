import { defineComponent } from 'vue'
import {
  createSystem,
  styled,
  createGlobal,
  StyledComponent,
  Styled,
  ComponentProps
} from '../../dist/vue'

const { styled: styleTheme } = createSystem({
  theme: () => ({ color: 'red', bg: 'blue' }),
  defaultMode: 'light'
})

expectType<
  typeof styleTheme,
  Styled<{
    color: string
    bg: string
  }>
>(styleTheme)

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
        width: '100'
      }
    },
    test: {
      1: {
        borderRadius: '2',
        height: '25px',
        px: '10px',
        fontSize: '13px',
        lineHeight: '1'
      },
      2: {
        borderRadius: '3',
        height: '35px',
        px: '15px',
        fontSize: '15px',
        lineHeight: '1'
      }
    }
  }
)

expectType<
  typeof Anthor,
  StyledComponent<
    'a',
    {
      size?: 'small'
      test?: number | '1' | '2'
    },
    {
      height?: string | number
    }
  >
>(Anthor)

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
        display: 'flex'
      }
    }
  }
)

expectType<
  typeof Anthor1,
  StyledComponent<
    'a',
    {
      size?: 'small'
    },
    {
      height?: string | number
      width?: string | number
      123?: string | number
    }
  >
>(Anthor1)

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

const AA = defineComponent({
  props: ['test'],
  setup() {
    return () => <div>123</div>
  }
})

const TestA = defineComponent({
  setup() {
    // @ts-expect-error
    return () => <Button as={AA} test="1" test2="1" />
  }
})

const BB = (props: { foo: number }) => {
  return <div>{props.foo}</div>
}

const TestB = defineComponent({
  setup() {
    return () => <Button as={BB} foo={1} />
  }
})

export function asButton() {
  return [
    <Anthor
      key={1}
      variants={{ size: 'small' }}
      vars={{
        height: 1,
        // @ts-expect-error test
        foo: 2
      }}
      as={'button'}
    />,
    <Anthor1
      key={2}
      vars={{
        height: 1,
        width: 'foo',
        123: 1
      }}
    />
  ]
}

const Link2 = defineComponent({
  props: ['123', 'hello']
})

type LinkProps2 = ComponentProps<typeof Link2>

expectType<
  LinkProps2,
  {
    readonly 123?: any
    readonly hello?: any
  }
>({})

const ToLink = styleTheme(Link2, (theme) => {
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

const Button = styled('button', {})
const Button2 = styled(Button, {})

function renderButton() {
  // @ts-expect-error
  return <Button as="a" href="a" vars={{}} />
}

expectType<typeof Button2, typeof Button>(Button2)

expectType<typeof ToLink, typeof ToLink2>(ToLink2)

export function renderToLink() {
  return (
    <ToLink
      href=""
      as="a"
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

expectType<
  typeof ButtonDark,
  StyledComponent<
    'button',
    {
      disabled?: boolean | 'true'
    },
    never
  >
>(ButtonDark)

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

expectType<
  typeof ButtonCount,
  StyledComponent<
    'button',
    {
      disabled?: number | '1'
    },
    {
      height?: string | number
    }
  >
>(ButtonCount)

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
