import React from 'react'
import type { Widen } from './types'
import type { BaseVariants, CssStateKey } from './baseSystemTypes'
import { CSSAttribute } from 'nativeCssTypes'

export interface FunctionComponent {
  displayName?: string
}

export type StyleTag =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<{}>
  | React.ComponentClass

type PropsWithRef<P> = 'ref' extends keyof P ? (P extends { ref?: infer R | string } ? R : P) : P

type StyledProps<
  As extends React.ElementType,
  Styles extends CSSAttribute = {},
  Variants extends BaseVariants = {}
> = Omit<React.ComponentProps<As>, 'ref'> & {
  ref?: PropsWithRef<React.ComponentProps<As>>
} & {
  as?: As
  variants?: {
    [key in keyof Variants]?: Widen<keyof Variants[key]>
  }
  cssState?: {
    [key in CssStateKey<Styles> | CssStateKey<Variants>]?: string | number
  }
}

export interface StyledComponent<
  Component extends React.ElementType,
  Styles extends CSSAttribute,
  Variants extends BaseVariants
> extends FunctionComponent {
  <As extends React.ElementType = Component>(props: StyledProps<As, Styles, Variants>): JSX.Element
}

export interface Styled<Theme> {
  <Component extends StyleTag, Styles extends CSSAttribute, Variants extends BaseVariants>(
    component: Component | { tag: Component; namespace?: string },
    styles: Styles | ((props: Theme, mode: string) => Styles),
    interpolation?: Variants | ((props: Theme, mode: string) => Variants)
  ): StyledComponent<
    Component extends React.ForwardRefExoticComponent<any>
      ? Component
      : Component extends StyledComponent<infer A, any, any>
      ? A
      : Component,
    Styles,
    Variants
  >
}
