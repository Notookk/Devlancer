import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function FloatingActionButton({ userRole, onCreateJob }) {
  const { isDark } = useTheme();

  if (userRole !== 'job-poster') return null;

  return (
    <button
      onClick={onCreateJob}
      className={`
        fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl
        bg-gradient-to-r ${isDark ? 'from-purple-500 to-blue-500' : 'from-indigo-600 to-purple-600'}
        text-white text-2xl font-bold
        transform hover:scale-110 transition-all duration-300
        animate-pulse hover:animate-none
        z-50 backdrop-blur-sm border-2 
        ${isDark ? 'border-purple-400/30' : 'border-white/20'}
      `}
      title="Create New Job"
    >
      ➕
    </button>
  );
}
