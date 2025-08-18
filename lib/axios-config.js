const axios = require('axios');

axios.defaults.withCredentials = true;

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

module.exports = axios;
