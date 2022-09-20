import {
  createSystem,
  styled,
  Styled,
  createGlobal,
  StyledTag,
  StyledProps,
  StyledComponent
} from '../../dist/react'
import React from 'react'

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
        width: '100'
      },
      max: {
        width: '100'
      }
    }
  }
)

expectType<
  typeof Anthor1,
  StyledComponent<
    'a',
    {
      size?: 'small' | 'max'
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

type CProps<T extends StyledTag> = StyledProps<
  T,
  {
    size: 'max' | 'small'
  },
  {
    a: string | number
    b: string | number
  }
>

function Tst<T extends StyledTag = 'button'>(_: CProps<T>) {}

Tst({
  as: 'a',
  vars: {
    a: 1,
    b: 2,
    // @ts-expect-error
    c: 3
  },
  variants: {
    size: 'max'
  }
})

export function asButton() {
  return [
    <Anthor
      key={1}
      vars={{
        height: 1,
        // @ts-expect-error test
        foo: 2
      }}
      as="button"
      variants={{ size: 'small', test: 1 }}
      ref={(ref: HTMLButtonElement) => {
        expectType<HTMLButtonElement, typeof ref>(ref)
      }}
    />,
    <Anthor1
      key={2}
      variants={{
        size: 'max'
      }}
      vars={{
        height: 1,
        width: 'foo'
      }}
    />
  ]
}

const Link = React.forwardRef(function Link(
  _: { href?: string },
  ref: React.LegacyRef<HTMLAnchorElement>
) {
  return (
    <a ref={ref} href="#1">
      hi
    </a>
  )
})

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

expectType<
  typeof ToLink,
  StyledComponent<
    React.ForwardRefExoticComponent<
      {
        href?: string
      } & React.RefAttributes<HTMLAnchorElement>
    >,
    never,
    never
  >
>(ToLink)

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

const ButtonCount = styled('button', {
  display: 'block' as any,
  height: '$height'
})

expectType<
  typeof ButtonCount,
  StyledComponent<
    'button',
    never,
    {
      height?: string | number
    }
  >
>(ButtonCount)

export function renderButtonCount() {
  return (
    <ButtonCount
      // @ts-expect-error
      variants={{ disabled: 1 }}
      vars={{
        height: 1
      }}
    />
  )
}
