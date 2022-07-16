import { Route, Routes } from 'react-router-dom'
import { routers } from 'documents-router'

export function Router() {
  return (
    <Routes>
      {routers.map(({ path, component: RouteComp }) => {
        return <Route key={path} path={path} element={<RouteComp />} />
      })}
    </Routes>
  )
}
