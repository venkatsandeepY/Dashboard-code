import React from 'react';
import { FileText, Download, Calendar, BarChart3, PieChart, TrendingUp, Filter } from 'lucide-react';

const Reports = () => {
  const reportTypes = [
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Detailed system performance metrics and trends',
      lastGenerated: '2 hours ago',
      size: '2.4 MB'
    },
    {
      icon: PieChart,
      title: 'Usage Statistics',
      description: 'User activity and resource utilization reports',
      lastGenerated: '1 day ago',
      size: '1.8 MB'
    },
    {
      icon: TrendingUp,
      title: 'Growth Analysis',
      description: 'Business metrics and growth indicators',
      lastGenerated: '3 days ago',
      size: '3.2 MB'
    },
    {
      icon: FileText,
      title: 'System Logs',
      description: 'Comprehensive system activity and error logs',
      lastGenerated: '30 minutes ago',
      size: '5.7 MB'
    }
  ];

  return (
    <div className="reports-container animate-fade-in">
      {/* Reports Header */}
      <div className="reports-header mb-xl">
        <div className="card hover-lift">
          <div className="card__body">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-sm">Reports & Analytics</h1>
                <p className="text-lg text-secondary">Generate and download comprehensive system reports</p>
              </div>
              <div className="flex gap-md">
                <button className="btn btn--outline hover-scale interactive">
                  <Filter className="w-5 h-5" />
                  Filter
                </button>
                <button className="btn btn--primary hover-scale interactive">
                  <Calendar className="w-5 h-5" />
                  Schedule Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="reports-grid stagger-children">
        <div className="grid grid--cols-2 gap-lg mb-xl">
          {reportTypes.map((report, index) => {
            const Icon = report.icon;
            return (
              <div key={index} className="card hover-lift interactive">
                <div className="card__body">
                  <div className="flex items-start gap-md mb-md">
                    <div className="dashboard-card__icon" style={{ background: 'var(--color-accent)' }}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-primary mb-xs">{report.title}</h3>
                      <p className="text-sm text-secondary mb-md">{report.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-tertiary">
                        <span>Last generated: {report.lastGenerated}</span>
                        <span>Size: {report.size}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-sm">
                    <button className="btn btn--primary btn--sm hover-scale interactive flex-1">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button className="btn btn--outline btn--sm hover-scale interactive">
                      Generate New
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="reports-stats">
        <div className="card hover-lift">
          <div className="card__header">
            <h2 className="card__title">Report Statistics</h2>
            <p className="card__subtitle">Overview of report generation activity</p>
          </div>
          <div className="card__body">
            <div className="grid grid--cols-4 gap-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-xs">247</div>
                <div className="text-sm text-secondary">Reports Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-xs">15.2 GB</div>
                <div className="text-sm text-secondary">Total Data Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-xs">98.5%</div>
                <div className="text-sm text-secondary">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-xs">1.2s</div>
                <div className="text-sm text-secondary">Avg Generation Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;