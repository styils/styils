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

type StyledProps<As extends React.ElementType, Variants, Var extends PropertyKey> = Omit<
  React.ComponentProps<As>,
  'ref'
> & {
  ref?: PropsWithRef<React.ComponentProps<As>>
} & {
  as?: As
  variants?: {
    [key in keyof Variants]?: Widen<Variants[key]>
  }
  cssState?: {
    [key in Var]?: string | number
  }
}

export interface StyledComponent<
  Component extends React.ElementType,
  Variants,
  Var extends PropertyKey
> extends FunctionComponent {
  <As extends React.ElementType = Component>(props: StyledProps<As, Variants, Var>): JSX.Element
}

export interface Styled<Theme> {
  <
    Component extends StyleTag,
    VariantsKey extends PropertyKey = '',
    VariantsValue extends PropertyKey = '',
    Var extends string = ''
  >(
    component: Component | { tag: Component; namespace?: string },
    styles: CSSAttribute<Var> | ((props: Theme, mode: string) => CSSAttribute<Var>),
    interpolation?: StyleInterpolation<Theme, VariantsKey, VariantsValue, Var>
  ): StyledComponent<
    Component extends React.ForwardRefExoticComponent<AnyObject>
      ? Component
      : Component extends StyledComponent<infer A, AnyObject, PropertyKey>
      ? A
      : Component,
    { [key in VariantsKey as '' extends key ? never : key]: VariantsValue },
    Var
  >
}
