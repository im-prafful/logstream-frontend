import { useNavigate } from "react-router-dom";
import LoginForm from "./loginForm";
import SignupForm from "./signupForm";

// Wrapper for the Login Page Route
export const LoginRouteWrapper = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <LoginForm onClose={() => navigate('/')} />
    </div>
  );
};

// Wrapper for the Signup Page Route
export const SignupRouteWrapper = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <SignupForm onClose={() => navigate('/')} />
    </div>
  );
};
