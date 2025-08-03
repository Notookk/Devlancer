import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '50px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      fontSize: '24px',
      color: '#333'
    }}>
      <h1>DevLancer App is Working!</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <button 
        onClick={() => alert('Button clicked!')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test Button
      </button>
    </div>
  );
}

export default App;
