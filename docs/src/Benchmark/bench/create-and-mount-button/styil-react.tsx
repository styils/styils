import React from 'react'
import { TestComponentProps, TestRunner } from '../TestRunner'
import { buttonStyles } from '../utils/buttonStyles'
import { styled } from '@styils/react'

const TestBase = ({ testIndex }: TestComponentProps) => {
  // This purposefully creates the styled component inside the TestBase component
  // so that we can measure the time it takes using the React profiler
  const Button = styled('button', {
    '--test-index': testIndex,
    ...(buttonStyles as any)
  })

  return <Button>styils</Button>
}

const StyilTest = () => {
  return (
    <TestRunner
      testIdentifier="create-and-mount-button-styils-react"
      numberOfRuns={3}
      iterationN={1000}
      TestComponent={TestBase}
    />
  )
}

export default StyilTest
