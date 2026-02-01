import axios from "axios";
import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

interface Props {
  onClose: () => void;
}

interface LoginData {
  email: string;
  password: string;
  captcha: string;
  role: string;
}

const LoginForm: React.FC<Props> = ({ onClose }) => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
    captcha: "",
    role: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCaptcha = (token: string | null) => {
    //The token generated upon successful completion of the checkbox is typically valid for 2 minutes (120 seconds).
    if (token) {
      setLoginData((prev) => ({
        ...prev,
        captcha: token//after checking all boxes google generates a token and we save it in captchaData.... then we send this captchData to the backend for validation
      }))
    }
    //if timeout or error 
    else {
      setLoginData((prev) => ({
        ...prev,
        captcha: ''
      }))
    }
  }

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      console.log(loginData)
      if (!loginData.captcha) {
        alert('Complete captcha verification')
        return; // Stop the execution
      }

      const response = await axios.post('https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/login', {
        email: loginData.email,
        password: loginData.password,
        captchaData: loginData.captcha,
        role: loginData.role
      });

      console.log(response.data);

      let name = response.data.data.full_name
      let email = response.data.data.email
      let token = response.data.token

      setTimeout(() => {
        localStorage.setItem("JWT", token)//save token to local storage
        navigate('/home', { state: { name, email } })
      }, 2000);

    } catch (e: any) {

      if (e.response && e.response.status === 401) {
        alert("Invalid Email or Password or role");
      }
      else if (e.response.status === 400) {
        // This catches the CAPTCHA failure message from the backend
        alert(e.response.data.message || "Login failed due to validation issue.");
      }
      else {
        console.log("Something went wrong. Please try again.");
        console.error("Login Error:", e);
        alert('Something went wrong. Please try again.')
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData();
  }

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
        <div className="mb-4">
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

        {/* Role */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Role
          </label>
          <input
            type="text"
            name="role"
            value={loginData.role}
            onChange={handleChange}
            placeholder="QA/Dev/SRE"
            className="shadow border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <ReCAPTCHA
          sitekey="6LdeYiwsAAAAADIiqLK3DSY_tgk6ZhcBgqAp99n-"
          onChange={handleCaptcha}
        />

        {/* Login Button */}
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full cursor-pointer"
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