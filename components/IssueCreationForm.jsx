import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Upload, Bug, Lightbulb, Zap, X } from 'lucide-react';

const IssueCreationForm = ({ onSubmit }) => {
  const [issueType, setIssueType] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    labels: [],
    attachments: []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const issueData = {
      type: issueType,
      ...formData,
      timestamp: new Date().toISOString()
    };
    onSubmit(issueData);
  };

  const getIssueTypeIcon = (type) => {
    switch (type) {
      case 'bug': return <Bug className="h-4 w-4" />;
      case 'feature': return <Lightbulb className="h-4 w-4" />;
      case 'enhancement': return <Zap className="h-4 w-4" />;
      default: return null;
    }
  };

  const getIssueTypeColor = (type) => {
    switch (type) {
      case 'bug': return 'bg-red-100 text-red-800 border-red-200';
      case 'feature': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'enhancement': return 'bg-green-100 text-green-800 border-green-200';
      default: return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Create New Issue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Type Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">What type of issue would you like to create?</Label>
              <RadioGroup value={issueType} onValueChange={setIssueType} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="bug" id="bug" />
                  <Label htmlFor="bug" className="flex items-center gap-2 cursor-pointer">
                    <Bug className="h-4 w-4 text-red-500" />
                    <span>Bug Report</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="feature" id="feature" />
                  <Label htmlFor="feature" className="flex items-center gap-2 cursor-pointer">
                    <Lightbulb className="h-4 w-4 text-blue-500" />
                    <span>Feature Request</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="enhancement" id="enhancement" />
                  <Label htmlFor="enhancement" className="flex items-center gap-2 cursor-pointer">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span>Enhancement</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {issueType && (
              <>
                {/* Issue Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                {/* Priority Selection */}
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic Fields Based on Issue Type */}
                {issueType === 'bug' && (
                  <div className="space-y-4 p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center gap-2">
                      <Bug className="h-4 w-4 text-red-500" />
                      <Badge className={getIssueTypeColor('bug')}>Bug Report Fields</Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="steps">Steps to Reproduce *</Label>
                        <Textarea
                          id="steps"
                          placeholder="1. Go to...&#10;2. Click on...&#10;3. Scroll down to...&#10;4. See error"
                          rows={4}
                          value={formData.steps || ''}
                          onChange={(e) => handleInputChange('steps', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expected">Expected Behavior *</Label>
                        <Textarea
                          id="expected"
                          placeholder="Describe what should have happened"
                          rows={3}
                          value={formData.expected || ''}
                          onChange={(e) => handleInputChange('expected', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="actual">Actual Behavior *</Label>
                        <Textarea
                          id="actual"
                          placeholder="Describe what actually happened"
                          rows={3}
                          value={formData.actual || ''}
                          onChange={(e) => handleInputChange('actual', e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="browser">Browser</Label>
                          <Input
                            id="browser"
                            placeholder="e.g., Chrome 120, Firefox 119"
                            value={formData.browser || ''}
                            onChange={(e) => handleInputChange('browser', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="os">Operating System</Label>
                          <Input
                            id="os"
                            placeholder="e.g., macOS 14.0, Windows 11"
                            value={formData.os || ''}
                            onChange={(e) => handleInputChange('os', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Screenshots/Videos *</Label>
                        <p className="text-sm text-gray-600">
                          Please provide screenshots or videos showing the bug. This helps us understand and fix the issue faster.
                        </p>
                        <Input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={handleFileUpload}
                          className="cursor-pointer"
                        />
                        {formData.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            <p className="text-sm font-medium">Attached files:</p>
                            {formData.attachments.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                                <span className="text-sm">{file.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAttachment(index)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {(issueType === 'feature' || issueType === 'enhancement') && (
                  <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2">
                      {getIssueTypeIcon(issueType)}
                      <Badge className={getIssueTypeColor(issueType)}>
                        {issueType === 'feature' ? 'Feature Request Fields' : 'Enhancement Fields'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="problem">Problem/Motivation *</Label>
                        <Textarea
                          id="problem"
                          placeholder="What problem does this solve? Why is it needed?"
                          rows={3}
                          value={formData.problem || ''}
                          onChange={(e) => handleInputChange('problem', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="proposedSolution">Proposed Solution *</Label>
                        <Textarea
                          id="proposedSolution"
                          placeholder="Describe your proposed solution or feature in detail"
                          rows={4}
                          value={formData.proposedSolution || ''}
                          onChange={(e) => handleInputChange('proposedSolution', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="implementationPlan">Implementation Plan *</Label>
                        <Textarea
                          id="implementationPlan"
                          placeholder="Provide a detailed plan for implementation. Include:&#10;- Technical approach&#10;- Required changes&#10;- Dependencies&#10;- Timeline estimate"
                          rows={5}
                          value={formData.implementationPlan || ''}
                          onChange={(e) => handleInputChange('implementationPlan', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="alternatives">Alternative Solutions Considered</Label>
                        <Textarea
                          id="alternatives"
                          placeholder="Describe any alternative solutions you've considered and why they were rejected"
                          rows={3}
                          value={formData.alternatives || ''}
                          onChange={(e) => handleInputChange('alternatives', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="acceptanceCriteria">Acceptance Criteria</Label>
                        <Textarea
                          id="acceptanceCriteria"
                          placeholder="Define the criteria that must be met for this feature/enhancement to be considered complete"
                          rows={3}
                          value={formData.acceptanceCriteria || ''}
                          onChange={(e) => handleInputChange('acceptanceCriteria', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Supporting Materials (Optional)</Label>
                        <p className="text-sm text-gray-600">
                          Add mockups, diagrams, or other supporting materials to help illustrate your idea.
                        </p>
                        <Input
                          type="file"
                          accept="image/*,.pdf,.doc,.docx"
                          multiple
                          onChange={handleFileUpload}
                          className="cursor-pointer"
                        />
                        {formData.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            <p className="text-sm font-medium">Attached files:</p>
                            {formData.attachments.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                                <span className="text-sm">{file.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAttachment(index)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Context */}
                <div className="space-y-2">
                  <Label htmlFor="additionalContext">Additional Context</Label>
                  <Textarea
                    id="additionalContext"
                    placeholder="Add any other context or information that might be helpful"
                    rows={3}
                    value={formData.additionalContext || ''}
                    onChange={(e) => handleInputChange('additionalContext', e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" className="min-w-[120px]">
                    Create Issue
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default IssueCreationForm;
