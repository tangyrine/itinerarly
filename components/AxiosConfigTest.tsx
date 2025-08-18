import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AxiosConfigTest: React.FC = () => {
  const [testResults, setTestResults] = useState({
    defaultConfig: false,
    requestTest: 'pending'
  });

  useEffect(() => {
    // Test 1: Check axios defaults
    const hasDefaults = axios.defaults.withCredentials === true;
    console.log('🔧 Axios defaults.withCredentials:', axios.defaults.withCredentials);
    
    // Test 2: Make a test request
    const testRequest = async () => {
      try {
        const response = await axios.get('https://itinerarly-be.onrender.com/api/v1/tokens/remaining', {
          timeout: 5000,
          validateStatus: () => true
        });
        
        console.log('✅ Test request completed:', {
          status: response.status,
          withCredentials: response.config.withCredentials
        });
        
        setTestResults({
          defaultConfig: hasDefaults,
          requestTest: response.config.withCredentials ? 'success' : 'failed'
        });
      } catch (error) {
        console.error('❌ Test request failed:', error);
        setTestResults({
          defaultConfig: hasDefaults,
          requestTest: 'error'
        });
      }
    };

    setTestResults(prev => ({ ...prev, defaultConfig: hasDefaults }));
    testRequest();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <h3 className="font-bold text-sm mb-2">🍪 Axios Config Test</h3>
      <div className="text-xs space-y-1">
        <div>
          Default withCredentials: {' '}
          <span className={testResults.defaultConfig ? 'text-green-600' : 'text-red-600'}>
            {testResults.defaultConfig ? '✅' : '❌'}
          </span>
        </div>
        <div>
          Request withCredentials: {' '}
          <span className={
            testResults.requestTest === 'success' ? 'text-green-600' :
            testResults.requestTest === 'failed' ? 'text-red-600' :
            testResults.requestTest === 'error' ? 'text-orange-600' :
            'text-gray-600'
          }>
            {testResults.requestTest === 'success' ? '✅' :
             testResults.requestTest === 'failed' ? '❌' :
             testResults.requestTest === 'error' ? '⚠️' : '⏳'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AxiosConfigTest;
