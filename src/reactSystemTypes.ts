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

type ComponentProps<
  T extends
    | keyof JSX.IntrinsicElements
    | React.JSXElementConstructor<any>
    | StyledComponent<any, any, any>
> = T extends React.JSXElementConstructor<infer P>
  ? P
  : T extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[T]
  : T extends StyledComponent<infer P, AnyObject, any>
  ? P
  : {}

type PropsWithRef<P> = 'ref' extends keyof P ? (P extends { ref?: infer R | string } ? R : P) : P

type StyledProps<As extends React.ElementType, Variants, Vars extends string> = Omit<
  ComponentProps<As>,
  'ref'
> & {
  ref?: PropsWithRef<ComponentProps<As>>
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
    // @ts-expect-error Conflict with vue type
    Component,
    { [key in VariantsKey as '' extends key ? never : key]: VariantsValue },
    Vars
  >
}
