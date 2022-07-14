import { createSystem, styled } from './system'
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

export function asButton() {
  return (
    <Anthor
      as="button"
      variants={{ size: 'small' }}
      ref={(ref) => {
        expectType<HTMLButtonElement | null, typeof ref>(ref)
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
