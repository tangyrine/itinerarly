import axios from 'axios';

// Configure axios globally for cross-domain cookie handling
axios.defaults.withCredentials = true;

// Ensure withCredentials is applied to all requests
axios.defaults.withCredentials = true;

console.log('Axios configured with withCredentials:', axios.defaults.withCredentials);

// Add request interceptor for debugging (optional)
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

// Add response interceptor for debugging cookies
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
        hasJSESSIONID: Array.isArray(setCookieHeader) ? 
          setCookieHeader.some(cookie => cookie?.includes('JSESSIONID')) : 
          String(setCookieHeader).includes('JSESSIONID'),
        hasAuthToken: Array.isArray(setCookieHeader) ? 
          setCookieHeader.some(cookie => cookie?.includes('auth-token')) : 
          String(setCookieHeader).includes('auth-token'),
        hasAltAuthToken: Array.isArray(setCookieHeader) ? 
          setCookieHeader.some(cookie => cookie?.includes('authToken')) : 
          String(setCookieHeader).includes('authToken')
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
    const setCookieHeader = headers['set-cookie'] || [];
    
    console.error('Axios Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      cookies: {
        hasSetCookie: setCookieHeader.length > 0,
        hasJSESSIONID: Array.isArray(setCookieHeader) ? 
          setCookieHeader.some(cookie => cookie?.includes('JSESSIONID')) : 
          String(setCookieHeader).includes('JSESSIONID'),
        hasAuthToken: Array.isArray(setCookieHeader) ? 
          setCookieHeader.some(cookie => cookie?.includes('auth-token')) : 
          String(setCookieHeader).includes('auth-token'),
        hasAltAuthToken: Array.isArray(setCookieHeader) ? 
          setCookieHeader.some(cookie => cookie?.includes('authToken')) : 
          String(setCookieHeader).includes('authToken')
      },
      headers: {
        'Authorization': headers['authorization'] ? 'Present' : 'Not present',
        'X-Auth-Token': headers['x-auth-token'] ? 'Present' : 'Not present'
      },
      redirect: headers['location'] ? { to: headers['location'] } : 'No redirect'
    });
    return Promise.reject(error);
  }
);

export default axios;
