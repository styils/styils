import React from 'react'
import { createSelector } from './createSelector'
import { type SystemOptions, type Styled, type System } from './systemTypes'
import { type AnyObject } from './types'
import { parseRules } from './parse'
import { StyleSheet } from './sheet'

export function createSystem<Theme extends AnyObject = {}>(
  options: SystemOptions<Theme> = {}
): System<Theme> {
  const {
    theme: inputTheme = () => ({} as AnyObject),
    defaultMode = 'none',
    sheetOptions = {}
  } = options
  const { key, container, speedy, nonce } = sheetOptions
  let globalCache: AnyObject = {}

  const sheet = new StyleSheet({
    key: key ?? 'css',
    speedy: speedy === undefined ? process.env.NODE_ENV === 'production' : speedy,
    container: globalThis.document ? container ?? globalThis.document.head : null,
    nonce
  })

  const themeContent = React.createContext<{
    mode: string
    setMode: React.Dispatch<React.SetStateAction<string>>
    theme: Theme
  }>(
    // @ts-expect-error no value initially
    {}
  )

  const SystemProvider = (props: { children: React.ReactNode }) => {
    const [mode, setMode] = React.useState<string>(defaultMode)

    return React.createElement(
      themeContent.Provider,
      { value: { mode, setMode, theme: inputTheme(mode) } },
      props.children
    )
  }

  const useSystem = () => {
    return React.useContext(themeContent)
  }

  const styled: Styled<Theme> = (tag, styles, interpolation) => {
    let inputTag = tag
    const inputNamespace = (tag as { namespace: string }).namespace ?? ''

    if (typeof tag === 'object') {
      inputTag = tag.tag
    }

    let currentMode: string = defaultMode
    const modeIdentifier: Record<string, { targetClassName: string; namespaceJoiner: string }> = {}

    function createRule(
      mode: string,
      inputTargetInfo: { targetClassName: string; namespaceJoiner: string }
    ) {
      const identifier = modeIdentifier[mode]

      if (identifier) {
        const { namespaceJoiner, targetClassName } = identifier
        inputTargetInfo.namespaceJoiner = namespaceJoiner
        inputTargetInfo.targetClassName = targetClassName
        return
      }

      const theme = inputTheme(mode)
      const style = typeof styles === 'function' ? styles(theme, mode) : styles
      const variants =
        typeof interpolation === 'function' ? interpolation(theme, mode) : interpolation

      const selector = createSelector(style)
      let targetClassName = selector
      let namespaceJoiner = ''

      if (inputNamespace) {
        targetClassName = `${inputNamespace}-${selector}`
        namespaceJoiner = `${inputNamespace}-`
      }

      // this solves the problem of repeatedly adding the same value in hot update
      // which is not affected in sound field mode
      if (process.env.NODE_ENV !== 'production') {
        if (!globalCache[targetClassName]) {
          globalCache[targetClassName] = parseRules(style, `.${targetClassName}`)
          sheet.insertStyle(globalCache[targetClassName])
        }
      } else {
        sheet.insertStyle(parseRules(style, `.${targetClassName}`))
      }

      if (variants) {
        const variantsKeys = Object.keys(variants)
        let variantsIndex = variantsKeys.length

        while (variantsIndex--) {
          const variantsKey = variantsKeys[variantsIndex]
          const variantsValue = variants[variantsKey]

          const variantsChildKeys = Object.keys(variantsValue)
          let variantsChildIndex = variantsChildKeys.length

          while (variantsChildIndex--) {
            const key = variantsChildKeys[variantsChildIndex]
            const value = variantsValue[key]
            const variantsClassName = `.${targetClassName}.${namespaceJoiner}${variantsKey}-${key}`

            // this solves the problem of repeatedly adding the same value in hot update
            // which is not affected in sound field mode
            if (process.env.NODE_ENV !== 'production') {
              if (!globalCache[variantsClassName]) {
                globalCache[variantsClassName] = parseRules(value, variantsClassName)
                sheet.insertStyle(globalCache[variantsClassName])
              }
            } else {
              sheet.insertStyle(parseRules(value, variantsClassName))
            }
          }
        }
      }

      inputTargetInfo.targetClassName = targetClassName
      inputTargetInfo.namespaceJoiner = namespaceJoiner

      modeIdentifier[mode] = {
        targetClassName,
        namespaceJoiner
      }
    }

    const targetInfo = {
      targetClassName: '',
      namespaceJoiner: ''
    }

    createRule(defaultMode, targetInfo)

    const styledComponent = React.forwardRef<HTMLElement, AnyObject>((props, ref) => {
      const { as = inputTag, className = '', variants: variantsProps, ...rest } = props
      let variantsClassName = ''

      const { mode } = React.useContext(themeContent)

      if (mode !== currentMode && mode !== undefined) {
        createRule(mode, targetInfo)
        currentMode = mode
      }

      if (variantsProps) {
        const variantsPropsKeys = Object.keys(variantsProps)
        let variantsPropsIndex = variantsPropsKeys.length

        while (variantsPropsIndex--) {
          const key = variantsPropsKeys[variantsPropsIndex]
          const value = variantsProps[key]

          variantsClassName += ` ${targetInfo.namespaceJoiner}${key}-${value}`
        }
      }

      return React.createElement(as, {
        className: `${className ? className + ' ' : className}${
          targetInfo.targetClassName
        }${variantsClassName}`,
        ref,
        ...rest
      })
    })

    if (process.env.NODE_ENV !== 'production') {
      styledComponent.displayName = styledComponent.displayName ?? targetInfo.targetClassName
    }

    Object.defineProperty(styledComponent, 'toString', {
      value() {
        return `.${targetInfo.targetClassName}`
      }
    })

    return styledComponent
  }

  function getCssValue() {
    return sheet.ssrData
  }

  function flush() {
    sheet.flush()
    globalCache = {}
  }

  return { styled, SystemProvider, useSystem, getCssValue, flush }
}

export const { styled, getCssValue, flush } = createSystem()
