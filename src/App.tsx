import React, { useState } from "react";
import SignupForm from "./Components/signupForm";
import LoginForm from "./Components/loginForm"

const App: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isSignupOpen, setIsSignupOpen] = useState<boolean>(false);


  const handleModal1 = () => {
    setIsLoginOpen((prev) => !prev);
    setIsSignupOpen(false);
  };

  const handleModal2 = () => {
    setIsSignupOpen((prev) => !prev);
    setIsLoginOpen(false);
  };

  const handleClose = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-indigo-50 via-white to-indigo-100 text-center px-4">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
        Welcome to <span className="text-indigo-600">LogStream</span>
      </h2>

      <h3 className="text-lg text-gray-600 mb-8 max-w-md">
        Stream your logs with powerful analytics, insights, and real-time dashboards.
      </h3>

      <div className="flex gap-4">
        <button
          onClick={handleModal1}
          className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition-all duration-200"
        >
          Login
        </button>

        <button
          onClick={handleModal2}
          className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold shadow hover:bg-gray-300 transition-all duration-200"
        >
          Sign Up
        </button>
      </div>

      {/* ----- Modal Overlay ----- */}
      {(isLoginOpen || isSignupOpen) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-40" />
      )}

      {/* ----- Modals ----- */}

      {isSignupOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <SignupForm onClose={handleClose} />
        </div>
      )}
      {
        isLoginOpen && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <LoginForm onClose={handleClose}/>
          </div>
        )
      }
    </div>
  );
};

export default App;
