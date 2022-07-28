import React from 'react'
import { TestRunner } from '../TestRunner'
import { interpolatePurples, interpolateBuPu, interpolateRdPu } from 'd3-scale-chromatic'

const targetSize = 10

export function SierpinskiTriangle({ testIndex, x = 0, y = 0, depth = 0, s: _s = 200 }) {
  let s = _s

  if (s <= targetSize) {
    let fn
    switch (depth) {
      case 1:
        fn = interpolatePurples
        break
      case 2:
        fn = interpolateBuPu
        break
      case 3:
      default:
        fn = interpolateRdPu
    }

    // introduce randomness to ensure that repeated runs don't produce the same colors
    const color = fn((testIndex * Math.random()) / 20)

    return (
      <div
        style={{
          borderBottomColor: color,
          borderRightWidth: targetSize / 2,
          borderBottomWidth: targetSize / 2,
          borderLeftWidth: targetSize / 2,
          marginLeft: x - targetSize / 2,
          marginTop: y - targetSize / 2,
          position: 'absolute',
          cursor: 'pointer',
          width: '0',
          height: '0',
          borderColor: 'transparent',
          borderStyle: 'solid',
          borderTopWidth: 0,
          transform: 'translate(50%, 50%)',
          alignItems: 'stretch',
          boxSizing: 'border-box',
          display: 'flex',
          flexBasis: 'auto',
          flexDirection: 'column',
          flexShrink: 0,
          padding: '0',
          minHeight: '0',
          minWidth: '0'
        }}
      />
    )
  }

  s /= 2

  return (
    <React.Fragment>
      <SierpinskiTriangle depth={1} testIndex={testIndex} s={s} x={x} y={y - s / 2} />
      <SierpinskiTriangle depth={2} testIndex={testIndex} s={s} x={x - s} y={y + s / 2} />
      <SierpinskiTriangle depth={3} testIndex={testIndex} s={s} x={x + s} y={y + s / 2} />
    </React.Fragment>
  )
}

const Test = () => {
  return (
    <TestRunner
      testIdentifier="sierpinski-triangle-baseline"
      numberOfRuns={3}
      iterationN={50}
      TestComponent={SierpinskiTriangle as any}
    />
  )
}

export default Test
