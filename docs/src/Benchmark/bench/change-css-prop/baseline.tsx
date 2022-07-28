import React from 'react'
import { TestComponentProps, TestRunner } from '../TestRunner'
import { buttonStyles } from '../utils/buttonStyles'
import { stringify } from '@stitches/stringify'

const TestBase = ({ testIndex }: TestComponentProps) => {
  return (
    <button
      className="static-button-styles"
      style={
        {
          '--test-index': testIndex,
          backgroundColor: `hsl(${Math.floor(Math.random() * 360)} 80% 80%)`
        } as any
      }
    >
      testing
    </button>
  )
}

const Test = () => {
  return (
    <>
      <TestRunner
        testIdentifier="change-css-prop-baseline"
        numberOfRuns={3}
        iterationN={1000}
        TestComponent={TestBase}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: stringify({ '.static-button-styles': { ...buttonStyles, padding: '20px' } })
        }}
      />
    </>
  )
}

export default Test
