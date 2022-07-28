import React from 'react'
import { TestRunner } from '../TestRunner'
import { Tree } from '../utils/Tree'

export const TestBase = () => {
  // This purposefully creates the styled component inside the TestBase component
  // so that we can measure the time it takes using the React profiler

  const Box = ({ color, layout, outer, fixed, ...props }) => {
    const s1 = {
      0: {
        backgroundColor: '#14171A'
      },
      1: {
        backgroundColor: '#AAB8C2'
      },
      2: {
        backgroundColor: '#E6ECF0'
      },
      3: {
        backgroundColor: '#FFAD1F'
      },
      4: {
        backgroundColor: '#F45D22'
      },
      5: {
        backgroundColor: '#E0245E'
      }
    }[color]
    const s2 = {
      column: {
        flexDirection: 'column'
      },
      row: {
        flexDirection: 'row'
      }
    }[layout]
    const s3 = {
      true: {
        padding: '4px'
      }
    }[outer]
    const s4 = {
      true: {
        width: '6px',
        height: '6px'
      }
    }[fixed]

    return (
      <div
        style={{
          alignItems: 'stretch',
          borderWidth: '0',
          borderStyle: 'solid',
          boxSizing: 'border-box',
          display: 'flex',
          flexBasis: 'auto',
          flexDirection: 'column',
          flexShrink: 0,
          margin: '0',
          padding: '0',
          position: 'relative',
          minHeight: '0',
          minWidth: '0',
          alignSelf: 'flex-start',
          backgroundColor: 'transparent',
          ...s1,
          ...s2,
          ...s3,
          ...s4
        }}
      >
        {props.children}
      </div>
    )
  }

  return <Tree breadth={2} depth={7} id={0} wrap={1} box={Box} />
}

const Test = () => {
  return (
    <TestRunner
      testIdentifier="mount-deep-tree-base-line"
      numberOfRuns={3}
      iterationN={50}
      TestComponent={TestBase}
    />
  )
}

export default Test
