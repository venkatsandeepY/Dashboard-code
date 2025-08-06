import React from 'react';
import { Activity, Server, Database, Wifi, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const Status = () => {
  const systemStatus = [
    {
      name: 'API Gateway',
      icon: Server,
      status: 'operational',
      uptime: '99.9%',
      responseTime: '45ms'
    },
    {
      name: 'Database',
      icon: Database,
      status: 'operational',
      uptime: '99.8%',
      responseTime: '12ms'
    },
    {
      name: 'CDN Network',
      icon: Wifi,
      status: 'degraded',
      uptime: '98.5%',
      responseTime: '120ms'
    },
    {
      name: 'Authentication',
      icon: CheckCircle,
      status: 'operational',
      uptime: '100%',
      responseTime: '23ms'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'var(--color-success-solid)';
      case 'degraded': return 'var(--color-warning-solid)';
      case 'down': return 'var(--color-error-solid)';
      default: return 'var(--text-tertiary)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'down': return XCircle;
      default: return Activity;
    }
  };

  return (
    <div className="status-container animate-fade-in">
      {/* Status Overview */}
      <div className="status-overview mb-xl">
        <div className="card hover-lift">
          <div className="card__header">
            <div className="flex items-center gap-md">
              <div className="status-indicator status-indicator--success">
                <div className="status-dot animate-pulse"></div>
                All Systems Operational
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-sm">System Status</h1>
            <p className="card__subtitle">Real-time monitoring of all ESQM services</p>
          </div>
        </div>
      </div>

      {/* System Components */}
      <div className="status-grid stagger-children">
        <div className="grid grid--cols-2 gap-lg mb-xl">
          {systemStatus.map((system, index) => {
            const Icon = system.icon;
            const StatusIcon = getStatusIcon(system.status);
            return (
              <div key={index} className="card hover-lift interactive">
                <div className="card__body">
                  <div className="flex items-start justify-between mb-md">
                    <div className="flex items-center gap-md">
                      <div 
                        className="dashboard-card__icon"
                        style={{ background: getStatusColor(system.status) }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-primary">{system.name}</h3>
                        <div className="flex items-center gap-sm mt-xs">
                          <StatusIcon 
                            className="w-4 h-4" 
                            style={{ color: getStatusColor(system.status) }}
                          />
                          <span 
                            className="text-sm font-medium capitalize"
                            style={{ color: getStatusColor(system.status) }}
                          >
                            {system.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid--cols-2 gap-md">
                    <div className="status-metric">
                      <div className="text-xs text-tertiary font-medium mb-xs">Uptime</div>
                      <div className="text-lg font-bold text-primary">{system.uptime}</div>
                    </div>
                    <div className="status-metric">
                      <div className="text-xs text-tertiary font-medium mb-xs">Response Time</div>
                      <div className="text-lg font-bold text-primary">{system.responseTime}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="status-incidents">
        <div className="card hover-lift">
          <div className="card__header">
            <h2 className="card__title">Recent Incidents</h2>
            <p className="card__subtitle">Past 30 days incident history</p>
          </div>
          <div className="card__body">
            <div className="flex items-center justify-center py-xl">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-success mb-md mx-auto" />
                <h3 className="text-lg font-semibold text-primary mb-sm">No Recent Incidents</h3>
                <p className="text-secondary">All systems have been running smoothly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;