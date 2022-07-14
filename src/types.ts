import { Properties } from 'nativeCssTypes'

export type AnyObject = Record<PropertyKey, any>

export interface CSSAttribute extends Properties {
  [key: string]: CSSAttribute | string | number | undefined
}

export type StyleSheetOptions = {
  nonce?: string
  key: string
  container: Node
  speedy?: boolean
  prepend?: boolean
}

export type Rules = {
  segmentRuleCode: string[]
  ruleCode: string
}
