import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";
import GradientBackground from "../components/GradientBackground";
import AnimatedButton from "../components/AnimatedButton";
import ThemeToggle from "../components/ThemeToggle";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log("📦 Register Data:", data);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        data
      );
      console.log(res.data);
      alert("Registration successful! Please login to continue.");
      navigate("/");
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientBackground variant="hero">
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 animate-pulse ${isDark ? 'bg-purple-500' : 'bg-indigo-500'}`}></div>
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 animate-pulse delay-1000 ${isDark ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 animate-spin ${isDark ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} style={{ animationDuration: '20s' }}></div>
        </div>

        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        {/* Main Content */}
        <div className="w-full max-w-lg relative z-10">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className={`
              w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center
              bg-gradient-to-br ${isDark ? 'from-purple-600 to-blue-600' : 'from-indigo-600 to-purple-600'}
              shadow-2xl ${isDark ? 'shadow-purple-500/25' : 'shadow-indigo-500/25'}
              animate-bounce
            `}>
              <span className="text-3xl">✨</span>
            </div>
            <h1 className={`
              text-4xl font-bold mb-2 bg-gradient-to-r 
              ${isDark ? 'from-purple-400 to-blue-400' : 'from-indigo-600 to-purple-600'}
              bg-clip-text text-transparent
            `}>
              Join DevLancer
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Start your professional journey today
            </p>
          </div>

          {/* Register Card */}
          <div className={`
            ${isDark ? 'bg-gray-800/40' : 'bg-white/40'} 
            backdrop-blur-xl rounded-3xl p-8 
            shadow-2xl ${isDark ? 'shadow-purple-500/10' : 'shadow-indigo-500/10'}
            border ${isDark ? 'border-gray-700/50' : 'border-white/50'}
            transition-all duration-300 hover:scale-[1.02]
          `}>
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
                Create Account
              </h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Join thousands of professionals
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="John"
                      {...register("firstName", { 
                        required: "First name is required",
                        minLength: {
                          value: 2,
                          message: "First name must be at least 2 characters"
                        }
                      })}
                      className={`
                        w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-300
                        ${isDark 
                          ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:bg-gray-700/70' 
                          : 'bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white/90'
                        }
                        focus:outline-none focus:ring-4 ${isDark ? 'focus:ring-purple-500/20' : 'focus:ring-indigo-500/20'}
                        backdrop-blur-sm
                      `}
                    />
                    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      👤
                    </div>
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="relative group">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Doe"
                      {...register("lastName", { 
                        required: "Last name is required",
                        minLength: {
                          value: 2,
                          message: "Last name must be at least 2 characters"
                        }
                      })}
                      className={`
                        w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-300
                        ${isDark 
                          ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:bg-gray-700/70' 
                          : 'bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white/90'
                        }
                        focus:outline-none focus:ring-4 ${isDark ? 'focus:ring-purple-500/20' : 'focus:ring-indigo-500/20'}
                        backdrop-blur-sm
                      `}
                    />
                    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      👤
                    </div>
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="john@example.com"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email"
                      }
                    })}
                    className={`
                      w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-300
                      ${isDark 
                        ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:bg-gray-700/70' 
                        : 'bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white/90'
                      }
                      focus:outline-none focus:ring-4 ${isDark ? 'focus:ring-purple-500/20' : 'focus:ring-indigo-500/20'}
                      backdrop-blur-sm
                    `}
                  />
                  <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    📧
                  </div>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative group">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    {...register("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    className={`
                      w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-300
                      ${isDark 
                        ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:bg-gray-700/70' 
                        : 'bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white/90'
                      }
                      focus:outline-none focus:ring-4 ${isDark ? 'focus:ring-purple-500/20' : 'focus:ring-indigo-500/20'}
                      backdrop-blur-sm
                    `}
                  />
                  <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    🔒
                  </div>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Role Selection */}
              <div className="relative group">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  I am a...
                </label>
                <div className="relative">
                  <select
                    {...register("role", { required: "Please select your role" })}
                    className={`
                      w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-300
                      ${isDark 
                        ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:bg-gray-700/70' 
                        : 'bg-white/70 border-gray-300 text-gray-900 focus:border-indigo-500 focus:bg-white/90'
                      }
                      focus:outline-none focus:ring-4 ${isDark ? 'focus:ring-purple-500/20' : 'focus:ring-indigo-500/20'}
                      backdrop-blur-sm appearance-none cursor-pointer
                    `}
                  >
                    <option value="">Select your role</option>
                    <option value="job-seeker">Job Seeker - Looking for opportunities</option>
                    <option value="job-poster">Job Poster - Hiring talent</option>
                  </select>
                  <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    🎯
                  </div>
                  <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'} pointer-events-none`}>
                    ▼
                  </div>
                </div>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                )}
              </div>

              {/* Register Button */}
              <AnimatedButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    🚀 Create Account
                  </>
                )}
              </AnimatedButton>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Already have an account?{" "}
                <Link 
                  to="/" 
                  className={`
                    font-semibold bg-gradient-to-r 
                    ${isDark ? 'from-purple-400 to-blue-400' : 'from-indigo-600 to-purple-600'}
                    bg-clip-text text-transparent hover:underline transition-all duration-300
                  `}
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: "🌟", text: "Premium" },
              { icon: "🔒", text: "Secure" },
              { icon: "⚡", text: "Fast" }
            ].map((feature, index) => (
              <div key={index} className={`
                ${isDark ? 'bg-gray-800/30' : 'bg-white/30'} 
                backdrop-blur-lg rounded-xl p-3 
                border ${isDark ? 'border-gray-700/50' : 'border-white/50'}
                hover:scale-105 transition-transform duration-300
              `}>
                <div className="text-2xl mb-1">{feature.icon}</div>
                <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GradientBackground>
  );
}
