import { createSystem, styled, global } from './reactSystem'
import React from 'react'

const { styled: styleTheme } = createSystem({
  theme: () => ({ color: 'red', bg: 'blue' }),
  defaultMode: 'light'
})

const Anthor = styled(
  'a',
  {
    height: 100,
    '.foo': {
      height: 100
    }
  },
  {
    size: {
      small: {
        width: '100'
      }
    }
  }
)

// @ts-expect-error Do not expose to the outside world
styled.sourceMap

// @ts-expect-error Do not expose to the outside world
global.sourceMap

export function asButton() {
  return (
    <Anthor
      as="button"
      variants={{ size: 'small' }}
      ref={(ref: HTMLButtonElement) => {
        expectType<HTMLButtonElement, typeof ref>(ref)
      }}
    />
  )
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
  {},
  {
    disabled: {
      1: {
        fontSize: 14
      }
    }
  }
)

export function renderButtonCount() {
  return <ButtonCount variants={{ disabled: 1 }} />
}
