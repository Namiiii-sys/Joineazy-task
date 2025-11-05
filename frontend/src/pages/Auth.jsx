"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Toaster, toast } from "sonner";

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!formData.email || !formData.password)
      return "Email and password are required.";
    if (!isLogin && !formData.name)
      return "Name is required for registration.";
    if (!isLogin && formData.password.length < 6)
      return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return toast.error(validationError);

    setLoading(true);
    try {
      if (isLogin) {
        const res = await axios.post(
          "https://joineazy-backend.vercel.app/api/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );
        if (res.data.message === "User Registered.") {
          toast.success("Logged in successfully!");
          setIsLogin(true);
        }

        console.log(motion);
        if (res.data.role) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("role", res.data.role);
          localStorage.setItem("userId", res.data.userId);
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("name", res.data.name);
          toast.success(`Welcome back, ${res.data.name}!`);
          onLoginSuccess(res.data.role);
        } else {
          toast.error(res.data.message || "Invalid credentials.");
        }
      } else {
        const res = await axios.post(
          "https://joineazy-backend.vercel.app/api/register",
          formData
        );
        if (res.data.message === "User Registered.") {
          toast.success("User registered successfully!");
          setIsLogin(true);
        } else {
          toast.error(res.data.message || "Registration failed.");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Toaster position="top-center" richColors />

      <motion.div
        className="relative bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >

        <h2 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <p className="text-center text-gray-500 text-sm mb-8">
          {isLogin
            ? "Sign in to continue your journey"
            : "Join us and start your adventure"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-gray-700 mb-2 font-medium text-sm">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all"
              />
            </motion.div>
          )}

          <div>
            <label className="block text-gray-700 mb-2 font-medium text-sm">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium text-sm">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all"
            />
          </div>

          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-gray-700 mb-2 font-medium text-sm">
                Select Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl text-white font-semibold transition-all shadow-lg mt-6 ${
              loading
                ? "bg-gray-400"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            }`}
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-400 text-xs font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <p className="text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-600 font-semibold hover:text-purple-600 transition-colors"
            onClick={() => {
              setIsLogin(!isLogin);
            }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </motion.div>
    </div>
  );
}