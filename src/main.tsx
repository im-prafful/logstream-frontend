import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

// Import Components
import App from './App'
import { LoginRouteWrapper, SignupRouteWrapper } from './Components/routeWrapper'
import {Home} from './home'
import {UserDisp} from "./userDashboard"

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
    element: <Home />, 
  },
  {
    path:"/userDashboard",
    element:<UserDisp/>
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
