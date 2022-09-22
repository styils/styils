import { createSystem, styled, Styled, StyledComponent, createGlobal } from '../../dist/solid'

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
    height: '$height',
    '.foo': {
      width: '$width'
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
      width?: string | number
    }
  >
>(Anthor)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function asButton({ ref, hello }: { ref: HTMLButtonElement; hello: boolean }) {
  return (
    <Anthor
      as="button"
      vars={{
        height: '',
        width: ''
      }}
      variants={{
        size: 'small'
      }}
      ref={ref}
    />
  )
}

// @ts-expect-error Do not expose to the outside world
styled.sourceMap

// @ts-expect-error Do not expose to the outside world
createGlobal.sourceMap

createGlobal({
  body: {
    display: 'block'
  }
})

const ToLink = styleTheme(asButton, (theme) => {
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

expectType<
  typeof ToLink,
  StyledComponent<({ ref, hello }: { ref: HTMLButtonElement; hello: boolean }) => any, never, never>
>(ToLink)

expectType<typeof ToLink, typeof ToLink2>(ToLink2)

export function renderToLink({ ref }: { ref: HTMLButtonElement }) {
  return <ToLink2 ref={ref} hello />
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
  return (
    <ButtonDark
      as="a"
      ref={(ref: HTMLAnchorElement) => {
        ref.href
      }}
      variants={{ disabled: true }}
    />
  )
}

const ButtonCount = styled(
  'button',
  {
    backgroundColor: 'activetext'
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
    never
  >
>(ButtonCount)

export function renderButtonCount() {
  // @ts-expect-error
  return <ButtonCount variants={{ disabled: 1 }} vars={{}} />
}
