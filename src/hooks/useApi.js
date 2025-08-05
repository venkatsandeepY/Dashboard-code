import { useState, useEffect } from 'react';

// Custom hook for API data fetching
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction();
        setData(result);
      } catch (err) {
        setError(err.message || 'An error occurred');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Hook for handling form submissions with API calls
export const useApiSubmit = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const submit = async (apiFunction, data) => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);
      
      const result = await apiFunction(data);
      setSubmitSuccess(true);
      return result;
    } catch (err) {
      setSubmitError(err.message || 'Submission failed');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  return { submit, submitting, submitError, submitSuccess, reset };
};