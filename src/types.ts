export type AnyObject = Record<PropertyKey, any>

export type AnyFunc = (...props: any[]) => any

export type StyleSheetOptions = {
  nonce?: string
  key: string
  container: Node
  prepend?: boolean
}

export type Rules = {
  segmentRuleCode: string[]
  ruleCode: string
  uniqueIdentifier?: string
}

export type IfEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false
