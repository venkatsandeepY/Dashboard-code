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
  Filler,
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
  Filler,
);

const SlaRuntimeChart = ({ title, data, environment, type }) => {
  // Calculate average runtime from actual runtime data
  const calculateAverageRuntime = () => {
    if (!data || !data.datasets || data.datasets.length < 2) return 0;
    
    const actualRuntimeData = data.datasets[1].data; // Second dataset is actual runtime
    if (!actualRuntimeData || actualRuntimeData.length === 0) return 0;
    
    const sum = actualRuntimeData.reduce((acc, value) => acc + (value || 0), 0);
    return Math.round((sum / actualRuntimeData.length) * 100) / 100;
  };

  const averageRuntime = calculateAverageRuntime();

  // Create enhanced data with average reference line
  const enhancedData = data && data.datasets ? {
    ...data,
    datasets: [
      ...data.datasets,
      {
        label: `Average Runtime (${averageRuntime}h)`,
        data: new Array(data.labels?.length || 0).fill(averageRuntime),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        borderDash: [10, 5],
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        tension: 0
      }
    ]
  } : data;

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
            } else if (label.includes('Average')) {
              return `${label}: ${value}h (Reference Line)`;
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
      <div className="d-flex align-items-center justify-content-center" style={{ height: '320px' }}>
        <div className="text-center">
          <div className="text-muted mb-2" style={{ fontSize: '2rem' }}>📊</div>
          <div className="text-secondary fw-medium">{title}</div>
          <div className="text-muted small mt-2">No data for selected filters</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Text */}
      <div className="mb-3 p-3 bg-light rounded border-start border-4 border-success">
        <div className="text-sm text-muted mb-1">
          <strong>Runtime Summary</strong>
        </div>
        <div className="text-sm">
          The average runtime for <strong>{type}</strong> is <strong>{averageRuntime} hours</strong> over the selected period.
          {averageRuntime > 0 && (
            <span className="text-muted ms-2">
              (Reference line shown in green)
            </span>
          )}
        </div>
      </div>
      
      {/* Chart */}
      <div style={{ height: '320px' }}>
      <Line 
          data={enhancedData} 
        options={options}
        aria-label={`${title} chart showing weighted average vs actual runtime`}
      />
      </div>
    </div>
  );
};

export default SlaRuntimeChart;