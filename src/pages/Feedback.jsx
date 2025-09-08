import React, { useState } from 'react';
import { Send, Star, MessageSquare, ThumbsUp, AlertCircle } from 'lucide-react';

const Feedback = () => {
  const [feedback, setFeedback] = useState({
    type: '',
    rating: 0,
    subject: '',
    message: '',
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const feedbackTypes = [
    { value: 'bug', label: 'Bug Report', icon: AlertCircle },
    { value: 'feature', label: 'Feature Request', icon: ThumbsUp },
    { value: 'general', label: 'General Feedback', icon: MessageSquare }
  ];

  const handleInputChange = (field, value) => {
    setFeedback(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setFeedback(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ThumbsUp className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully. We appreciate your input!
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFeedback({
                type: '',
                rating: 0,
                subject: '',
                message: '',
                email: ''
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Feedback</h1>
            <p className="text-sm text-gray-600">
              Help us improve by sharing your thoughts and suggestions
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Share Your Feedback</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Feedback Type */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Feedback Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {feedbackTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange('type', type.value)}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        feedback.type === type.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <type.icon className="w-5 h-5" />
                        <span className="font-medium">{type.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Overall Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= feedback.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={feedback.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of your feedback"
                  required
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={feedback.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please provide detailed feedback..."
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={feedback.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@example.com"
                />
                <p className="text-xs text-gray-500">
                  Provide your email if you'd like us to follow up on your feedback
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!feedback.type || !feedback.subject || !feedback.message}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Send className="w-4 h-4" />
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;