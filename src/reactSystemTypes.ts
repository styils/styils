import React from 'react'
import type { AnyObject } from './types'
import type { NeverObeject, StyleInterpolation, Styles, Widen } from './baseSystemTypes'

export interface FunctionComponent {
  displayName?: string
}

export type StyledTag =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<{}>
  | React.ComponentClass

type ComponentProps<T extends StyledTag> = T extends
  | React.JSXElementConstructor<infer P>
  | React.ComponentClass<infer P>
  ? P
  : T extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[T]
  : {}

type PropsWithRef<P> = 'ref' extends keyof P ? (P extends { ref?: infer R | string } ? R : P) : P

export type StyledProps<As extends StyledTag, Variants, Vars> = Omit<ComponentProps<As>, 'ref'> & {
  ref?: PropsWithRef<ComponentProps<As>>
  as?: As
  variants?: Variants
  vars?: Vars
}

export interface StyledComponent<Component extends StyledTag, Variants, Vars>
  extends FunctionComponent {
  <As extends StyledTag = Component>(props: StyledProps<As, Variants, Vars>): JSX.Element
}

export interface Styled<Theme> {
  <Component extends StyledTag, Variants extends AnyObject = {}, Vars extends string = ''>(
    component: Component | { tag: Component; namespace?: string },
    styles: Styles<Theme, Vars>,
    interpolation?: StyleInterpolation<Theme, Variants>
  ): StyledComponent<
    Component extends StyledComponent<infer C, AnyObject, string> ? C : Component,
    NeverObeject<{ [key in keyof Variants]?: Widen<keyof Variants[key]> }>,
    NeverObeject<{ [key in Vars as '' extends key ? never : key]?: string | number }>
  >
}
