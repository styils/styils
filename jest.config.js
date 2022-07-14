/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  collectCoverageFrom: process.env.JEST_EASY
    ? (memo) => {
        return memo.concat(['!**/*.spec.{ts,tsx}'])
      }
    : [],
  testMatch: [`**/?*.test.(j|t)s?(x)`],
  transform: {
    '^.+\\.(j|t)sx?$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2021'
        },
        sourceMaps: 'inline'
      }
    ]
  },
  testEnvironment: 'jest-environment-jsdom'
}
