import React, { useState, useEffect } from 'react';
import { ChevronDown, Clock, RotateCcw, Calendar, FileText, X, AlertCircle, Play, CheckCircle } from 'react-feather';
import { 
  batchStatusService, 
  getStatusColor, 
  getProgressColor, 
  getPhaseStatusIcon, 
  formatDateTime 
} from '../services/batchStatusService';

const Status = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState('');
  const [expandedBatch, setExpandedBatch] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [jobsData, setJobsData] = useState({});
  const [historyData, setHistoryData] = useState({});

  // Fixed environment order as specified
  const ENVIRONMENT_ORDER = ['ASYS', 'TSYS', 'MST0', 'OSYS', 'ECT0', 'QSYS', 'VST0'];

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    // Start auto-refresh
    batchStatusService.startAutoRefresh(loadBatchData);
    
    // Cleanup on unmount
    return () => {
      batchStatusService.stopAutoRefresh();
    };
  }, []);

  // Load batch data on component mount
  useEffect(() => {
    loadBatchData();
  }, []);

  const loadBatchData = async (isAutoRefresh = false) => {
    const setters = {
      setBatchData,
      setLoading,
      setRefreshing,
      setError,
      setLastRefresh,
      setExpandedBatch
    };
    
    await batchStatusService.loadBatchData(setters, ENVIRONMENT_ORDER, isAutoRefresh);
  };

  const handleRefresh = () => {
    loadBatchData();
  };

  const handleBatchToggle = (batchId) => {
    setExpandedBatch(expandedBatch === batchId ? null : batchId);
  };

  const handleEnvironmentClick = (environment) => {
    setSelectedEnvironment(selectedEnvironment === environment ? null : environment);
  };

  const ProgressBar = ({ progress, status }) => {
    const progressValue = parseInt(progress) || 0;
    return (
      <div className="progress" style={{ height: '8px' }}>
        <div 
          className={`progress-bar ${getProgressColor(status).replace('bg-', 'bg-')}`}
          role="progressbar"
          style={{ width: `${progressValue}%` }}
          aria-valuenow={progressValue}
          aria-valuemin="0"
          aria-valuemax="100"
        >
        </div>
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
    const getBootstrapStatusColor = (status) => {
      switch (status?.toUpperCase()) {
        case 'COMPLETED': return 'success';
        case 'INPROGRESS': return 'warning';
        case 'NOTSTARTED': return 'secondary';
        case 'FAILED': return 'danger';
        default: return 'secondary';
      }
    };

    return (
      <span className={`badge bg-${getBootstrapStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5>Loading batch status data...</h5>
                <p className="text-muted">Please wait while we fetch the latest information</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              <div className="d-flex align-items-center">
                <AlertCircle className="me-2" size={24} />
                <div>
                  <h4 className="alert-heading">System Issue</h4>
                  <p className="mb-0">Issue in the system, please try again later.</p>
                  <hr />
                  <p className="mb-0 small">{error}</p>
                </div>
              </div>
              <button 
                className="btn btn-outline-danger mt-3"
                onClick={handleRefresh}
              >
                <RotateCcw size={16} className="me-1" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Batch Status Dashboard</h2>
              <p className="text-muted mb-0">
                Real-time monitoring • Last updated: {lastRefresh || formatDateTime(currentTime).date + ' at ' + formatDateTime(currentTime).time}
              </p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RotateCcw size={16} className={`me-1 ${refreshing ? 'spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Environment Grid */}
      <div className="row g-4">
        {batchData.map((envData) => (
          <div key={envData.environment} className="col-lg-4 col-md-6">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">{envData.environment}</h5>
                <small className="text-muted">
                  {envData.hasData ? `${envData.batches.length} batch(es)` : 'No data'}
                </small>
              </div>
              
              <div className="card-body">
                {!envData.hasData ? (
                  <div className="text-center py-4">
                    <div className="text-muted mb-2" style={{ fontSize: '2rem' }}>📊</div>
                    <h6 className="text-muted">No Data Available</h6>
                    <small className="text-muted">No batches found for this environment</small>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {envData.batches.map((batch) => (
                      <div key={batch.batchId} className="border rounded p-3 mb-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="mb-1">{batch.batchId}</h6>
                            <small className="text-muted">Type: {batch.batchType}</small>
                          </div>
                          <StatusBadge status={batch.status} />
                        </div>
                        
                        {/* Progress */}
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <small className="text-muted">Progress</small>
                            <small className="fw-bold">{batch.completion}%</small>
                          </div>
                          <ProgressBar progress={batch.completion} status={batch.status} />
                        </div>

                        {/* Phases */}
                        {batch.phase && Object.keys(batch.phase).length > 0 && (
                          <div>
                            <button
                              className="btn btn-sm btn-outline-primary w-100"
                              onClick={() => handleBatchToggle(batch.batchId)}
                            >
                              <Clock size={14} className="me-1" />
                              View Phases ({Object.keys(batch.phase).length})
                              <ChevronDown 
                                size={14} 
                                className={`ms-1 transition-transform ${
                                  expandedBatch === batch.batchId ? 'rotate-180' : ''
                                }`} 
                              />
                            </button>
                            
                            {expandedBatch === batch.batchId && (
                              <div className="mt-3 p-3 bg-light rounded">
                                <h6 className="mb-3">Phase Details</h6>
                                <div className="row g-2">
                                  {Object.entries(batch.phase).map(([phaseName, phaseData]) => (
                                    <div key={phaseName} className="col-6">
                                      <div className="d-flex align-items-center">
                                        <span className="me-2">
                                          {getPhaseStatusIcon(phaseData.status)}
                                        </span>
                                        <div>
                                          <small className="fw-medium">{phaseName}</small>
                                          <br />
                                          <small className={`badge bg-${
                                            phaseData.status === 'COMPLETED' ? 'success' :
                                            phaseData.status === 'INPROGRESS' ? 'warning' :
                                            phaseData.status === 'FAILED' ? 'danger' : 'secondary'
                                          }`}>
                                            {phaseData.status}
                                          </small>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Status;