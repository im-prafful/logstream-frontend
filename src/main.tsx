import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import './index.css'
import App from './pages/App'
import { LoginRouteWrapper, SignupRouteWrapper } from './Components/routeWrapper'
import { UserDisp } from "./pages/userDashboard"
import { AccessControl } from './Components/AccessControl'
import ExploreClusters from './pages/ExploreClusters'
import { AuthProvider } from './context/AuthContext'
import AccessDenied from './Components/AccessDenied'
import View_Incidents from './Components/View_Incidents'
import EditIncidents from './pages/EditIncidents'

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
    element: <Navigate to="/userDashboard" replace />,
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
    path: "/incidents",
    element: (
      <AccessControl requiredPermission='manage_incidents'>
        <View_Incidents/>
      </AccessControl>
    )
  },
  {
    path: "/editInc",
    element: (
      <AccessControl requiredPermission='manage_incidents'>
        <EditIncidents/>
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
