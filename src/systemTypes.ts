import React from 'react'
import { type AnyObject, type CSSAttribute, type StyleSheetOptions } from './types'

export type IfEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false

export type NeverKeys<T> = {
  [Key in keyof T]: T[Key] extends never ? Key : never
}[keyof T]

export type MergeProps<P1 = {}, P2 = {}> = Omit<P1, keyof P2> &
  (NeverKeys<P2> extends never ? P2 : Omit<P2, NeverKeys<P2>>)

export type StyleInterpolation<Theme, Variants> =
  | Variants
  | ((props: Theme, mode: string) => Variants)

export type StyleCSSAttribute<Theme> = CSSAttribute | ((props: Theme, mode: string) => CSSAttribute)

export interface FunctionComponent {
  displayName?: string
  label?: string
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

export type IntrinsicTagName<Element> = {
  [Key in keyof JSX.IntrinsicElements]: JSX.IntrinsicElements[Key] extends  // eslint-disable-next-line @typescript-eslint/no-unused-vars
    | React.DetailedHTMLProps<infer _, infer Component>
    | React.SVGProps<infer Component>
    ? IfEqual<Component, Element> extends true
      ? Key
      : never
    : never
}[keyof JSX.IntrinsicElements]

export type StyleTag =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<{}>
  | React.ComponentClass

export interface Styled<Theme> {
  <Component extends StyleTag, Variants extends Record<string, Record<string, CSSAttribute>>>(
    tag: Component | { tag: Component; namespace?: string },
    styles: StyleCSSAttribute<Theme>,
    interpolation?: StyleInterpolation<Theme, Variants>
  ): StyledComponent<
    IntrinsicElement<Component>,
    IntrinsicProps<Component> & {
      variants?: {
        [key in keyof Variants]?: Widen<keyof Variants[key]>
      }
    }
  >
}

export interface SystemOptions<Theme> {
  theme?: (mode: string) => Theme
  defaultMode?: string
  sheetOptions?: Partial<StyleSheetOptions>
}

export interface System<Theme> {
  styled: Styled<Theme>
  SystemProvider: (props: { children: React.ReactNode }) => React.FunctionComponentElement<
    React.ProviderProps<{
      mode: string
      setMode: React.Dispatch<React.SetStateAction<string>>
      theme: Theme
    }>
  >
  useSystem: () => {
    mode: string
    setMode: React.Dispatch<React.SetStateAction<string>>
    theme: Theme
  }
  global: (styles: CSSAttribute | ((theme: Theme, mode: string) => CSSAttribute)) => void
  getCssValue: () => string
  flush: () => void
}

export type Widen<T> = T extends number
  ? `${T}` | T
  : T extends 'true' | 'false'
  ? boolean | T
  : T extends `${number}`
  ? number | T
  : T
