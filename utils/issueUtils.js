export const formatIssueForGitHub = (issueData) => {
  const { type, title, priority, attachments, ...fields } = issueData;
  
  let body = '';
  
  if (type === 'bug') {
    body = `## 🐞 Bug Report

**Steps to Reproduce**
${fields.steps || 'Not provided'}

**Expected Behavior**
${fields.expected || 'Not provided'}

**Actual Behavior**
${fields.actual || 'Not provided'}

**Environment**
- OS: ${fields.os || 'Not provided'}
- Browser: ${fields.browser || 'Not provided'}

**Priority**: ${priority}
`;
  } else if (type === 'feature') {
    body = `## 💡 Feature Request

**Problem/Motivation**
${fields.problem || 'Not provided'}

**Proposed Solution**
${fields.proposedSolution || 'Not provided'}

**Implementation Plan**
${fields.implementationPlan || 'Not provided'}

**Alternative Solutions Considered**
${fields.alternatives || 'Not provided'}

**Acceptance Criteria**
${fields.acceptanceCriteria || 'Not provided'}

**Priority**: ${priority}
`;
  } else if (type === 'enhancement') {
    body = `## ⚡ Enhancement

**Problem/Motivation**
${fields.problem || 'Not provided'}

**Proposed Enhancement**
${fields.proposedSolution || 'Not provided'}

**Implementation Plan**
${fields.implementationPlan || 'Not provided'}

**Alternative Solutions Considered**
${fields.alternatives || 'Not provided'}

**Acceptance Criteria**
${fields.acceptanceCriteria || 'Not provided'}

**Priority**: ${priority}
`;
  }

  if (fields.additionalContext) {
    body += `\n**Additional Context**\n${fields.additionalContext}`;
  }

  if (attachments && attachments.length > 0) {
    body += `\n\n**Attachments**: ${attachments.length} file(s) uploaded`;
  }

  return {
    title: `[${type.toUpperCase()}] ${title}`,
    body,
    labels: [type, `priority-${priority}`],
  };
};

export const validateIssueData = (issueData) => {
  const errors = [];
  
  if (!issueData.type) {
    errors.push('Please select an issue type');
  }
  
  if (!issueData.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (issueData.type === 'bug') {
    if (!issueData.steps?.trim()) {
      errors.push('Steps to reproduce are required for bug reports');
    }
    if (!issueData.expected?.trim()) {
      errors.push('Expected behavior is required for bug reports');
    }
    if (!issueData.actual?.trim()) {
      errors.push('Actual behavior is required for bug reports');
    }
    if (!issueData.attachments || issueData.attachments.length === 0) {
      errors.push('Screenshots or videos are required for bug reports');
    }
  }
  
  if (issueData.type === 'feature' || issueData.type === 'enhancement') {
    if (!issueData.problem?.trim()) {
      errors.push('Problem/motivation is required for feature requests and enhancements');
    }
    if (!issueData.proposedSolution?.trim()) {
      errors.push('Proposed solution is required for feature requests and enhancements');
    }
    if (!issueData.implementationPlan?.trim()) {
      errors.push('Implementation plan is required for feature requests and enhancements');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const createGitHubIssue = async (issueData, githubToken, repoOwner, repoName) => {
  const formattedIssue = formatIssueForGitHub(issueData);
  
  try {
    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedIssue),
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return {
      success: true,
      issueUrl: result.html_url,
      issueNumber: result.number,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const uploadAttachments = async (attachments, uploadEndpoint) => {
  const uploadPromises = attachments.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      return {
        success: true,
        filename: file.name,
        url: result.url
      };
    } catch (error) {
      return {
        success: false,
        filename: file.name,
        error: error.message
      };
    }
  });
  
  return Promise.all(uploadPromises);
};
