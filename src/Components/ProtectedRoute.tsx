import { Navigate } from "react-router-dom"
import { ReactNode } from "react"
import axios from "axios"

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("JWT")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
