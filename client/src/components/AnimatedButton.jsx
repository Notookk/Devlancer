import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const { isDark } = useTheme();

  const variants = {
    primary: isDark
      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25'
      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25',
    secondary: isDark
      ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg shadow-gray-500/25'
      : 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 shadow-lg shadow-gray-500/25',
    success: isDark
      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25'
      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25',
    danger: isDark
      ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg shadow-red-500/25'
      : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/25',
    ghost: isDark
      ? 'bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white'
      : 'bg-transparent border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
    xl: 'px-10 py-5 text-xl rounded-2xl'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-semibold
        transition-all
        duration-300
        transform
        hover:scale-105
        hover:-translate-y-0.5
        active:scale-95
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:transform-none
        disabled:hover:scale-100
        disabled:hover:translate-y-0
        focus:outline-none
        focus:ring-4
        focus:ring-purple-300/50
        relative
        overflow-hidden
        group
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

export default AnimatedButton;
