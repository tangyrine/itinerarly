import React from 'react';
import IssueCreationForm from './IssueCreationForm';

const IssueCreationExample = () => {
  const handleIssueSubmit = (issueData) => {
    console.log('Issue submitted:', issueData);
    
    // Here you would typically:
    // 1. Send the data to your backend API
    // 2. Create a GitHub issue via API
    // 3. Redirect to the created issue or show success message
    
    // Example API call structure:
    /*
    fetch('/api/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(issueData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Issue created:', data);
      // Handle success (redirect, show notification, etc.)
    })
    .catch(error => {
      console.error('Error creating issue:', error);
      // Handle error
    });
    */
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create a New Issue
          </h1>
          <p className="text-gray-600">
            Help us improve Itinerarly by reporting bugs, requesting features, or suggesting enhancements.
          </p>
        </div>
        
        <IssueCreationForm onSubmit={handleIssueSubmit} />
        
        {/* Instructions */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold text-red-600">🐞 Bug Reports</h3>
                <p>Please provide screenshots or videos showing the bug, along with detailed steps to reproduce it. Include your browser and operating system information.</p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-600">💡 Feature Requests</h3>
                <p>Describe the problem you're trying to solve and provide a detailed implementation plan before creating a PR or issue.</p>
              </div>
              <div>
                <h3 className="font-semibold text-green-600">⚡ Enhancements</h3>
                <p>Explain how the current functionality can be improved and provide a clear plan for implementation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCreationExample;
