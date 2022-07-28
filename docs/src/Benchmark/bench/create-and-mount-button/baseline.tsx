import React from 'react'
import { TestComponentProps, TestRunner } from '../TestRunner'
import { buttonStyles } from '../utils/buttonStyles'

/** This test aims to measure the baseline of just using React with vanilla CSS techniques (no CSS-in-JS) */
const TestBase = ({ testIndex }: TestComponentProps) => {
  return <button style={{ '--test-index': testIndex, ...(buttonStyles as any) }}>testing</button>
}

const Test = () => {
  return (
    <TestRunner
      testIdentifier="create-and-mount-button-baseline"
      numberOfRuns={3}
      iterationN={1000}
      TestComponent={TestBase}
    />
  )
}

export default Test
