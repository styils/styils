import React from 'react'
import type { Widen, AnyObject } from './types'
import type {
  BaseVariants,
  StyleCSSAttribute,
  StyleInterpolation,
  CssStateKey
} from './baseSystemTypes'

export type IfEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false

export type NeverKeys<T> = {
  [Key in keyof T]: T[Key] extends never ? Key : never
}[keyof T]

export type MergeProps<P1 = {}, P2 = {}> = Omit<P1, keyof P2> &
  (NeverKeys<P2> extends never ? P2 : Omit<P2, NeverKeys<P2>>)

export interface FunctionComponent {
  displayName?: string
}

export type StyledComponentProps<Props, As extends React.ElementType> = MergeProps<
  React.ComponentPropsWithRef<As>,
  Omit<Props, 'ref'> & { as?: As }
>

export interface StyledComponent<
  Element extends React.ElementType,
  ComponentProps extends AnyObject = {}
> extends FunctionComponent {
  <As extends React.ElementType = Element>(
    props: StyledComponentProps<ComponentProps, As>
  ): React.ReactElement | null
}

export type IntrinsicElement<Element extends React.ElementType> = Element extends StyledComponent<
  infer Component,
  any
>
  ? IfEqual<React.ElementType<any>, Component> extends true
    ? Element
    : Component
  : Element

export type IntrinsicProps<Element extends React.ElementType> = Element extends StyledComponent<
  infer Component,
  infer Props
>
  ? IfEqual<React.ElementType<any>, Component> extends true
    ? React.ComponentProps<Element>
    : Props
  : React.ComponentProps<Element>

export type StyleTag =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<{}>
  | React.ComponentClass

export type CSSState<Styles, Variants> = {
  // @ts-expect-error hack
  [key in CssStateKey<Styles[keyof Styles]> | CssStateKey<Variants[keyof Variants]>]?:
    | string
    | number
}

export interface Styled<Theme> {
  <
    Component extends StyleTag,
    Styles extends StyleCSSAttribute<Theme>,
    Variants extends BaseVariants
  >(
    tag: Component | { tag: Component; namespace?: string },
    styles: Styles | ((props: Theme, mode: string) => Styles),
    interpolation?: StyleInterpolation<Theme, Variants>
  ): StyledComponent<
    IntrinsicElement<Component>,
    IntrinsicProps<Component> & {
      variants?: {
        [key in keyof Variants]?: Widen<keyof Variants[key]>
      }
      cssState?: CSSState<Styles, Variants>
    }
  >
}
