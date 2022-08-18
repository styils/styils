import type { AnyObject } from './types'
import { StyleInterpolation, Styles, Widen } from './baseSystemTypes'
import { Component, DefineComponent, VNode, VNodeRef } from 'vue'

export type JSX = {
  [K in keyof JSX.IntrinsicElements as string extends K ? never : K]: JSX.IntrinsicElements[K]
}

export type Provider = (props: { children: VNode }) => VNode

export type ExtractElement = VNode

export type NativeComponent =
  | keyof JSX
  | Component<AnyObject>
  // magic
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Function

export type ComponentProps<T> = T extends keyof JSX
  ? JSX[T]
  : T extends
      | DefineComponent<infer Props, any, any, any, any, any, any, any>
      | ((props: infer Props) => JSX.Element)
  ? Props
  : {}

export type StyledProps<As extends NativeComponent, Variants, Vars extends string> = {
  ref?: VNodeRef
} & ComponentProps<As> & {
    as?: As
    variants?: Variants
    vars?: {
      [key in Vars]?: string | number
    }
  }

export type StyledComponent<Component extends NativeComponent, Variants, Vars extends string> = <
  As extends NativeComponent = Component
>(
  props: StyledProps<As, Variants, Vars>
) => VNode

export interface Styled<Theme> {
  <Component extends NativeComponent, Variants extends AnyObject, Vars extends string = ''>(
    component: Component | { tag: Component; namespace?: string },
    styles: Styles<Theme, Vars>,
    interpolation?: StyleInterpolation<Theme, Variants>
  ): StyledComponent<
    Component extends StyledComponent<infer T, AnyObject, string> ? T : Component,
    { [key in keyof Variants]: Widen<keyof Variants[key]> },
    Vars
  >
}
