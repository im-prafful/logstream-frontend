import React, { useState, type ChangeEvent, type FormEvent } from "react";

interface Props {
  onClose: () => void;
}

interface LoginData {
  email: string;
  password: string;
}

const LoginForm: React.FC<Props> = ({ onClose }) => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login:", loginData);
  };

  const handleGuestLogin = () => {
    console.log("Guest Login Triggered");
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm relative">

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-500 hover:text-black text-xl"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Welcome Back
      </h2>

      <form onSubmit={handleSubmit}>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="shadow border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            placeholder="********"
            className="shadow border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Login
        </button>

        {/* Guest Login */}
        <button
          type="button"
          onClick={handleGuestLogin}
          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded w-full"
        >
          Continue as Guest
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
