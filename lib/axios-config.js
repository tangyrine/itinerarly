const axios = require('axios');

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    // Check and log cookies on each request
    const cookieHeader = config.headers['Cookie'] || '';
    
    // Check for auth headers in the request
    const authorizationHeader = config.headers['Authorization'];
    const xAuthTokenHeader = config.headers['X-Auth-Token'];
    
    console.log('Axios Request:', {
      url: config.url,
      method: config.method,
      withCredentials: config.withCredentials,
      cookies: {
        hasJSESSIONID: cookieHeader.includes('JSESSIONID'),
        hasAuthToken: cookieHeader.includes('auth-token'),
        hasAltAuthToken: cookieHeader.includes('authToken')
      },
      headers: {
        'Content-Type': config.headers['Content-Type'],
        'Authorization': authorizationHeader ? 'Present' : 'Not present',
        'X-Auth-Token': xAuthTokenHeader ? 'Present' : 'Not present'
      }
    });
    return config;
  },
  (error) => {
    console.error('Axios Request Error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    // Check response for auth-related headers and cookies
    const setCookieHeader = response.headers['set-cookie'] || [];
    const authorizationHeader = response.headers['authorization'];
    const xAuthTokenHeader = response.headers['x-auth-token'];
    
    // Check for redirect response
    const isRedirect = response.status >= 300 && response.status < 400;
    const redirectUrl = response.headers['location'];
    
    console.log('Axios Response:', {
      url: response.config.url,
      status: response.status,
      cookies: {
        hasSetCookie: setCookieHeader.length > 0,
        hasJSESSIONID: setCookieHeader.some(cookie => cookie.includes('JSESSIONID')),
        hasAuthToken: setCookieHeader.some(cookie => cookie.includes('auth-token')),
        hasAltAuthToken: setCookieHeader.some(cookie => cookie.includes('authToken'))
      },
      headers: {
        'Authorization': authorizationHeader ? 'Present' : 'Not present',
        'X-Auth-Token': xAuthTokenHeader ? 'Present' : 'Not present'
      },
      redirect: isRedirect ? { to: redirectUrl } : 'No redirect'
    });
    return response;
  },
  (error) => {
    // Also check error responses for auth headers
    const headers = error.response?.headers || {};
    
    console.error('Axios Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      headers: {
        'Authorization': headers['authorization'] ? 'Present' : 'Not present',
        'X-Auth-Token': headers['x-auth-token'] ? 'Present' : 'Not present',
        'Set-Cookie': headers['set-cookie'] ? 'Present' : 'Not present'
      }
    });
    return Promise.reject(error);
  }
);

module.exports = axios;
