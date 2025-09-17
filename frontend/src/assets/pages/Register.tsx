import { useState } from "react";
import { registerUser } from "../../api/auth.ts";
import AuthForm from "./components/AuthForm.tsx";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>("");

  const handleRegister = async (formData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    try {
      await registerUser(formData);
      navigate("/login");
    } catch {
      alert("Registration failed");
    }
  };

  // Professional healthcare icons (using Heroicons for consistency)
  const RoleIcons = {
    DOCTOR: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    PATIENT: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    LABTECH: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Section (Form) with soft grey background */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-10">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">DiagNote</h1>
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              Secure healthcare collaboration platform
            </p>
          </div>

          {/* Role selection */}
          {!selectedRole && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="mb-2 text-2xl font-semibold text-gray-800 text-center">
                Create Your Account
              </h2>
              <p className="text-gray-500 text-center text-sm mb-8">
                Select your role to get started with MedConnect
              </p>
              <div className="flex flex-col gap-4">
                {[
                  {
                    role: "DOCTOR",
                    label: "Medical Doctor",
                    desc: "For physicians and medical practitioners",
                  },
                  {
                    role: "PATIENT",
                    label: "Patient",
                    desc: "For patients seeking healthcare services",
                  },
                  {
                    role: "LABTECH",
                    label: "Lab Technician",
                    desc: "For laboratory professionals and staff",
                  },
                ].map(({ role, label, desc }) => (
                  <button
                    key={role}
                    className="w-full px-6 py-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-start gap-4 shadow-sm text-left"
                    onClick={() => setSelectedRole(role)}
                  >
                    <div className="bg-blue-100 p-2 rounded-md text-blue-600">
                      {RoleIcons[role as keyof typeof RoleIcons]}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800 block">
                        {label}
                      </span>
                      <span className="text-xs text-gray-500 block mt-1">
                        {desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AuthForm */}
          {selectedRole && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => setSelectedRole("")}
                className="flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to role selection
              </button>

              <div className="flex items-center justify-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600 mr-3">
                  {RoleIcons[selectedRole as keyof typeof RoleIcons]}
                </div>
                <p className="text-gray-600">
                  Registering as:{" "}
                  <span className="font-semibold text-blue-600">
                    {selectedRole.toLowerCase()}
                  </span>
                </p>
              </div>

              <AuthForm
                isRegister
                onSubmit={(data) =>
                  handleRegister({ ...data, role: selectedRole })
                }
              />

              <p className="text-sm text-center mt-8 text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Sign in
                </a>
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-10 text-center text-xs text-gray-500">
            <p>© 2025 DiagNote. All Rights Reserved.</p>
            <p className="mt-2">
              <a href="#" className="hover:text-gray-700 mx-2">
                Terms of Service
              </a>{" "}
              •
              <a href="#" className="hover:text-gray-700 mx-2">
                Privacy Policy
              </a>{" "}
              •
              <a href="#" className="hover:text-gray-700 mx-2">
                Support
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section (Professional Healthcare Image) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="smallGrid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
          </svg>
        </div>

        <div className="max-w-md text-white text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
            <h2 className="text-3xl font-bold mb-6">
              Join Our Healthcare Network
            </h2>
            <p className="text-blue-100 mb-8 leading-relaxed">
              Connect with medical professionals and patients in a secure,
              streamlined platform designed for modern healthcare needs.
            </p>

            {/* Feature list */}
            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-200 mr-3 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-blue-100 text-sm">
                  HIPAA compliant data security
                </span>
              </div>
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-200 mr-3 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="text-blue-100 text-sm">
                  Real-time collaboration tools
                </span>
              </div>
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-200 mr-3 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="text-blue-100 text-sm">
                  Secure messaging and file sharing
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
