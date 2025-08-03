import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function SimpleLogin() {
  const { isDark } = useTheme();
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: isDark ? '#1a1a2e' : '#f0f8ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: isDark ? '#16213e' : 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: isDark ? 'white' : '#333' 
        }}>
          DevLancer Login
        </h1>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="email" 
            placeholder="Email"
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          <input 
            type="password" 
            placeholder="Password"
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          <button 
            type="submit"
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#6366f1',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
