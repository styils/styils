import React from 'react'
import { TestComponentProps, TestRunner } from '../TestRunner'
import { buttonStyles, buttonVariants } from '../utils/buttonStyles'
import { styled } from '@styil/react'

const Button = styled(
  'button',
  {
    ...(buttonStyles as any)
  },
  buttonVariants.variants
)

const Test: React.FunctionComponent<TestComponentProps> = ({ testIndex }: TestComponentProps) => {
  return (
    <Button
      variants={{
        variant: testIndex % 2 === 0 ? 'red' : 'blue',
        size: testIndex % 2 === 0 ? '1' : '2'
      }}
    >
      styil {testIndex}
    </Button>
  )
}

const StitchesTest = () => {
  return (
    <>
      <TestRunner numberOfRuns={3} iterationN={1000} TestComponent={Test} />

      <div style={{ opacity: 0, pointerEvents: 'none' }}>
        <Button>将按钮安装在测试之外，以确保没有计时任何安装时间</Button>
      </div>
    </>
  )
}

export default StitchesTest
