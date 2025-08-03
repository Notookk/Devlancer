import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const GradientBackground = ({ children, variant = 'default' }) => {
  const { isDark } = useTheme();

  const gradients = {
    default: isDark 
      ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900'
      : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
    hero: isDark
      ? 'bg-gradient-to-br from-gray-900 via-blue-900/30 via-purple-900/20 to-gray-900'
      : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100',
    card: isDark
      ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm'
      : 'bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm',
    accent: isDark
      ? 'bg-gradient-to-r from-blue-600 to-purple-600'
      : 'bg-gradient-to-r from-indigo-600 to-purple-600'
  };

  return (
    <div className={`${gradients[variant]} ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {children}
    </div>
  );
};

export default GradientBackground;
