import React from 'react'
import { useTranslation } from 'react-i18next'
import { RunResult, TestInfo } from './TestRunner'
import { styled } from '../../theme'

const Header = styled('section', () => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  button: {
    color: '#fff',
    backgroundColor: '#fb304f',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    padding: '10px 15px',
    marginRight: 20
  },
  'div span': {
    paddingRight: 10
  }
}))

const TestResultsRoot = styled('div', {
  width: '100%',
  'th, td': {
    padding: 10,
    textAlign: 'center'
  },
  'li ul': {
    listStyle: 'none'
  }
})

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

export const TestResults = ({
  testInfo,
  onRetest
}: {
  testInfo: TestInfo
  onRetest: () => void
}) => {
  const averageInfo: Result = {
    firstIteration: calculateAverage(testInfo.results, 'firstIteration', testInfo.numberOfRuns),
    lastIteration: calculateAverage(testInfo.results, 'lastIteration', testInfo.numberOfRuns),
    fastestIteration: calculateAverage(testInfo.results, 'fastestIteration', testInfo.numberOfRuns),
    slowestIteration: calculateAverage(testInfo.results, 'slowestIteration', testInfo.numberOfRuns),
    meanIteration: calculateAverage(testInfo.results, 'meanIteration', testInfo.numberOfRuns),
    medianIteration: calculateAverage(testInfo.results, 'medianIteration', testInfo.numberOfRuns),
    variance: calculateAverage(testInfo.results, 'variance', testInfo.numberOfRuns)
  }

  const { t } = useTranslation()

  return (
    <TestResultsRoot>
      <Header>
        <div>
          <span>
            {t('testResults.count')}: {testInfo.N}
          </span>
          <span>
            {t('testResults.frequency')}: {testInfo.numberOfRuns}
          </span>
        </div>
        <button onClick={onRetest}>{t('retest')}</button>
      </Header>

      <table style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th />
            <th>{t('testResults.th1')}</th>
            <th>{t('testResults.th2')}</th>
            <th>{t('testResults.th3')}</th>
            <th>{t('testResults.th4')}</th>
            <th>{t('testResults.th5')}</th>
            <th>{t('testResults.th6')}</th>
            <th>{t('testResults.th7')}</th>
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
            <th>{t('testResults.th8')}</th>
            <ResultCells result={averageInfo} />
          </tr>
        </tfoot>
      </table>
      <hr />
      <br />

      <ul>
        <li>- {t('testResults.desc1')}</li>
        <li>- {t('testResults.desc2')}</li>
        <li>- {t('benchmarkDesc')}</li>
      </ul>
    </TestResultsRoot>
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
