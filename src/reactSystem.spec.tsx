import { createSystem, styled } from './reactSystem'
import React from 'react'
import { createGlobal } from './solidSystem'

const { styled: styleTheme } = createSystem({
  theme: () => ({ color: 'red', bg: 'blue' }),
  defaultMode: 'light'
})

const Anthor = styled(
  'a',
  {
    width: '$height' as any,
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
