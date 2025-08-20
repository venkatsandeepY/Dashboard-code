// Runtime Chart Component - Pure UI component driven by props
import React from 'react';
import { Line } from 'react-chartjs-2';
import { SeriesPoint, ChartData } from '../../types/slaTypes';

interface RuntimeChartProps {
  title: string;
  data: SeriesPoint[];
  environment: string;
  type: string;
}

export const RuntimeChart: React.FC<RuntimeChartProps> = ({
  title,
  data,
  environment,
  type
}) => {
  // Convert SeriesPoint[] to Chart.js format
  const chartData: ChartData = {
    labels: data.map(point => 
      point.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Weighted Average Runtime (SLA Target)',
        data: data.map(point => point.weightedAvgHrs),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        fill: false,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Actual Runtime (Performance)',
        data: data.map(point => point.actualAvgHrs),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
        fill: false,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderDash: [5, 5]
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 14,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          title: function(context: any) {
            return `Date: ${context[0].label}`;
          },
          afterTitle: function() {
            return `ENV: ${environment} | TYPE: ${type}`;
          },
          label: function(context: any) {
            const value = context.parsed.y.toFixed(2);
            const label = context.dataset.label;
            
            if (label.includes('Weighted')) {
              return `${label}: ${value}h (SLA Target)`;
            } else {
              return `${label}: ${value}h (Actual Performance)`;
            }
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Duration (hours)',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
          callback: function(value: any) {
            return value + 'h';
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6
      },
      line: {
        borderWidth: 2
      }
    }
  };

  // Show "No data" message if no data available
  if (!data || data.length === 0) {
    return (
      <div className="card border-0">
        <div className="card-body d-flex align-items-center justify-content-center" style={{ height: '320px' }}>
          <div className="text-center">
            <div className="text-muted mb-2" style={{ fontSize: '2rem' }}>📊</div>
            <div className="text-secondary fw-medium">{title}</div>
            <div className="text-muted small mt-2">No data for selected filters</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0">
      <div className="card-body p-0" style={{ height: '320px' }}>
        <Line 
          data={chartData} 
          options={options}
          aria-label={`${title} chart showing weighted average vs actual runtime`}
        />
      </div>
    </div>
  );
};