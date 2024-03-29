import React from 'react'
import { TestComponentProps, TestRunner } from '../TestRunner'
import { buttonStyles } from '../utils/buttonStyles'
import { styled } from '@stitches/react'

const Button = styled('button', {
  ...(buttonStyles as any)
})

const TestBase = ({ testIndex }: TestComponentProps) => {
  return (
    <Button
      css={{
        '--test-index': testIndex,
        backgroundColor: `hsl(${Math.floor(Math.random() * 360)} 80% 80%)`,
        padding: '20px'
      }}
    >
      testing
    </Button>
  )
}

const Test = () => {
  return (
    <TestRunner
      testIdentifier="change-css-prop-stitches"
      numberOfRuns={3}
      iterationN={1000}
      TestComponent={TestBase}
    />
  )
}

export default Test
