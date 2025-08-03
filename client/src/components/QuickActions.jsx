import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

// QuickActions component for dashboard navigation
export default function QuickActions({ userRole, onViewProfile, onCreateJob, onViewApplications, onManageApplications, onViewNotifications }) {
  const { isDark } = useTheme();

  const actions = userRole === 'job-poster' 
    ? [
        { label: 'Post New Job', icon: '📝', action: onCreateJob, color: 'from-green-500 to-emerald-500' },
        { label: 'Manage Applications', icon: '✅', action: onManageApplications, color: 'from-orange-500 to-red-500' },
        { label: 'View Profile', icon: '👤', action: onViewProfile, color: 'from-blue-500 to-indigo-500' },
      ]
    : [
        { label: 'My Applications', icon: '📋', action: onViewApplications, color: 'from-blue-500 to-indigo-500' },
        { label: 'Notifications', icon: '🔔', action: onViewNotifications, color: 'from-purple-500 to-pink-500' },
        { label: 'Update Profile', icon: '👤', action: onViewProfile, color: 'from-green-500 to-emerald-500' },
      ];

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', marginBottom: '2rem' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem' 
      }}>
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            style={{
              backgroundColor: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
              borderRadius: '1rem',
              padding: '1rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              transform: 'scale(1)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              color: isDark ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)',
              fontSize: '1rem',
              fontWeight: '600',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            <div style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '0.75rem',
              background: `linear-gradient(135deg, ${action.color.replace('from-', '#').replace('to-', ', #').replace('-500', '').replace('-600', '')})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              transition: 'transform 0.3s ease'
            }}>
              {action.icon}
            </div>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
