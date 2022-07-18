/// <reference types="vite/client" />

declare module '*.md' {
  const md: () => JSX.Element
  export default md
}
