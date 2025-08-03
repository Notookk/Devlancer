import React from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function Footer() {
  const { isDark } = useTheme();
  
  return (
    <footer className={`
      ${isDark 
        ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700' 
        : 'bg-gradient-to-r from-indigo-600 to-purple-600 border-t border-indigo-500'
      } 
      text-white py-8
    `}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className={`
              text-2xl font-bold mb-2
              bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent
            `}>
              DevLancer ✨
            </h3>
            <p className={`${isDark ? 'text-purple-200' : 'text-indigo-100'}`}>
              Connecting talent with opportunity 🚀
            </p>
          </div>
          <div className="flex space-x-8">
            <a href="#" className={`
              ${isDark ? 'text-purple-200 hover:text-white' : 'text-indigo-100 hover:text-white'} 
              transition-colors duration-300 font-medium
            `}>
              About
            </a>
            <a href="#" className={`
              ${isDark ? 'text-purple-200 hover:text-white' : 'text-indigo-100 hover:text-white'} 
              transition-colors duration-300 font-medium
            `}>
              Contact
            </a>
            <a href="#" className={`
              ${isDark ? 'text-purple-200 hover:text-white' : 'text-indigo-100 hover:text-white'} 
              transition-colors duration-300 font-medium
            `}>
              Privacy
            </a>
            <a href="#" className={`
              ${isDark ? 'text-purple-200 hover:text-white' : 'text-indigo-100 hover:text-white'} 
              transition-colors duration-300 font-medium
            `}>
              Terms
            </a>
          </div>
        </div>
        <div className={`
          ${isDark ? 'border-gray-600' : 'border-indigo-400'} 
          border-t mt-6 pt-6 text-center
        `}>
          <p className={`${isDark ? 'text-purple-200' : 'text-indigo-100'} font-medium`}>
            © 2025 DevLancer. All rights reserved. Made with 💜
          </p>
        </div>
      </div>
    </footer>
  );
}
