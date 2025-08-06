import React from 'react';
import { BarChart3, Users, TrendingUp, Activity, Zap, Shield } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      icon: BarChart3,
      title: 'Total Operations',
      value: '12,847',
      description: '+12% from last month',
      color: 'var(--color-primary)'
    },
    {
      icon: Users,
      title: 'Active Users',
      value: '2,341',
      description: '+5% from last week',
      color: 'var(--color-secondary)'
    },
    {
      icon: TrendingUp,
      title: 'Performance',
      value: '98.5%',
      description: 'System uptime',
      color: 'var(--color-success)'
    },
    {
      icon: Activity,
      title: 'Live Sessions',
      value: '847',
      description: 'Currently active',
      color: 'var(--color-info)'
    },
    {
      icon: Zap,
      title: 'Response Time',
      value: '1.2ms',
      description: 'Average latency',
      color: 'var(--color-warning)'
    },
    {
      icon: Shield,
      title: 'Security Score',
      value: '99.9%',
      description: 'All systems secure',
      color: 'var(--color-accent)'
    }
  ];

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Welcome Section */}
      <div className="dashboard-welcome mb-xl">
        <div className="card hover-lift">
          <div className="card__body">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-extrabold mb-sm animate-gradient">
                  Welcome to ESQM Operations
                </h1>
                <p className="text-lg text-secondary font-medium">
                  Monitor your systems with real-time insights and analytics
                </p>
              </div>
              <div className="dashboard-welcome__icon animate-float">
                <Activity className="w-16 h-16 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats stagger-children">
        <div className="grid grid--cols-3 gap-lg mb-xl">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="dashboard-card hover-lift interactive">
                <div className="dashboard-card__icon" style={{ background: stat.color }}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="dashboard-card__title">{stat.title}</h3>
                <div className="dashboard-card__value">{stat.value}</div>
                <p className="dashboard-card__description">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <div className="card hover-lift">
          <div className="card__header">
            <h2 className="card__title">Quick Actions</h2>
            <p className="card__subtitle">Frequently used operations</p>
          </div>
          <div className="card__body">
            <div className="flex gap-md flex-wrap">
              <button className="btn btn--primary hover-scale interactive">
                <BarChart3 className="w-5 h-5" />
                Generate Report
              </button>
              <button className="btn btn--secondary hover-scale interactive">
                <Users className="w-5 h-5" />
                Manage Users
              </button>
              <button className="btn btn--accent hover-scale interactive">
                <Shield className="w-5 h-5" />
                Security Check
              </button>
              <button className="btn btn--outline hover-scale interactive">
                <Activity className="w-5 h-5" />
                System Health
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;