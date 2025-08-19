"use client";

import React, { useEffect, useState } from 'react';
import axios from '../lib/axios-config';
import Cookies from 'js-cookie';
import { sanitizeCookieValue, setCookieSafely } from '@/lib/cookie-utils';

const sanitizeCookie = (value: string): string => {
  return sanitizeCookieValue(value);
};

const AuthenticationTester = () => {
  const [results, setResults] = useState({
    jsessionid: false,
    authToken: false,
    altAuthToken: false,
    xAuthToken: false,
    authorization: false,
    inProgress: false,
    complete: false
  });

  const testJsessionId = async () => {
    try {
      const jsessionid = Cookies.get('JSESSIONID');
      if (!jsessionid) return false;

      const authToken = Cookies.get('auth-token');
      const altAuthToken = Cookies.get('authToken');
      if (authToken) Cookies.remove('auth-token');
      if (altAuthToken) Cookies.remove('authToken');

      const response = await axios.get('/api/v1/tokens/remaining');
      
      if (authToken) setCookieSafely(Cookies, 'auth-token', authToken);
      if (altAuthToken) setCookieSafely(Cookies, 'authToken', altAuthToken);
      
      return response.status < 400;
    } catch (error) {
      return false;
    }
  };

  const testAuthToken = async () => {
    try {
      const authToken = Cookies.get('auth-token');
      if (!authToken) return false;
      
      const jsessionid = Cookies.get('JSESSIONID');
      const altAuthToken = Cookies.get('authToken');
      if (jsessionid) Cookies.remove('JSESSIONID');
      if (altAuthToken) Cookies.remove('authToken');
      
      const response = await axios.get('/api/v1/tokens/remaining');
      
      if (jsessionid) setCookieSafely(Cookies, 'JSESSIONID', jsessionid);
      if (altAuthToken) setCookieSafely(Cookies, 'authToken', altAuthToken);
      
      return response.status < 400;
    } catch (error) {
      return false;
    }
  };

  const testAltAuthToken = async () => {
    try {
      const altAuthToken = Cookies.get('authToken');
      if (!altAuthToken) return false;
      
      const jsessionid = Cookies.get('JSESSIONID');
      const authToken = Cookies.get('auth-token');
      if (jsessionid) Cookies.remove('JSESSIONID');
      if (authToken) Cookies.remove('auth-token');

      const response = await axios.get('/api/v1/tokens/remaining');
      
      if (jsessionid) setCookieSafely(Cookies, 'JSESSIONID', jsessionid);
      if (authToken) setCookieSafely(Cookies, 'auth-token', authToken);
      
      return response.status < 400;
    } catch (error) {
      return false;
    }
  };

  const testXAuthToken = async () => {
    try {
      const jsessionid = Cookies.get('JSESSIONID');
      const authToken = Cookies.get('auth-token');
      const altAuthToken = Cookies.get('authToken');
      
      if (jsessionid) Cookies.remove('JSESSIONID');
      if (authToken) Cookies.remove('auth-token');
      if (altAuthToken) Cookies.remove('authToken');
      const response = await axios.get('/api/v1/tokens/remaining', {
        headers: {
          'X-Auth-Token': 'test-token'
        }
      });
      
      if (jsessionid) setCookieSafely(Cookies, 'JSESSIONID', sanitizeCookieValue(jsessionid));
      if (authToken) setCookieSafely(Cookies, 'auth-token', sanitizeCookieValue(authToken));
      if (altAuthToken) setCookieSafely(Cookies, 'authToken', sanitizeCookieValue(altAuthToken));
      
      return response.status < 400;
    } catch (error) {
      return false;
    }
  };

  const testAuthorization = async () => {
    try {
      const jsessionid = Cookies.get('JSESSIONID');
      const authToken = Cookies.get('auth-token');
      const altAuthToken = Cookies.get('authToken');

      if (jsessionid) Cookies.remove('JSESSIONID');
      if (authToken) Cookies.remove('auth-token');
      if (altAuthToken) Cookies.remove('authToken');
      
      const response = await axios.get('/api/v1/tokens/remaining', {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      });
      
      if (jsessionid) setCookieSafely(Cookies, 'JSESSIONID', sanitizeCookieValue(jsessionid));
      if (authToken) setCookieSafely(Cookies, 'auth-token', sanitizeCookieValue(authToken));
      if (altAuthToken) setCookieSafely(Cookies, 'authToken', sanitizeCookieValue(altAuthToken));
      
      return response.status < 400;
    } catch (error) {
      return false;
    }
  };

  const runTests = async () => {
    if (results.inProgress) return;
    
    setResults(prev => ({ ...prev, inProgress: true, complete: false }));
    
    const jsessionidResult = await testJsessionId();
    setResults(prev => ({ ...prev, jsessionid: jsessionidResult }));
    
    const authTokenResult = await testAuthToken();
    setResults(prev => ({ ...prev, authToken: authTokenResult }));
    
    const altAuthTokenResult = await testAltAuthToken();
    setResults(prev => ({ ...prev, altAuthToken: altAuthTokenResult }));
    
    const xAuthTokenResult = await testXAuthToken();
    setResults(prev => ({ ...prev, xAuthToken: xAuthTokenResult }));
    
    const authorizationResult = await testAuthorization();
    setResults(prev => ({ 
      ...prev, 
      authorization: authorizationResult,
      inProgress: false,
      complete: true
    }));
  };

  useEffect(() => {
    const checkForLogin = () => {
      const jsessionid = Cookies.get('JSESSIONID');
      const authToken = Cookies.get('auth-token');
      const altAuthToken = Cookies.get('authToken');
      
      if (jsessionid || authToken || altAuthToken) {
        runTests();
      }
    };
    
    checkForLogin();
    
    const interval = setInterval(checkForLogin, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'none' }}>
    </div>
  );
};

export default AuthenticationTester;
