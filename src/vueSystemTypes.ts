import type { AnyObject } from './types'
import type { NeverObeject, StyleInterpolation, Styles, Widen } from './baseSystemTypes'
import type { Component, DefineComponent, VNode, VNodeRef } from 'vue'

export type JSX = {
  [K in keyof JSX.IntrinsicElements as string extends K ? never : K]: JSX.IntrinsicElements[K]
}

export type NativeComponent = keyof JSX | Component<AnyObject> | Function

export type ComponentProps<T> = T extends keyof JSX
  ? JSX[T]
  : T extends
      | DefineComponent<infer Props, any, any, any, any, any, any, any>
      | ((props: infer Props) => JSX.Element)
  ? Props
  : {}

export type StyledProps<As extends NativeComponent, Variants, Vars> = {
  ref?: VNodeRef
} & ComponentProps<As> & {
    as?: As
    variants?: Variants
    vars?: Vars
  }

export type StyledComponent<Component extends NativeComponent, Variants, Vars> = <
  As extends NativeComponent = Component
>(
  props: StyledProps<As, Variants, Vars>
) => VNode

export interface Styled<Theme> {
  <Component extends NativeComponent, Variants extends AnyObject = {}, Vars extends string = ''>(
    component: Component | { tag: Component; namespace?: string },
    styles: Styles<Theme, Vars>,
    interpolation?: StyleInterpolation<Theme, Variants>
  ): StyledComponent<
    Component extends StyledComponent<infer C, AnyObject, string> ? C : Component,
    NeverObeject<{ [key in keyof Variants]?: Widen<keyof Variants[key]> }>,
    NeverObeject<{ [key in Vars as '' extends key ? never : key]?: string | number }>
  >
}
