import React, { useState } from "react";

interface AuthFormProps {
  isRegister?: boolean;
  onSubmit: (formData: {
    name: string;
    email: string;
    password: string;
  }) => void;
}

const AuthForm = ({ isRegister = false, onSubmit }: AuthFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "email" ? value.toLowerCase() : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      {isRegister && (
        <button
          type="button"
          className="mb-4 text-primary-2 hover:underline font-medium"
          onClick={() => window.location.reload()}
        >
          ← Back to Role Selection
        </button>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isRegister ? "Create a DiagNote Account" : "Login to Diagnote"}
        </h2>

        {isRegister && (
          <>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 mb-4 border border-black rounded-lg"
              required
              onChange={handleChange}
            />
          </>
        )}

        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          name="email"
          className="w-full px-4 py-2 mb-4 border border-black rounded-lg"
          required
          onChange={handleChange}
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          title="Please enter a valid email address"
        />

        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          name="password"
          className="w-full px-4 py-2 mb-6 border border-black rounded-lg"
          required
          onChange={handleChange}
        />

        <button
          type="submit"
          className={`w-full ${
            isRegister
              ? "bg-primary-1 hover:bg-primary-1-hover"
              : "bg-primary-1 hover:bg-primary-1-hover"
          } cursor-pointer text-white font-semibold py-2 rounded-lg transition duration-300 ease-in-out`}
        >
          {isRegister ? "Register" : "Login"}
        </button>
        {isRegister && (
          <p className="text-sm text-center mt-7">
            Email isn't verified?{" "}
            <a
              href="/email-verification"
              className="text-primary-2 hover:underline"
            >
              Verify Email
            </a>
          </p>
        )}
      </form>
    </>
  );
};

export default AuthForm;
