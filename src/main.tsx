import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import App from './App'
import { LoginRouteWrapper, SignupRouteWrapper } from './Components/routeWrapper'
import {Home} from './home'
import {UserDisp} from "./userDashboard"
import { ProtectedRoute } from './Components/ProtectedRoute'
import ExploreClusters from './ExploreClusters'

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
      <ProtectedRoute>
        <Home /> 
      </ProtectedRoute>
    )
  },
{
  path: "/userDashboard",
  element: (
    <ProtectedRoute>
      <UserDisp />
    </ProtectedRoute>
  )
},
{
  path:"/clustersExplore",
  element:(
    <ProtectedRoute>
      <ExploreClusters/>
    </ProtectedRoute>
  )
}

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
