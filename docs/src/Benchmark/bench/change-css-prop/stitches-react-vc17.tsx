import React from 'react'
import { TestComponentProps, TestRunner } from '../TestRunner'
import { buttonStyles } from '../utils/buttonStyles'
import { styled } from '@stitches/react'

const Button = styled('button', {
  ...(buttonStyles as any)
})

const Test = ({ testIndex }: TestComponentProps) => {
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

const StitchesTest = () => {
  return (
    <>
      <TestRunner
        testIdentifier="change-css-prop-stitches"
        numberOfRuns={3}
        iterationN={1000}
        TestComponent={Test}
      />

      <div style={{ opacity: 0, pointerEvents: 'none' }}>
        <Button>将按钮安装在测试之外，以确保没有计时任何安装时间</Button>
      </div>
    </>
  )
}

export default StitchesTest
