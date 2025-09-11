import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth.ts";
import AuthForm from "./components/AuthForm.tsx";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (formData: { email: string; password: string }) => {
    try {
      const res = await loginUser(formData);
      console.log(res);
      navigate("/dashboard");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary-2">
      <div>
        <AuthForm onSubmit={handleLogin} />
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-primary-2 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
