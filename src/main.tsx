import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

// Import Components
import App from './App'
import { LoginRouteWrapper, SignupRouteWrapper } from './Components/routeWrapper'

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
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
