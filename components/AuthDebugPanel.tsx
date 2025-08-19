"use client";

import React, { useState, useEffect } from 'react';
import { useToken } from '@/lib/TokenProvider';

export default function AuthDebugPanel() {
  const { token, isAuthenticated, refreshTokenCount } = useToken();
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    cookies: '',
    jsessionid: '',
    authToken: '',
    apiStatus: 'Not checked',
    localStorageAuth: 'Not checked',
    sessionStorageAuth: 'Not checked', 
    lastAuthCheck: 'Never',
    oauthFlowStarted: 'No',
    authInProgress: 'No'
  });

  const isDev = process.env.NODE_ENV === 'development';

  const runDebug = () => {

    setDebugInfo({
      cookies: document.cookie || 'No visible cookies',
      jsessionid: document.cookie.includes('JSESSIONID') ? 'Present' : 'Not visible (likely HttpOnly)',
      authToken: document.cookie.includes('auth-token') ? 'Present' : 'Not found',
      apiStatus: isAuthenticated ? 'Authenticated' : 'Not authenticated',
      localStorageAuth: localStorage.getItem('isAuthenticated') || 'Not set',
      sessionStorageAuth: sessionStorage.getItem('isAuthenticated') || 'Not set',
      lastAuthCheck: localStorage.getItem('lastAuthCheck') || 'Never',
      oauthFlowStarted: localStorage.getItem('oauthFlowStarted') || 'No',
      authInProgress: sessionStorage.getItem('authInProgress') === 'true' ? 'Yes' : 'No'
    });
  };

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
            <p>localStorage Auth: {debugInfo.localStorageAuth}</p>
            <p>sessionStorage Auth: {debugInfo.sessionStorageAuth}</p>
            <p>OAuth Flow: {debugInfo.oauthFlowStarted}</p>
            <p>Auth In Progress: {debugInfo.authInProgress}</p>
            <p>Last Auth Check: {debugInfo.lastAuthCheck !== 'Never' ? 
                new Date(debugInfo.lastAuthCheck).toLocaleTimeString() : 'Never'}</p>
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
            <button 
              onClick={() => {
                localStorage.removeItem("isAuthenticated");
                sessionStorage.removeItem("isAuthenticated");
                localStorage.removeItem("oauthFlowStarted");
                sessionStorage.removeItem("authInProgress");
                localStorage.setItem("lastAuthError", new Date().toISOString());
                runDebug();
              }}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                border: 'none',
              }}
            >
              Clear Auth
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
