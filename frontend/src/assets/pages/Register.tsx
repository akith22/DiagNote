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
      //   navigate("/login");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#5C82CB]">
      <div>
        {/* Role selection buttons */}
        {!selectedRole && (
          <div className="mb-6 flex gap-4 justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md text-center">
              <h2 className="mb-4 text-lg font-semibold text-gray-700">
                Select your role
              </h2>
              <div className="flex flex-col gap-3">
                {["DOCTOR", "PATIENT", "LABTECH"].map((role) => (
                  <button
                    key={role}
                    className="px-4 py-2 bg-white rounded shadow hover:bg-gray-100 border border-gray-300"
                    onClick={() => setSelectedRole(role)}
                  >
                    {role.toLocaleLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AuthForm appears after role selection */}
        {selectedRole && (
          <>
            <p className="mb-4 text-center text-white">
              Registering as:{" "}
              <span className="font-semibold">{selectedRole}</span>
            </p>

            <AuthForm
              isRegister
              onSubmit={(data) =>
                handleRegister({ ...data, role: selectedRole })
              }
            />

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-primary-2 hover:underline">
                Login
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
