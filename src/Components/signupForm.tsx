import React, { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";

interface Props {
  onClose: () => void;
}

interface FormData {
  email: string;
  password: string;
  name: string;
  role: string;
}

const bannedWordList = [
  "admin", "administrator", "root", "system", "sys", "null", "void",
  "test", "testing", "guest", "user", "default",
  "password", "pass", "pwd", "qwerty", "letmein", "access",
  "owner", "master", "superuser",
  "fuck", "shit", "bitch", "asshole", "idiot"
];
const specialCharList = "!@#$%^&*()_+-=[]{}|;':\",.<>/?";

const SignupForm: React.FC<Props> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    role: ""
  });

  const upperCaseCheck = (s: string) => s.split("").some(char => char >= 'A' && char <= 'Z');
  const specialCharCheck = (s: string) => s.split("").some(char => specialCharList.includes(char));

  const validate = (): boolean => {
    // Name Validation
    const foundBadWord = bannedWordList.find(word =>
      formData.name.toLowerCase().includes(word)
    );
    if (foundBadWord) {
      alert("Username contains restricted words.");
      return false;
    }

    // Email Validation
    const { email } = formData;
    const atIndex = email.indexOf("@");
    const lastDotIndex = email.lastIndexOf(".");

    if (
      !email.includes("@") ||
      atIndex === 0 ||
      atIndex === email.length - 1 ||
      lastDotIndex < atIndex ||
      email.includes(" ")
    ) {
      alert("Please enter a valid email address.");
      return false;
    }

    const localPart = email.split("@")[0];
    if (localPart.endsWith(".com") || localPart.endsWith(".net") || localPart.endsWith(".org")) {
      alert("Username part of email cannot look like a domain.");
      return false;
    }

    // Password Validation
    const { password } = formData;
    const newName = formData.name.split(" ").join("").toLowerCase();
    const newEmail = formData.email.split(" ").join("").toLowerCase();

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return false;
    }
    if (!upperCaseCheck(password)) {
      alert("Password must contain at least 1 uppercase letter.");
      return false;
    }
    if (!specialCharCheck(password)) {
      alert("Password must contain at least 1 special character.");
      return false;
    }
    if (password.toLowerCase().includes(newName) || password.toLowerCase().includes(newEmail)) {
      alert("Password cannot be the same as your username or email.");
      return false;
    }

    return true;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      const response = await axios.post(
        'https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/signup',{
           email: formData.email,
          name: formData.name,
          password: formData.password,
          role:formData.role
        }
        
      );
      console.log(response.data);
      alert('User successfully registered!');
      onClose();
    } catch (e) {
      console.error('Failed to signup:', e);
      alert('Signup failed. Please try again.');
    }
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
        Create Your Account
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="shadow border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
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
            value={formData.password}
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
            value={formData.role}
            onChange={handleChange}
            placeholder="QA/Dev/SRE"
            className="shadow border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full transition-colors"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;