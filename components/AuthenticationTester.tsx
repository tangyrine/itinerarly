import React, { useEffect, useState } from 'react';
import axios from '../lib/axios-config';
import Cookies from 'js-cookie';

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

  // Function to test JSESSIONID cookie
  const testJsessionId = async () => {
    try {
      const jsessionid = Cookies.get('JSESSIONID');
      if (!jsessionid) return false;
      
      // Remove other auth mechanisms temporarily
      const authToken = Cookies.get('auth-token');
      const altAuthToken = Cookies.get('authToken');
      if (authToken) Cookies.remove('auth-token');
      if (altAuthToken) Cookies.remove('authToken');
      
      // Make request with only JSESSIONID
      const response = await axios.get('/api/v1/tokens/remaining');
      
      // Restore cookies
      if (authToken) Cookies.set('auth-token', authToken);
      if (altAuthToken) Cookies.set('authToken', altAuthToken);
      
      return response.status < 400;
    } catch (error) {
      return false;
    }
  };

  // Function to test auth-token cookie
  const testAuthToken = async () => {
    try {
      const authToken = Cookies.get('auth-token');
      if (!authToken) return false;
      
      // Remove other auth mechanisms temporarily
      const jsessionid = Cookies.get('JSESSIONID');
      const altAuthToken = Cookies.get('authToken');
      if (jsessionid) Cookies.remove('JSESSIONID');
      if (altAuthToken) Cookies.remove('authToken');
      
      // Make request with only auth-token
      const response = await axios.get('/api/v1/tokens/remaining');
      
      // Restore cookies
      if (jsessionid) Cookies.set('JSESSIONID', jsessionid);
      if (altAuthToken) Cookies.set('authToken', altAuthToken);
      
      return response.status < 400;
    } catch (error) {
      return false;
    }
  };

  // Function to test authToken cookie
  const testAltAuthToken = async () => {
    try {
      const altAuthToken = Cookies.get('authToken');
      if (!altAuthToken) return false;
      
      // Remove other auth mechanisms temporarily
      const jsessionid = Cookies.get('JSESSIONID');
      const authToken = Cookies.get('auth-token');
      if (jsessionid) Cookies.remove('JSESSIONID');
      if (authToken) Cookies.remove('auth-token');
      
      // Make request with only authToken
      const response = await axios.get('/api/v1/tokens/remaining');
      
      // Restore cookies
      if (jsessionid) Cookies.set('JSESSIONID', jsessionid);
      if (authToken) Cookies.set('auth-token', authToken);
      
      return response.status < 400;
    } catch (error) {
      return false;
    }
  };

  // Function to test X-Auth-Token header
  const testXAuthToken = async () => {
    try {
      // Store current cookies
      const jsessionid = Cookies.get('JSESSIONID');
      const authToken = Cookies.get('auth-token');
      const altAuthToken = Cookies.get('authToken');
      
      // Remove all cookies temporarily
      if (jsessionid) Cookies.remove('JSESSIONID');
      if (authToken) Cookies.remove('auth-token');
      if (altAuthToken) Cookies.remove('authToken');
      
      // Make request with X-Auth-Token header
      const response = await axios.get('/api/v1/tokens/remaining', {
        headers: {
          'X-Auth-Token': 'test-token'
        }
      });
      
      // Restore cookies
      if (jsessionid) Cookies.set('JSESSIONID', jsessionid);
      if (authToken) Cookies.set('auth-token', authToken);
      if (altAuthToken) Cookies.set('authToken', altAuthToken);
      
      return response.status < 400;
    } catch (error) {
      return false;
    }
  };

  // Function to test Authorization header
  const testAuthorization = async () => {
    try {
      // Store current cookies
      const jsessionid = Cookies.get('JSESSIONID');
      const authToken = Cookies.get('auth-token');
      const altAuthToken = Cookies.get('authToken');
      
      // Remove all cookies temporarily
      if (jsessionid) Cookies.remove('JSESSIONID');
      if (authToken) Cookies.remove('auth-token');
      if (altAuthToken) Cookies.remove('authToken');
      
      // Make request with Authorization header
      const response = await axios.get('/api/v1/tokens/remaining', {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      });
      
      // Restore cookies
      if (jsessionid) Cookies.set('JSESSIONID', jsessionid);
      if (authToken) Cookies.set('auth-token', authToken);
      if (altAuthToken) Cookies.set('authToken', altAuthToken);
      
      return response.status < 400;
    } catch (error) {
      return false;
    }
  };

  // Function to run all tests
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
    
    // Log final results
    console.log('Authentication mechanism test results:', {
      jsessionid: jsessionidResult,
      authToken: authTokenResult,
      altAuthToken: altAuthTokenResult,
      xAuthToken: xAuthTokenResult,
      authorization: authorizationResult
    });
  };

  // Run tests automatically on login
  useEffect(() => {
    const checkForLogin = () => {
      const jsessionid = Cookies.get('JSESSIONID');
      const authToken = Cookies.get('auth-token');
      const altAuthToken = Cookies.get('authToken');
      
      if (jsessionid || authToken || altAuthToken) {
        runTests();
      }
    };
    
    // Run once on mount
    checkForLogin();
    
    // Listen for cookie changes
    const interval = setInterval(checkForLogin, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'none' }}>
      {/* Hidden component - all logic happens behind the scenes */}
      {/* Can be enabled for debugging by changing display style */}
    </div>
  );
};

export default AuthenticationTester;
