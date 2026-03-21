import React from 'react';

export default function Loader({ show = true, message = 'Loading...', fullScreen = true, size = 60 }) {
  if (!show) return null;

  const containerStyle = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255,255,255,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        flexDirection: 'column'
      }
    : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '20px'
      };

  const spinnerStyle = {
    width: size,
    height: size,
    border: '6px solid #f3f3f3',
    borderTop: '6px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      {message && <p style={{ marginTop: '15px', fontWeight: '500' }}>{message}</p>}

      <style>
        {`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
