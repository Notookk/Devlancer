import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "../contexts/ThemeContext";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", data);
      
      if (response.data.token) {
        // Store token
        localStorage.setItem("token", response.data.token);
        
        // Decode token to get user info
        const decodedToken = jwtDecode(response.data.token);
        localStorage.setItem("userId", decodedToken.userId);
        localStorage.setItem("userRole", decodedToken.role);
        
        alert("Login successful!");
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: isDark 
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' 
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: 'none',
          background: isDark 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          cursor: 'pointer',
          fontSize: '22px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        }}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* Floating background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: isDark 
          ? 'rgba(102, 126, 234, 0.1)' 
          : 'rgba(255, 255, 255, 0.1)',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: isDark 
          ? 'rgba(118, 75, 162, 0.1)' 
          : 'rgba(255, 255, 255, 0.1)',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>

      <div style={{
        backgroundColor: isDark 
          ? 'rgba(22, 33, 62, 0.9)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        padding: '50px',
        borderRadius: '30px',
        boxShadow: isDark 
          ? '0 25px 50px rgba(0, 0, 0, 0.5)' 
          : '0 25px 50px rgba(0, 0, 0, 0.15)',
        maxWidth: '450px',
        width: '100%',
        color: isDark ? 'white' : '#333',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}`,
        position: 'relative',
        zIndex: 10
      }}>
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontSize: '80px',
            marginBottom: '20px',
            animation: 'bounce 2s ease-in-out infinite'
          }}>💼</div>
          <h1 style={{ 
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '15px',
            background: isDark 
              ? 'linear-gradient(135deg, #667eea, #764ba2)' 
              : 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-1px'
          }}>
            DevLancer
          </h1>
          <p style={{ 
            fontSize: '18px', 
            opacity: 0.8,
            fontWeight: '400'
          }}>
            Welcome back to the future of work
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {/* Email Input */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontWeight: '600',
              fontSize: '16px'
            }}>
              📧 Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email"
                }
              })}
              style={{
                width: '100%',
                padding: '15px 20px',
                borderRadius: '15px',
                border: `2px solid ${errors.email ? '#ef4444' : (isDark ? '#374151' : '#e5e7eb')}`,
                backgroundColor: isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(255, 255, 255, 0.9)',
                color: isDark ? 'white' : '#333',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = isDark ? '#8b5cf6' : '#6366f1';
                e.target.style.boxShadow = `0 0 0 3px ${isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(99, 102, 241, 0.1)'}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.email ? '#ef4444' : (isDark ? '#374151' : '#e5e7eb');
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.email && (
              <p style={{ 
                color: '#ef4444', 
                fontSize: '14px', 
                marginTop: '8px',
                fontWeight: '500'
              }}>
                ⚠️ {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontWeight: '600',
              fontSize: '16px'
            }}>
              🔒 Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              style={{
                width: '100%',
                padding: '15px 20px',
                borderRadius: '15px',
                border: `2px solid ${errors.password ? '#ef4444' : (isDark ? '#374151' : '#e5e7eb')}`,
                backgroundColor: isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(255, 255, 255, 0.9)',
                color: isDark ? 'white' : '#333',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = isDark ? '#8b5cf6' : '#6366f1';
                e.target.style.boxShadow = `0 0 0 3px ${isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(99, 102, 241, 0.1)'}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.password ? '#ef4444' : (isDark ? '#374151' : '#e5e7eb');
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.password && (
              <p style={{ 
                color: '#ef4444', 
                fontSize: '14px', 
                marginTop: '8px',
                fontWeight: '500'
              }}>
                ⚠️ {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button 
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '15px',
              border: 'none',
              background: isLoading 
                ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              boxShadow: isLoading 
                ? 'none' 
                : '0 10px 20px rgba(102, 126, 234, 0.3)',
              transform: 'translateY(0)',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 15px 30px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.3)';
              }
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '22px',
                  height: '22px',
                  border: '3px solid #ffffff40',
                  borderTop: '3px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Signing In...
              </>
            ) : (
              <>
                🚀 Sign In to DevLancer
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div style={{ marginTop: '35px', textAlign: 'center' }}>
          <p style={{ opacity: 0.8, fontSize: '16px' }}>
            Don't have an account?{" "}
            <Link 
              to="/register" 
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '16px'
              }}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = 'none';
              }}
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Features */}
        <div style={{ 
          marginTop: '30px', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '15px',
          textAlign: 'center'
        }}>
          {[
            { icon: "⚡", text: "Fast & Secure" },
            { icon: "🌟", text: "Premium Jobs" },
            { icon: "🔒", text: "Safe Payments" }
          ].map((feature, index) => (
            <div key={index} style={{
              backgroundColor: isDark 
                ? 'rgba(75, 85, 99, 0.3)' 
                : 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '15px 10px',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}`,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{feature.icon}</div>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: '600',
                opacity: 0.9
              }}>
                {feature.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -20px, 0);
          }
          70% {
            transform: translate3d(0, -10px, 0);
          }
          90% {
            transform: translate3d(0, -4px, 0);
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
          }
          66% {
            transform: translateY(20px) rotate(240deg);
          }
          100% {
            transform: translateY(0px) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
