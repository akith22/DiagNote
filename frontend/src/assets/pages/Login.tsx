import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth.ts";
import AuthForm from "./components/AuthForm.tsx";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (formData: { email: string; password: string }) => {
    try {
      const res = await loginUser(formData);

      switch (res.role) {
        case "DOCTOR":
          navigate("/doctor/dashboard");
          break;
        case "PATIENT":
          navigate("/patient/dashboard");
          break;
        case "LABTECH":
          navigate("/labtech/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch {
      alert("Login failed");
    }
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">DiagNote</h1>
            </div>
            <p className="text-gray-600 mt-3 text-sm">Secure healthcare collaboration platform</p>
          </div>
          
          {/* Login Form Container */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-center text-sm mb-8">
              Sign in to access your healthcare dashboard
            </p>

            {/* AuthForm */}
            <AuthForm onSubmit={handleLogin} />

            <p className="text-sm text-center mt-8 text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 font-medium hover:underline">
                Register now
              </a>
            </p>
          </div>
          
          {/* Footer */}
          <div className="mt-10 text-center text-xs text-gray-500">
            <p>© 2025 DiagNote. All Rights Reserved.</p>
            <p className="mt-2">
              <a href="#" className="hover:text-gray-700 mx-2">Terms of Service</a> • 
              <a href="#" className="hover:text-gray-700 mx-2">Privacy Policy</a> •
              <a href="#" className="hover:text-gray-700 mx-2">Support</a>
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
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
          </svg>
        </div>
        
        <div className="max-w-md text-white text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
            <h2 className="text-3xl font-bold mb-6">Secure Healthcare Access</h2>
            <p className="text-blue-100 mb-8 leading-relaxed">
              Access your medical records, connect with healthcare providers, and manage your health in one secure platform.
            </p>
            
            {/* Feature list */}
            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-200 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-blue-100 text-sm">HIPAA compliant data security</span>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-200 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-blue-100 text-sm">Instant access to your health data</span>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-200 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-blue-100 text-sm">Secure messaging with providers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;