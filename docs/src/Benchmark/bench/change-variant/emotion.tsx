import React from 'react'
import { TestComponentProps, TestRunner } from '../TestRunner'
import { buttonStyles, buttonInterpolatedVariants } from '../utils/buttonStyles'
import styled from '@emotion/styled'

const Button = styled('button')((props) => ({
  ...(buttonStyles as any),
  ...(buttonInterpolatedVariants(props) as any)
}))

const TestBase: React.FunctionComponent<TestComponentProps> = ({
  testIndex
}: TestComponentProps) => {
  const variants = {
    variant: testIndex % 2 === 0 ? 'red' : 'blue',
    size: testIndex % 2 === 0 ? '1' : '2'
  }
  return <Button {...variants}>testing</Button>
}

const Test = () => {
  return (
    <TestRunner
      testIdentifier="change-variant-button-emotion"
      numberOfRuns={3}
      iterationN={1000}
      TestComponent={TestBase}
    />
  )
}

export default Test
