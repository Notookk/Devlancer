import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function ScrollToTop() {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`
            fixed bottom-8 left-8 w-12 h-12 rounded-full shadow-lg
            ${isDark 
              ? 'bg-gray-800/80 text-purple-400 border border-gray-700' 
              : 'bg-white/80 text-indigo-600 border border-gray-200'
            }
            backdrop-blur-sm transition-all duration-300
            transform hover:scale-110 z-40
            flex items-center justify-center text-xl
          `}
          title="Scroll to top"
        >
          ⬆️
        </button>
      )}
    </>
  );
}
