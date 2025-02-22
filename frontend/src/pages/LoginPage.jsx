import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100">
      {/* Left Side - Logo and Intro */}
      <div className="text-center md:text-left md:w-1/2 p-6">
        <h1 className="text-5xl font-bold text-blue-600">facebook</h1>
        <p className="text-lg mt-4 text-gray-700">
          Facebook helps you connect and share with the people in your life.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="input input-bordered w-full p-3 border border-gray-300 rounded-md"
            placeholder="Email or phone number"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="input input-bordered w-full p-3 border border-gray-300 rounded-md"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
            </button>
          </div>
          <button type="submit" className="btn btn-primary w-full bg-blue-600 text-white p-3 rounded-md font-bold" disabled={isLoggingIn}>
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>
        <div className="text-center mt-3">
          <Link to="/forgot-password" className="text-blue-600 text-sm">Forgotten password?</Link>
        </div>
        <hr className="my-4" />
        <div className="text-center">
          <Link to="/signup" className="btn bg-green-500 text-white p-3 rounded-md font-bold">
            Create New Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
