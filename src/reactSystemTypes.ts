import React from 'react'
import type { AnyObject, Widen } from './types'
import { CSSAttribute } from 'nativeCssTypes'
import { StyleInterpolation } from './baseSystemTypes'

export interface FunctionComponent {
  displayName?: string
}

export type StyleTag =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<{}>
  | React.ComponentClass

type PropsWithRef<P> = 'ref' extends keyof P ? (P extends { ref?: infer R | string } ? R : P) : P

type StyledProps<As extends React.ElementType, Variants> = Omit<React.ComponentProps<As>, 'ref'> & {
  ref?: PropsWithRef<React.ComponentProps<As>>
} & {
  as?: As
  variants?: {
    [key in keyof Variants]?: Widen<Variants[key]>
  }
  cssState?: AnyObject
}

export interface StyledComponent<Component extends React.ElementType, Variants>
  extends FunctionComponent {
  <As extends React.ElementType = Component>(props: StyledProps<As, Variants>): JSX.Element
}

export interface Styled<Theme> {
  <
    Component extends StyleTag,
    VariantsKey extends PropertyKey = '',
    VariantsValue extends PropertyKey = ''
  >(
    component: Component | { tag: Component; namespace?: string },
    styles: CSSAttribute | ((props: Theme, mode: string) => CSSAttribute),
    interpolation?: StyleInterpolation<Theme, VariantsKey, VariantsValue>
  ): StyledComponent<
    Component extends React.ForwardRefExoticComponent<AnyObject>
      ? Component
      : Component extends StyledComponent<infer A, AnyObject>
      ? A
      : Component,
    { [key in VariantsKey as '' extends key ? never : key]: VariantsValue }
  >
}
