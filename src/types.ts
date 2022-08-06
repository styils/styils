export type AnyObject = Record<PropertyKey, any>

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

export type Widen<T> = T extends number
  ? `${T}` | T
  : T extends 'true' | 'false'
  ? boolean | T
  : T extends `${number}`
  ? number | T
  : T
