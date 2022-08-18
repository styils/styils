import React from 'react'
import type { AnyObject } from './types'
import type { StyleInterpolation, Styles, Widen } from './baseSystemTypes'

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

export type StyledProps<As extends React.ElementType, Variants, Vars> = Omit<
  ComponentProps<As>,
  'ref'
> & {
  ref?: PropsWithRef<ComponentProps<As>>
  as?: As
  variants?: Variants
  vars?: Vars
}

export interface StyledComponent<Component extends React.ElementType, Variants, Vars>
  extends FunctionComponent {
  <As extends React.ElementType = Component>(props: StyledProps<As, Variants, Vars>): JSX.Element
}

export interface Styled<Theme> {
  <Component extends StyleTag, Variants extends AnyObject = {}, Vars extends string = ''>(
    component: Component | { tag: Component; namespace?: string },
    styles: Styles<Theme, Vars>,
    interpolation?: StyleInterpolation<Theme, Variants>
  ): StyledComponent<
    // @ts-expect-error Conflict with vue type
    Component extends StyledComponent<infer C, AnyObject, string> ? C : Component,
    { [key in keyof Variants]: Widen<keyof Variants[key]> },
    {
      [key in Vars]?: string | number
    }
  >
}
