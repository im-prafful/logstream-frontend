import React, { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
interface Props {
  onClose: () => void;
}

interface FormData {
  email: string;
  password: string;
  name: string;
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
    name: ""
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const upperCaseCheck = (s: string) => s.split("").some(char => char >= 'A' && char <= 'Z');
  const specialCharCheck = (s: string) => s.split("").some(char => (specialCharList).includes(char));

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    let isValid = true;

    // Name Validation (Vulgarity & Length)
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else {
      const foundBadWord = bannedWordList.find(word =>
        formData.name.toLowerCase().includes(word)
      );
      if (foundBadWord) {
        newErrors.name = "Username contains restricted words.";
        isValid = false;
      }
    }

    // Email Validation
    const { email } = formData;
    const atIndex = email.indexOf("@");
    const lastDotIndex = email.lastIndexOf(".");

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (
      !email.includes("@") ||
      atIndex === 0 ||
      atIndex === email.length - 1 ||
      lastDotIndex < atIndex ||
      email.includes(" ")
    ) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    } else {
      const localPart = email.split("@")[0];
      if (localPart.endsWith(".com") || localPart.endsWith(".net") || localPart.endsWith(".org")) {
        newErrors.email = "Username part of email cannot look like a domain.";
        isValid = false;
      }
    }

    // Password Validation
    const { password } = formData;
    const newName = formData?.name?.split(" ").join("").toLowerCase();
    const newEmail = formData?.email?.split(" ").join("").toLowerCase();

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }
    if (password.length < 8) {
      newErrors.password = "Minimum 8 characters required";
      isValid = false;
    }
    if (!upperCaseCheck(password)) {
      newErrors.password = "Must contain at least 1 uppercase letter";
      isValid = false;
    }
    if (!specialCharCheck(password)) {
      newErrors.password = "Must contain at least 1 special character";
      isValid = false;
    }
    if (
      (formData.name && formData.password.toLowerCase().includes(newName))
      || (formData.email && formData.password.toLowerCase().includes(newEmail))
    ) {
      newErrors.password = "Password can not be same as your username or email";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (validate()) {
        let response = await axios.post('https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/signup', {
          email: formData.email,
          name: formData.name,
          password: formData.password

        })
        console.log(response.data)
      }
    } catch (e) {
      console.error(`failed to signup`, e)
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
            className={`shadow border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 ${errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-indigo-500"
              }`}
            required
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
            className={`shadow border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-indigo-500"
              }`}
            required
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            className={`shadow border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-indigo-500"
              }`}
            required
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
