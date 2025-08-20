import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SlaRuntimeChart = ({ title, data, environment, type }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300
    },
    plugins: {
      legend: {
        position: 'top',
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
        mode: 'index',
        intersect: false,
        callbacks: {
          title: function(context) {
            return `Date: ${context[0].label}`;
          },
          afterTitle: function() {
            return `ENV: ${environment} | TYPE: ${type}`;
          },
          label: function(context) {
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
          callback: function(value) {
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
      mode: 'nearest',
      axis: 'x',
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
  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height: '320px' }}>
        <div className="text-center">
          <div className="text-gray-400 mb-2" style={{ fontSize: '2rem' }}>📊</div>
          <div className="text-gray-600 font-medium">{title}</div>
          <div className="text-gray-400 text-sm mt-2">No data for selected filters</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '320px' }}>
      <Line 
        data={data} 
        options={options}
        aria-label={`${title} chart showing weighted average vs actual runtime`}
      />
    </div>
  );
};
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0">
      <div className="card-body p-0" style={{ height: '320px' }}>
        <Line 
          data={data} 
          options={options}
          aria-label={`${title} chart showing weighted average vs actual runtime`}
        />
      </div>
    </div>
  );
};

export default SlaRuntimeChart;