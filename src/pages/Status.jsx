import React, { useState, useEffect } from 'react';
import { RotateCcw, AlertCircle, ChevronDown, ChevronUp } from 'react-feather';
import { 
  batchStatusService, 
  getStatusColor, 
  getProgressColor, 
  formatDateTime 
} from '../services/batchStatusService';

const Status = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState('');
  const [expandedRows, setExpandedRows] = useState({});

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
    batchStatusService.startAutoRefresh(loadBatchData);
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
      setExpandedBatch: () => {}
    };
    
    await batchStatusService.loadBatchData(setters, ENVIRONMENT_ORDER, isAutoRefresh);
  };

  const handleRefresh = () => {
    loadBatchData();
  };

  const toggleRowExpansion = (envBatchKey) => {
    setExpandedRows(prev => ({
      ...prev,
      [envBatchKey]: !prev[envBatchKey]
    }));
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'badge bg-success';
      case 'INPROGRESS': return 'badge bg-warning text-dark';
      case 'NOTSTARTED': return 'badge bg-secondary';
      case 'FAILED': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

  const getProgressBarClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'progress-bar bg-success';
      case 'INPROGRESS': return 'progress-bar bg-warning';
      case 'NOTSTARTED': return 'progress-bar bg-secondary';
      case 'FAILED': return 'progress-bar bg-danger';
      default: return 'progress-bar bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading batch status data...</h5>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger" role="alert">
          <div className="d-flex align-items-center">
            <AlertCircle className="me-2" size={24} />
            <div>
              <h4 className="alert-heading">System Issue</h4>
              <p className="mb-0">Issue in the system, please try again later.</p>
            </div>
          </div>
          <button className="btn btn-outline-danger mt-3" onClick={handleRefresh}>
            <RotateCcw size={16} className="me-1" />
            Retry
          </button>
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
              <h3 className="mb-1">Batch Status</h3>
              <p className="text-muted mb-0 small">
                Real-time monitoring across all environments
              </p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <small className="text-muted">
                Last Updated: {lastRefresh || formatDateTime(currentTime).date + ' at ' + formatDateTime(currentTime).time}
              </small>
              <button 
                className="btn btn-primary btn-sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RotateCcw size={14} className={`me-1 ${refreshing ? 'spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Environment Status Overview */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Environment Status Overview</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '120px' }}>Environment</th>
                      <th style={{ width: '100px' }}>Type</th>
                      <th style={{ width: '120px' }}>Status</th>
                      <th style={{ width: '200px' }}>Progress</th>
                      <th style={{ width: '120px' }}>Last Run</th>
                      <th style={{ width: '100px' }}>ETA</th>
                      <th style={{ width: '120px' }}>Runtime</th>
                      <th style={{ width: '80px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchData.map((envData) => {
                      if (!envData.hasData) {
                        return (
                          <tr key={envData.environment}>
                            <td className="fw-bold">{envData.environment}</td>
                            <td colSpan="7" className="text-muted">No data available</td>
                          </tr>
                        );
                      }

                      return envData.batches.map((batch, index) => {
                        const envBatchKey = `${envData.environment}-${batch.batchId}`;
                        const isExpanded = expandedRows[envBatchKey];
                        const progressValue = parseInt(batch.completion) || 0;

                        return (
                          <React.Fragment key={batch.batchId}>
                            <tr>
                              <td className="fw-bold">
                                {index === 0 ? envData.environment : ''}
                              </td>
                              <td>
                                <span className="badge bg-info text-dark">{batch.batchType}</span>
                              </td>
                              <td>
                                <span className={getStatusBadgeClass(batch.status)}>
                                  {batch.status}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="progress me-2" style={{ width: '120px', height: '20px' }}>
                                    <div 
                                      className={getProgressBarClass(batch.status)}
                                      role="progressbar"
                                      style={{ width: `${progressValue}%` }}
                                      aria-valuenow={progressValue}
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                  <small className="fw-bold">{batch.completion}%</small>
                                </div>
                              </td>
                              <td>
                                <small>{batch.runDate}</small>
                              </td>
                              <td>
                                <small>{batch.eta || '-'}</small>
                              </td>
                              <td>
                                <small>
                                  {batch.days}d {batch.hours}h {batch.mins}m
                                </small>
                              </td>
                              <td>
                                {batch.phase && Object.keys(batch.phase).length > 0 && (
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => toggleRowExpansion(envBatchKey)}
                                  >
                                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                  </button>
                                )}
                              </td>
                            </tr>
                            
                            {/* Expanded Phase Details */}
                            {isExpanded && batch.phase && Object.keys(batch.phase).length > 0 && (
                              <tr>
                                <td colSpan="8" className="bg-light">
                                  <div className="p-3">
                                    <h6 className="mb-3">Phase Details - {batch.batchId}</h6>
                                    <div className="row g-2">
                                      {Object.entries(batch.phase).map(([phaseName, phaseData]) => (
                                        <div key={phaseName} className="col-md-3 col-sm-4 col-6">
                                          <div className="d-flex align-items-center p-2 border rounded bg-white">
                                            <div className="me-2">
                                              {phaseData.status === 'COMPLETED' && <span className="text-success">✅</span>}
                                              {phaseData.status === 'INPROGRESS' && <span className="text-warning">🔄</span>}
                                              {phaseData.status === 'NOTSTARTED' && <span className="text-secondary">⏳</span>}
                                              {phaseData.status === 'FAILED' && <span className="text-danger">❌</span>}
                                            </div>
                                            <div>
                                              <div className="fw-medium small">{phaseName}</div>
                                              <span className={`badge ${getStatusBadgeClass(phaseData.status)} badge-sm`}>
                                                {phaseData.status}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;