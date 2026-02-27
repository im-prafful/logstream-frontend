import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import App from './App'
import { LoginRouteWrapper, SignupRouteWrapper } from './Components/routeWrapper'
import { Home } from './home'
import { UserDisp } from "./userDashboard"
import { AccessControl } from './Components/AccessControl'
import ExploreClusters from './ExploreClusters'
import { AuthProvider } from './context/AuthContext'
import AccessDenied from './Components/AccessDenied'
import SrePage from './SrePage'

import QaPage from './QaPage'
import View_Incidents from './Components/View_Incidents'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginRouteWrapper />,
  },
  {
    path: "/signup",
    element: <SignupRouteWrapper />,
  },
  {
    path: "/home",
    element: (
      <AccessControl>
        <Home />
      </AccessControl>
    )
  },
  {
    path: "/userDashboard",
    element: (
      <AccessControl requiredPermission="view_logs">
        <UserDisp />
      </AccessControl>
    )
  },
  {
    path: "/clustersExplore",
    element: (
      <AccessControl requiredPermission="view_clusters">
        <ExploreClusters />
      </AccessControl>
    )
  },
  {
    path: "/access-denied",
    element: <AccessDenied />
  },
  {
    path: "/sre",
    element: (
      <AccessControl requiredRole="SRE">
        <SrePage />
      </AccessControl>
    )
  },
  {
    path: "/view_inc",
    element: (
      <AccessControl requiredPermission='manage_incidents'>
        <View_Incidents/>
      </AccessControl>
    )
  },
  {
    path: "/qa",
    element: (
      <AccessControl requiredRole="QA">
        <QaPage />
      </AccessControl>
    )
  }

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
