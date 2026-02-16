import { useNavigate, Navigate } from "react-router-dom";
import LoginForm from "./loginForm";
import SignupForm from "./signupForm";
import { useAuth } from "../hooks/useAuth";

// Wrapper for the Login Page Route
export const LoginRouteWrapper = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading spinner if preferred
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <LoginForm onClose={() => navigate('/')} />
    </div>
  );
};

// Wrapper for the Signup Page Route
export const SignupRouteWrapper = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <SignupForm onClose={() => navigate('/')} />
    </div>
  );
};