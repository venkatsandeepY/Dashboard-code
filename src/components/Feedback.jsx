import React from 'react';
import { useState, useEffect } from 'react';
import { feedbackAPI, mockData } from '../services/api';
import { useApi, useApiSubmit } from '../hooks/useApi';
import { MessageCircle, Send, Filter, Search, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Feedback = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });
  
  // API hooks for fetching feedback data
  const { data: feedbackList, loading: feedbackLoading, error: feedbackError, refetch: refetchFeedback } = useApi(
    () => Promise.resolve(mockData.feedback), // Replace with feedbackAPI.getFeedbackList() when backend is ready
    []
  );

  // API hook for submitting feedback
  const { submit: submitFeedback, submitting: submitting, submitError: submitError, submitSuccess: submitSuccess, reset: resetSubmit } = useApiSubmit();

  // Filter feedback based on search and filters
  const filteredFeedback = feedbackList ? feedbackList.filter(feedback => {
    const matchesSearch = feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || feedback.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || feedback.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  }) : [];

  // Handle feedback submission
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      await submitFeedback(
        (data) => Promise.resolve({ id: Date.now(), ...data, status: 'open', createdAt: new Date().toISOString() }), // Replace with feedbackAPI.submitFeedback() when backend is ready
        newFeedback
      );
      setNewFeedback({ subject: '', message: '', priority: 'medium' });
      setShowSubmitForm(false);
      refetchFeedback();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (feedbackId, newStatus) => {
    try {
      // Replace with actual API call when backend is ready
      console.log(`Updating feedback ${feedbackId} status to ${newStatus}`);
      // await feedbackAPI.updateFeedbackStatus(feedbackId, newStatus);
      refetchFeedback();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Status badge helper
  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      'in-progress': { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    };
    
    const config = statusConfig[status] || statusConfig.open;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        <Icon className="w-3 h-3" />
        <span className="capitalize">{status.replace('-', ' ')}</span>
      </span>
    );
  };

  // Priority badge helper
  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { color: 'bg-gray-100 text-gray-800' },
      medium: { color: 'bg-blue-100 text-blue-800' },
      high: { color: 'bg-red-100 text-red-800' },
    };
    
    const config = priorityConfig[priority] || priorityConfig.medium;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Feedback</h2>
        <p className="text-gray-600">Submit and manage user feedback and support requests</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            
            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          {/* Submit Feedback Button */}
          <button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Submit Feedback</span>
          </button>
        </div>
      </div>

      {/* Submit Feedback Form */}
      {showSubmitForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Submit New Feedback</h3>
          
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={newFeedback.subject}
                onChange={(e) => setNewFeedback({ ...newFeedback, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of your feedback"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={newFeedback.message}
                onChange={(e) => setNewFeedback({ ...newFeedback, message: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed description of your feedback or issue"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={newFeedback.priority}
                onChange={(e) => setNewFeedback({ ...newFeedback, priority: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                Error submitting feedback: {submitError}
              </div>
            )}
            
            {submitSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                Feedback submitted successfully!
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitForm(false);
                  resetSubmit();
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feedback List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Feedback History</h3>
        </div>
        
        <div className="p-6">
          {feedbackLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse p-4 border border-gray-200 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="flex space-x-2">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-5 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : feedbackError ? (
            <div className="text-center py-8">
              <div className="text-red-600 p-4 bg-red-50 rounded-lg">
                Error loading feedback: {feedbackError}
              </div>
            </div>
          ) : filteredFeedback.length > 0 ? (
            <div className="space-y-4">
              {filteredFeedback.map((feedback) => (
                <div key={feedback.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{feedback.subject}</h4>
                      <p className="text-gray-600 text-sm mb-3">{feedback.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(feedback.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(feedback.status)}
                      {getPriorityBadge(feedback.priority)}
                    </div>
                    
                    {feedback.status !== 'resolved' && (
                      <div className="flex space-x-2">
                        {feedback.status === 'open' && (
                          <button
                            onClick={() => handleStatusUpdate(feedback.id, 'in-progress')}
                            className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors"
                          >
                            Start Progress
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusUpdate(feedback.id, 'resolved')}
                          className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No feedback found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* API Integration Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-2">🔧 Backend Integration Ready</h4>
        <p className="text-blue-800 mb-4">
          This component is ready for backend integration. Replace the mock data calls with actual API endpoints:
        </p>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• <code>feedbackAPI.getFeedbackList(filters)</code> - for fetching feedback with filters</li>
          <li>• <code>feedbackAPI.submitFeedback(data)</code> - for submitting new feedback</li>
          <li>• <code>feedbackAPI.updateFeedbackStatus(id, status)</code> - for updating feedback status</li>
        </ul>
      </div>
    </div>
  );
};

export default Feedback;