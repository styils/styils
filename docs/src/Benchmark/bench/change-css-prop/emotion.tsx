import React from 'react'
import { TestComponentProps, TestRunner } from '../TestRunner'
import { buttonStyles } from '../utils/buttonStyles'
import styled from '@emotion/styled'

const Button: any = styled('button')((props: any) => ({
  ...buttonStyles,
  ...props.css
}))

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
    <>
      <TestRunner
        testIdentifier="change-css-prop-emotion"
        numberOfRuns={3}
        iterationN={1000}
        TestComponent={TestBase}
      />

      <div style={{ opacity: 0, pointerEvents: 'none' }}>
        <Button>将按钮安装在测试之外，以确保没有计时任何安装时间</Button>
      </div>
    </>
  )
}

export default Test
