import React, { useState, type ChangeEvent, type FormEvent } from "react";

interface Props {
  onClose: () => void;
}

interface FormData {
  email: string;
  password: string;
  name: string;
}

const bannedWordList = ["admin", "root", "null", "void", "fuck", "shit"];
const specialCharList = "!@#$%^&*()_+-=[]{}|;':\",.<>/?";

const SignupForm: React.FC<Props> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: ""
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const upperCaseCheck = (s : string) => s.split("").some(char => char >= 'A' && char <= 'Z');
  const specialCharCheck = (s : string) =>  s.split("").some(char => (specialCharList).includes(char));

  const validate = (): Partial<FormData> => {
    const newErrors: Partial<FormData> = {};
    // Email Validation


    // Name Validation (Vulgarity & Length)


    // Password Validation
    const { password } = formData;
    const newName = formData?.name?.split(" ").join("").toLowerCase();
    const newEmail = formData?.email?.split(" ").join("").toLowerCase();

    if (!password) {
     newErrors.password = "Password is required";
    }
    if (password.length < 8) {
     newErrors.password = "Minimum 8 characters required";
    }
    if (!upperCaseCheck(password)) {
     newErrors.password = "Must contain at least 1 uppercase letter";
    }
    if (!specialCharCheck(password)) {
      newErrors.password = "Must contain at least 1 special character";
    }
    if (
      (formData.name && formData.password.toLowerCase().includes(newName))
      || (formData.email && formData.password.toLowerCase().includes(newEmail))
    ) {
      newErrors.password = "Password can not be same as your username or email";
    }
    setErrors(newErrors);
    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const check = validate();
    if (!check) {
      console.log("Submitted:", formData);
    }
    console.log("Error:", check);
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
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Password
          </label>
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            className="shadow border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
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
