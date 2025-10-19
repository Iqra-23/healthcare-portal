import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const API_BASE = "http://localhost:5000/api/auth"; // ✅ exact backend route

export const LoginPage = ({ onSwitchToSignup, onLoginSuccess }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState("login");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  // Step 1 — Request login (sends OTP)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isAdmin }),
      });

      const result = await response.json();

      if (response.ok && result.message?.toLowerCase().includes("otp")) {
        setStep("otp");
        setMessage({ text: result.message, type: "success" });
      } else {
        setMessage({
          text: result.error || result.message || "Login failed",
          type: "error",
        });
      }
    } catch (err) {
      setMessage({ text: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — Verify OTP and redirect
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_BASE}/verify-login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

      if (response.ok && result.token) {
        // ✅ Save user + token
        localStorage.setItem("hp:token", result.token);
        localStorage.setItem("hp:user", JSON.stringify(result.user || {}));

        // ✅ Send both token and user to App.jsx
        setMessage({ text: "Login successful!", type: "success" });
       setTimeout(() => {
  const role = result.user?.role === "admin" ? "admin" : "user";
  onLoginSuccess(result.token, role);
}, 800);

      } else {
        setMessage({
          text: result.error || result.message || "Invalid OTP",
          type: "error",
        });
      }
    } catch (err) {
      setMessage({ text: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const handleForgotPassword = async () => {
    const input = window.prompt("Enter your email to receive a reset link:");
    if (!input) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input }),
      });
      const data = await res.json();
      setMessage({
        text:
          data.message ||
          data.error ||
          "If your email exists, you’ll get a reset link shortly.",
        type: res.ok ? "success" : "error",
      });
    } catch {
      setMessage({ text: "Network error. Try again later.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-blue-100">Sign in to your healthcare portal</p>
          </div>

          <div className="p-8">
            {/* Login Type Toggle */}
            <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setIsAdmin(false)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  !isAdmin
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                User Login
              </button>
              <button
                onClick={() => setIsAdmin(true)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  isAdmin
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Admin Login
              </button>
            </div>

            {/* Step 1: Email/Password */}
            {step === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? "Sending OTP..." : "Sign In"}
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div className="text-center mb-6">
                  <Mail className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Enter OTP sent to {email}
                  </h3>
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="6-digit code"
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-blue-500"
                  maxLength={6}
                  required
                />
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("login")}
                  className="w-full text-gray-600 hover:text-gray-900 mt-2 font-medium"
                >
                  ← Back to login
                </button>
              </form>
            )}

            {/* Messages */}
            {message.text && (
              <div
                className={`mt-4 p-4 rounded-xl ${
                  message.type === "error"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Divider + Google Login */}
            <div className="mt-8 text-center space-y-3">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 rounded-xl py-3 hover:bg-gray-50 transition font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.18 3.6l6.84-6.84C35.94 2.7 30.36 0 24 0 14.62 0 6.53 5.38 2.56 13.22l7.98 6.22C12.13 13.33 17.56 9.5 24 9.5z" />
                  <path fill="#34A853" d="M46.5 24.5c0-1.5-.13-2.94-.38-4.34H24v8.21h12.65c-.55 2.96-2.21 5.48-4.71 7.17l7.3 5.66C43.63 37.01 46.5 31.3 46.5 24.5z" />
                  <path fill="#FBBC05" d="M10.54 28.56A13.48 13.48 0 0 1 9.5 24c0-1.57.28-3.07.78-4.46l-7.98-6.22A23.891 23.891 0 0 0 0 24c0 3.88.93 7.55 2.56 10.68l7.98-6.12z" />
                  <path fill="#4285F4" d="M24 48c6.36 0 11.7-2.09 15.6-5.7l-7.3-5.66c-2.03 1.36-4.63 2.16-8.3 2.16-6.44 0-11.87-3.83-14.46-9.22l-7.98 6.12C6.53 42.62 14.62 48 24 48z" />
                </svg>
                Sign in with Google
              </button>

              <div className="text-sm text-gray-600">
                Don’t have an account?{" "}
                <button
                  onClick={onSwitchToSignup}
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Create one here
                </button>
              </div>

              <button
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot your password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
