import React from 'react'
import { RunResult, TestInfo } from './TestRunner'

type Result = Omit<RunResult, 'N'>
type ResultKey = keyof Result

const calculateAverage = (
  results: Record<number, Result>,
  key: ResultKey,
  numberOfRuns: number
) => {
  let total = 0

  ;[...Array(numberOfRuns)].forEach((_, index) => {
    total += results[index][key]
  })
  return total / numberOfRuns
}

export const TestResults = ({ testInfo }: { testInfo: TestInfo }) => {
  const averageInfo: Result = {
    firstIteration: calculateAverage(testInfo.results, 'firstIteration', testInfo.numberOfRuns),
    lastIteration: calculateAverage(testInfo.results, 'lastIteration', testInfo.numberOfRuns),
    fastestIteration: calculateAverage(testInfo.results, 'fastestIteration', testInfo.numberOfRuns),
    slowestIteration: calculateAverage(testInfo.results, 'slowestIteration', testInfo.numberOfRuns),
    meanIteration: calculateAverage(testInfo.results, 'meanIteration', testInfo.numberOfRuns),
    medianIteration: calculateAverage(testInfo.results, 'medianIteration', testInfo.numberOfRuns),
    variance: calculateAverage(testInfo.results, 'variance', testInfo.numberOfRuns)
  }

  return (
    <div style={{ display: 'inline-block' }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            th, td {
              padding: 10px;
            }
        `
        }}
      />

      <div style={{ padding: '10px' }}>个数: {testInfo.N}</div>
      <div style={{ padding: '10px' }}>次数: {testInfo.numberOfRuns}</div>

      <table>
        <thead>
          <tr>
            <th />
            <th>第一次运行</th>
            <th>最后一次运行</th>
            <th>平均值</th>
            <th>中位值</th>
            <th>最快值</th>
            <th>最慢值</th>
            <th>标准偏差</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(testInfo.numberOfRuns)].map((_val, runIndex) => {
            return (
              <tr key={runIndex}>
                <th>Test {runIndex + 1}</th>
                <ResultCells result={testInfo.results[runIndex]} />
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <th>平均</th>
            <ResultCells result={averageInfo} />
          </tr>
        </tfoot>
      </table>

      <hr />

      <ul>
        <li>最后一次运行应该与第一次运行大致相同或更快</li>
        <li>标准偏差应该只有几毫秒，否则会导致渲染截然不同</li>
      </ul>
    </div>
  )
}

function ResultCells({ result }) {
  const {
    firstIteration,
    lastIteration,
    meanIteration,
    medianIteration,
    variance,
    slowestIteration,
    fastestIteration
  } = result

  const alertLastRender = lastIteration > firstIteration * 1.1 ? { color: 'orange' } : undefined
  return (
    <>
      <td>{firstIteration.toFixed(6)}</td>
      <td style={alertLastRender}>{lastIteration.toFixed(6)}</td>
      <td>{meanIteration.toFixed(6)}</td>
      <td>{medianIteration.toFixed(6)}</td>
      <td>{fastestIteration.toFixed(6)}</td>
      <td>{slowestIteration.toFixed(6)}</td>
      <td>{Math.sqrt(variance).toFixed(6)}</td>
    </>
  )
}
