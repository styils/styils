/**
 * process.env.JEST_EASY from jest-easy
 * don't add collectCoverageFrom when using vscode plugin
 * /

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  collectCoverageFrom: process.env.JEST_EASY
    ? (memo) => {
        return memo.concat([
          'babel-plugin/**/*.ts',
          'vite-plugin/**/*.ts',
          '!**/*.spec.{ts,tsx}',
          '!**/*.d.ts'
        ])
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
