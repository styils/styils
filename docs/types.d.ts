/// <reference types="vite/client" />

declare module 'documents-router' {
  export const components: Record<string, () => JSX.Element>

  export const routers: { name: string; path: string; component: React.FunctionComponent }[]
}
