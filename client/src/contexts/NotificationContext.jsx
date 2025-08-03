import React, { createContext, useContext, useState, useCallback } from 'react';
import { useTheme } from './ThemeContext';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { isDark } = useTheme();

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove notification
    setTimeout(() => {
      removeNotification(id);
    }, newNotification.duration);

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      title: 'Success! 🎉',
      ...options,
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      title: 'Error ❌',
      duration: 7000,
      ...options,
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      title: 'Warning ⚠️',
      ...options,
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      title: 'Info ℹ️',
      ...options,
    });
  }, [addNotification]);

  const getNotificationStyles = (type) => {
    const baseStyles = `
      rounded-2xl p-4 shadow-2xl backdrop-blur-md border transform transition-all duration-500
      animate-slide-up hover:scale-105 cursor-pointer
    `;
    
    switch (type) {
      case 'success':
        return `${baseStyles} ${isDark 
          ? 'bg-green-900/80 border-green-500/50 text-green-100' 
          : 'bg-green-100/90 border-green-300 text-green-800'
        }`;
      case 'error':
        return `${baseStyles} ${isDark 
          ? 'bg-red-900/80 border-red-500/50 text-red-100' 
          : 'bg-red-100/90 border-red-300 text-red-800'
        }`;
      case 'warning':
        return `${baseStyles} ${isDark 
          ? 'bg-orange-900/80 border-orange-500/50 text-orange-100' 
          : 'bg-orange-100/90 border-orange-300 text-orange-800'
        }`;
      case 'info':
      default:
        return `${baseStyles} ${isDark 
          ? 'bg-blue-900/80 border-blue-500/50 text-blue-100' 
          : 'bg-blue-100/90 border-blue-300 text-blue-800'
        }`;
    }
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={getNotificationStyles(notification.type)}
            onClick={() => removeNotification(notification.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {notification.title && (
                  <h4 className="font-semibold text-sm mb-1">
                    {notification.title}
                  </h4>
                )}
                <p className="text-sm opacity-90">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                className="ml-3 text-lg opacity-70 hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="mt-2 w-full bg-black/20 rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-current opacity-60 animate-pulse"
                style={{
                  animation: `shrink ${notification.duration}ms linear forwards`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};
