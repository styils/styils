import React from 'react'
import type { AnyObject, Widen } from './types'
import type { StyleInterpolation, Styles } from './baseSystemTypes'

export interface FunctionComponent {
  displayName?: string
}

export type StyleTag =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<{}>
  | React.ComponentClass

type PropsWithRef<P> = 'ref' extends keyof P ? (P extends { ref?: infer R | string } ? R : P) : P

type StyledProps<As extends React.ElementType, Variants, Vars extends string> = Omit<
  React.ComponentProps<As>,
  'ref'
> & {
  ref?: PropsWithRef<React.ComponentProps<As>>
} & {
  as?: As
  variants?: {
    [key in keyof Variants]?: Widen<Variants[key]>
  }
  vars?: {
    [key in Vars]?: string | number
  }
}

export interface StyledComponent<Component extends React.ElementType, Variants, Vars extends string>
  extends FunctionComponent {
  <As extends React.ElementType = Component>(props: StyledProps<As, Variants, Vars>): JSX.Element
}

export interface Styled<Theme> {
  <
    Component extends StyleTag,
    VariantsKey extends PropertyKey = '',
    VariantsValue extends PropertyKey = '',
    Vars extends string = ''
  >(
    component: Component | { tag: Component; namespace?: string },
    styles: Styles<Theme, Vars>,
    interpolation?: StyleInterpolation<Theme, VariantsKey, VariantsValue, Vars>
  ): StyledComponent<
    Component extends React.ForwardRefExoticComponent<AnyObject>
      ? Component
      : Component extends StyledComponent<infer A, AnyObject, any>
      ? A
      : Component,
    { [key in VariantsKey as '' extends key ? never : key]: VariantsValue },
    Vars
  >
}
