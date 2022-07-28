import React from 'react'
import { TestComponentProps, TestRunner } from '../TestRunner'
import styled from 'styled-components'
import { buttonStyles } from '../utils/buttonStyles'

const TestBase = ({ testIndex }: TestComponentProps) => {
  // This purposefully creates the styled component inside the TestBase component
  // so that we can measure the time it takes using the React profiler
  const Button = styled('button')({
    '--test-index': testIndex,
    ...(buttonStyles as any)
  })

  return <Button>testing</Button>
}

const Test = () => {
  return (
    <TestRunner
      testIdentifier="create-and-mount-button-styled-components"
      numberOfRuns={3}
      iterationN={1000}
      TestComponent={TestBase}
    />
  )
}

export default Test
