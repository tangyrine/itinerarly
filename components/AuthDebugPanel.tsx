"use client";

import React, { useState, useEffect } from 'react';
import { useToken } from '@/lib/TokenProvider';
import debugAuthTokens from '@/lib/debug-auth';

/**
 * AuthDebugPanel - A component that provides debugging tools for authentication
 * Only visible in development mode
 */
export default function AuthDebugPanel() {
  const { token, isAuthenticated, refreshTokenCount } = useToken();
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    cookies: '',
    jsessionid: '',
    authToken: '',
    apiStatus: 'Not checked',
  });

  const isDev = process.env.NODE_ENV === 'development';

  // Run debug function
  const runDebug = () => {
    // Run the debug function
    debugAuthTokens();
    
    // Collect basic info for display
    setDebugInfo({
      cookies: document.cookie || 'No visible cookies',
      jsessionid: document.cookie.includes('JSESSIONID') ? 'Present' : 'Not visible (likely HttpOnly)',
      authToken: document.cookie.includes('auth-token') ? 'Present' : 'Not found',
      apiStatus: isAuthenticated ? 'Authenticated' : 'Not authenticated',
    });
  };

  // Don't render anything in production
  if (!isDev) return null;

  return (
    <div 
      style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px', 
        zIndex: 9999,
      }}
    >
      <button
        onClick={() => setShowDebug(!showDebug)}
        style={{
          backgroundColor: '#333',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
        }}
      >
        {showDebug ? 'Hide Auth Debug' : 'Auth Debug'}
      </button>
      
      {showDebug && (
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '4px',
          marginTop: '5px',
          width: '300px',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Auth Debug Info</h4>
          <div>
            <p>Token Count: {token !== undefined ? token : 'Not loaded'}</p>
            <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
            <p>JSESSIONID: {debugInfo.jsessionid}</p>
            <p>AuthToken: {debugInfo.authToken}</p>
          </div>
          <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
            <button 
              onClick={runDebug}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                border: 'none',
              }}
            >
              Run Debug
            </button>
            <button 
              onClick={() => refreshTokenCount()}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                border: 'none',
              }}
            >
              Refresh Token
            </button>
          </div>
          <div style={{ marginTop: '10px', fontSize: '10px' }}>
            <p style={{ margin: '0' }}>💡 Check console for detailed debug info</p>
          </div>
        </div>
      )}
    </div>
  );
}

  return (
    <div 
      style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px', 
        zIndex: 9999,
      }}
    >
      <button
        onClick={() => setShowDebug(!showDebug)}
        style={{
          backgroundColor: '#333',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
        }}
      >
        {showDebug ? 'Hide Auth Debug' : 'Auth Debug'}
      </button>
      
      {showDebug && (
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '4px',
          marginTop: '5px',
          width: '300px',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Auth Debug Info</h4>
          <div>
            <p>Token Count: {token !== undefined ? token : 'Not loaded'}</p>
            <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
            <p>JSESSIONID: {debugInfo.jsessionid}</p>
            <p>AuthToken: {debugInfo.authToken}</p>
          </div>
          <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
            <button 
              onClick={runDebug}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                border: 'none',
              }}
            >
              Run Debug
            </button>
            <button 
              onClick={() => refreshTokenCount()}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                border: 'none',
              }}
            >
              Refresh Token
            </button>
          </div>
          <div style={{ marginTop: '10px', fontSize: '10px' }}>
            <p style={{ margin: '0' }}>💡 Check console for detailed debug info</p>
          </div>
        </div>
      )}
    </div>
  );
}
