// test type usage

type Equal<T, U> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2 ? T : never

declare function expectType<Expected, Actual>(actual: Equal<Actual, Expected>): void
