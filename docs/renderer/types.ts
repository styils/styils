export type PageProps = {}

export type PageContext = {
  Page: (pageProps: PageProps) => React.ReactElement
  pageProps: PageProps
  urlPathname: string
  documentProps?: {
    title?: string
    description?: string
  }
}
