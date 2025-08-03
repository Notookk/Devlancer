import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

export default function NotificationBell() {
  const { isDark } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const token = localStorage.getItem('token');
  let userRole = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role;
    } catch (err) {
      console.error("Invalid token:", err.message);
    }
  }

  useEffect(() => {
    if (token && userRole === 'job-seeker') {
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [token, userRole]);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notifications/unread-count', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUnreadCount(response.data.unreadCount);
      setIsVisible(true);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    }
  };

  // Only show for job seekers
  if (!token || userRole !== 'job-seeker' || !isVisible) {
    return null;
  }

  return (
    <Link
      to="/notifications"
      className={`
        relative p-2 rounded-xl transition-all duration-300
        ${isDark ? 'hover:bg-purple-500/20 text-purple-300' : 'hover:bg-indigo-50 text-indigo-600'}
        group
      `}
      title="Notifications"
    >
      <div className="relative">
        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
          🔔
        </span>
        {unreadCount > 0 && (
          <span className={`
            absolute -top-1 -right-1 min-w-[20px] h-5 px-1
            bg-gradient-to-r from-red-500 to-pink-500
            text-white text-xs font-bold rounded-full
            flex items-center justify-center
            animate-pulse shadow-lg
          `}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
    </Link>
  );
}
