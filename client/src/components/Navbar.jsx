import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import GradientBackground from "./GradientBackground";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark } = useTheme();
  const location = useLocation();
  
  const token = localStorage.getItem("token");
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (err) {
      console.error("Invalid token:", err.message);
    }
  }

  const navLinks = [
    { path: "/home", label: "Home", icon: "🏠" },
    ...(role === "job-poster" ? [
      { path: "/create-job", label: "Create Job", icon: "➕" },
      { path: "/application-management", label: "Manage Applications", icon: "✅" }
    ] : []),
    ...(role === "job-seeker" ? [
      { path: "/my-applications", label: "My Applications", icon: "📋" },
      { path: "/notifications", label: "Notifications", icon: "🔔" }
    ] : []),
    { path: "/profile", label: "Profile", icon: "👤" }
  ];

  const isActiveLink = (path) => location.pathname === path;

  return (
    <GradientBackground variant="card">
      <nav className={`
        ${isDark ? 'bg-gray-900/90' : 'bg-white/90'} 
        backdrop-blur-lg 
        border-b 
        ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}
        sticky top-0 z-50
        shadow-lg
        ${isDark ? 'shadow-purple-500/10' : 'shadow-indigo-500/10'}
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/home" className="flex items-center space-x-3 group">
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center
                bg-gradient-to-br ${isDark ? 'from-purple-600 to-blue-600' : 'from-indigo-600 to-purple-600'}
                group-hover:scale-110 transition-transform duration-300
                shadow-lg ${isDark ? 'shadow-purple-500/25' : 'shadow-indigo-500/25'}
              `}>
                <span className="text-white font-bold text-xl">💼</span>
              </div>
              <div>
                <h1 className={`
                  text-2xl font-bold bg-gradient-to-r 
                  ${isDark ? 'from-purple-400 to-blue-400' : 'from-indigo-600 to-purple-600'}
                  bg-clip-text text-transparent
                `}>
                  DevLancer
                </h1>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Premium Job Portal
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-4 py-2 rounded-xl font-medium transition-all duration-300
                    flex items-center space-x-2 group relative overflow-hidden
                    ${isActiveLink(link.path)
                      ? `${isDark 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25' 
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                        }`
                      : `${isDark 
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                        }`
                    }
                  `}
                >
                  <span className="text-sm">{link.icon}</span>
                  <span>{link.label}</span>
                  {isActiveLink(link.path) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <ThemeToggle />
              
              {/* Logout Button */}
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                className={`
                  hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl font-medium
                  transition-all duration-300 transform hover:scale-105
                  ${isDark
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/25'
                  }
                `}
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`
                  md:hidden p-2 rounded-lg transition-colors duration-300
                  ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                `}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className={`
              md:hidden absolute top-16 left-0 right-0 
              ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} 
              backdrop-blur-lg 
              border-b 
              ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}
              shadow-xl
              ${isDark ? 'shadow-purple-500/10' : 'shadow-indigo-500/10'}
            `}>
              <div className="px-4 py-3 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-xl font-medium
                      transition-all duration-300 w-full
                      ${isActiveLink(link.path)
                        ? `${isDark 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          }`
                        : `${isDark 
                            ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                          }`
                      }
                    `}
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
                
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/";
                  }}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl font-medium
                    transition-all duration-300 w-full
                    ${isDark
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                      : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                    }
                  `}
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </GradientBackground>
  );
}
