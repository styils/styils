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

export type IfEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false
