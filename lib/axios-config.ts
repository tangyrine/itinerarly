import axios from 'axios';

// Configure axios globally for cross-domain cookie handling
axios.defaults.withCredentials = true;

// Ensure withCredentials is applied to all requests
axios.defaults.withCredentials = true;

console.log('🔧 Axios configured with withCredentials:', axios.defaults.withCredentials);

// Add request interceptor for debugging (optional)
axios.interceptors.request.use(
  (config) => {
    console.log('🌐 Axios Request:', {
      url: config.url,
      method: config.method,
      withCredentials: config.withCredentials,
      headers: {
        'Content-Type': config.headers['Content-Type'],
        'Cookie': config.headers['Cookie'] ? 'Present' : 'Not present'
      }
    });
    return config;
  },
  (error) => {
    console.error('❌ Axios Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging cookies
axios.interceptors.response.use(
  (response) => {
    console.log('✅ Axios Response:', {
      url: response.config.url,
      status: response.status,
      setCookie: response.headers['set-cookie'] ? 'Cookies set' : 'No cookies'
    });
    return response;
  },
  (error) => {
    console.error('❌ Axios Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default axios;
