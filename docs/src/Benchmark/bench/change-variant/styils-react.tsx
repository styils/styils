import React from 'react'
import { TestComponentProps, TestRunner } from '../TestRunner'
import { buttonStyles, buttonVariants } from '../utils/buttonStyles'
import { styled } from '@styils/react'

const Button = styled(
  'button',
  {
    ...(buttonStyles as any)
  },
  buttonVariants.variants
)

const TestBase: React.FunctionComponent<TestComponentProps> = ({
  testIndex
}: TestComponentProps) => {
  return (
    <Button
      variants={{
        variant: testIndex % 2 === 0 ? 'red' : 'blue',
        size: testIndex % 2 === 0 ? '1' : '2'
      }}
    >
      styils {testIndex}
    </Button>
  )
}

const Test = () => {
  return (
    <TestRunner
      testIdentifier="change-variant-styils-react"
      numberOfRuns={3}
      iterationN={1000}
      TestComponent={TestBase}
    />
  )
}

export default Test
