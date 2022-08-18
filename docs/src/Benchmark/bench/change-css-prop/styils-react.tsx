import React from 'react'
import { TestComponentProps, TestRunner } from '../TestRunner'
import { buttonStyles } from '../utils/buttonStyles'
import { styled } from '@styils/react'

const Button = styled('button', {
  ...buttonStyles,
  backgroundColor: '$bg',
  padding: '$padding'
})

const TestBase = ({ testIndex }: TestComponentProps) => {
  return (
    <Button
      vars={{
        bg: `hsl(${Math.floor(Math.random() * 360)} 80% 80%)`,
        padding: '20px'
      }}
      style={{
        // @ts-expect-error test
        '--test-index': testIndex
      }}
    >
      testing
    </Button>
  )
}

const StyilTest = () => {
  return (
    <TestRunner
      testIdentifier="change-css-prop-styils-react"
      numberOfRuns={3}
      iterationN={1000}
      TestComponent={TestBase}
    />
  )
}

export default StyilTest
