import type { AnyObject } from './types'
import type { NeverObeject, StyleInterpolation, Styles, Widen } from './baseSystemTypes'
import type { Component, DefineComponent, VNode, VNodeProps, VNodeRef } from 'vue'

export type JSX = {
  [K in keyof HTMLElementTagNameMap as string extends K ? never : K]: HTMLElementTagNameMap[K]
}

type HTMLElementEventHandler = {
  [K in keyof HTMLElementEventMap as `on${Capitalize<K>}`]?: (ev: HTMLElementEventMap[K]) => any
}

export type StyledTag = keyof JSX | Component<AnyObject> | Function

export type ComponentProps<T> = T extends keyof JSX
  ? (Partial<JSX[T]> & HTMLElementEventHandler & VNodeProps & Record<string, any>) | null
  : T extends
      | DefineComponent<infer Props, any, any, any, any, any, any, any>
      | ((props: infer Props) => JSX.Element)
  ? Props
  : {}

export type StyledProps<As extends StyledTag, Variants, Vars> = {
  ref?: VNodeRef
} & ComponentProps<As> & {
    as?: As
    variants?: Variants
    vars?: Vars
  }

export type StyledComponent<Component extends StyledTag, Variants, Vars> = <
  As extends StyledTag = Component
>(
  props: StyledProps<As, Variants, Vars>
) => VNode

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
