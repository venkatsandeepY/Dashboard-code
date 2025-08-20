// Mock SLA Data Generator for SLA Reports
// This file will be replaced with actual API calls when backend is ready

// Deterministic random number generator for consistent results
class SeededRandom {
  constructor(seed = 12345) {
    this.seed = seed;
  }
  
  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  range(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  
  float(min, max) {
    return this.next() * (max - min) + min;
  }
}

const environments = ['ASYS', 'TSYS', 'ECS'];
const types = ['BANK', 'CARD'];
const phases = ['Pre-Processing', 'Main Processing', 'Post-Processing', 'Validation', 'Cleanup'];
const statuses = ['Success', 'Warning', 'Failed', 'In Progress'];

// Generate runtime data for charts
export const generateRuntimeData = (days = 30) => {
  const data = [];
  const rng = new SeededRandom(12345);
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    environments.forEach(env => {
      types.forEach(type => {
        // Generate weighted average (0.5-3 hours with some consistency)
        const baseWeightedAvg = rng.float(0.5, 3);
        const weightedAvg = baseWeightedAvg + rng.float(-2, 2);
        
        // Generate actual runtime (can vary more from weighted avg)
        const actualRuntime = Math.max(0.1, weightedAvg + rng.float(-1, 2));
        
        data.push({
          date: dateStr,
          env,
          type,
          weightedAvg: Math.round(weightedAvg * 100) / 100,
          actualRuntime: Math.round(actualRuntime * 100) / 100
        });
      });
    });
  }
  
  return data;
};

// Generate detailed application data for table
export const generateApplicationDetails = (count = 700) => {
  const data = [];
  const rng = new SeededRandom(54321);
  
  for (let i = 0; i < count; i++) {
    // Generate run date within last 90 days
    const runDate = new Date();
    runDate.setDate(runDate.getDate() - rng.range(0, 90));
    
    const env = environments[rng.range(0, environments.length - 1)];
    const type = types[rng.range(0, types.length - 1)];
    const phase = phases[rng.range(0, phases.length - 1)];
    const status = statuses[rng.range(0, statuses.length - 1)];
    
    // Generate start time
    const startHour = rng.range(0, 23);
    const startMinute = rng.range(0, 59);
    const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`;
    
    // Generate duration (5 minutes to 4 hours)
    const durationMinutes = rng.range(5, 240);
    const endDate = new Date(runDate);
    endDate.setHours(startHour, startMinute + durationMinutes, 0);
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}:00`;
    
    // Format duration as Days:Hrs:Mins
    const days = Math.floor(durationMinutes / (24 * 60));
    const hours = Math.floor((durationMinutes % (24 * 60)) / 60);
    const mins = durationMinutes % 60;
    const duration = `${days}:${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    
    // Generate LRD (Last Run Date) - usually same as run date or 1 day before
    const lrd = new Date(runDate);
    if (rng.next() > 0.7) {
      lrd.setDate(lrd.getDate() - 1);
    }
    
    data.push({
      id: i + 1,
      runDate: runDate.toISOString().split('T')[0],
      type,
      lrd: lrd.toISOString().split('T')[0],
      env,
      phase,
      startTime,
      endTime,
      duration,
      status
    });
  }
  
  // Sort by run date descending (most recent first)
  return data.sort((a, b) => new Date(b.runDate) - new Date(a.runDate));
};

// Filter runtime data based on filters
export const filterRuntimeData = (data, filters) => {
  return data.filter(item => {
    // Environment filter
    if (filters.environment && filters.environment !== 'ALL' && item.env !== filters.environment) {
      return false;
    }
    
    // Type filter
    if (filters.type && filters.type !== 'ALL' && item.type !== filters.type) {
      return false;
    }
    
    // Date range filter
    if (filters.fromDate && item.date < filters.fromDate) {
      return false;
    }
    
    if (filters.toDate && item.date > filters.toDate) {
      return false;
    }
    
    return true;
  });
};

// Filter application details based on filters
export const filterApplicationDetails = (data, filters) => {
  return data.filter(item => {
    // Environment filter
    if (filters.environment && filters.environment !== 'ALL' && item.env !== filters.environment) {
      return false;
    }
    
    // Type filter
    if (filters.type && filters.type !== 'ALL' && item.type !== filters.type) {
      return false;
    }
    
    // Date range filter
    if (filters.fromDate && item.runDate < filters.fromDate) {
      return false;
    }
    
    if (filters.toDate && item.runDate > filters.toDate) {
      return false;
    }
    
    return true;
  });
};

// Aggregate runtime data for charts (compute averages for ALL selections)
export const aggregateRuntimeData = (data) => {
  const aggregated = {};
  
  data.forEach(item => {
    const key = item.date;
    if (!aggregated[key]) {
      aggregated[key] = {
        date: item.date,
        weightedAvgSum: 0,
        actualRuntimeSum: 0,
        count: 0
      };
    }
    
    aggregated[key].weightedAvgSum += item.weightedAvg;
    aggregated[key].actualRuntimeSum += item.actualRuntime;
    aggregated[key].count += 1;
  });
  
  return Object.values(aggregated).map(item => ({
    date: item.date,
    weightedAvg: Math.round((item.weightedAvgSum / item.count) * 100) / 100,
    actualRuntime: Math.round((item.actualRuntimeSum / item.count) * 100) / 100
  })).sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Prepare chart data for Chart.js
export const prepareChartData = (data, type) => {
  const filteredData = data.filter(item => item.type === type);
  const aggregatedData = aggregateRuntimeData(filteredData);
  
  return {
    labels: aggregatedData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Weighted Average Runtime',
        data: aggregatedData.map(item => item.weightedAvg),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        fill: false
      },
      {
        label: 'Actual Runtime',
        data: aggregatedData.map(item => item.actualRuntime),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
        fill: false
      }
    ]
  };
};

// API placeholder functions - replace these with actual API calls
export const getSlaDetails = async (filters) => {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/sla/details', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(filters)
  // });
  // return response.json();
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const allRuntimeData = generateRuntimeData(30);
      const allApplicationData = generateApplicationDetails(700);
      
      const filteredRuntimeData = filterRuntimeData(allRuntimeData, filters);
      const filteredApplicationData = filterApplicationDetails(allApplicationData, filters);
      
      resolve({
        runtimeData: filteredRuntimeData,
        applicationDetails: filteredApplicationData,
        summary: {
          totalRecords: filteredApplicationData.length,
          dateRange: {
            from: filters.fromDate || 'All',
            to: filters.toDate || 'All'
          },
          environment: filters.environment || 'ALL',
          type: filters.type || 'ALL'
        }
      });
    }, 500); // Simulate network delay
  });
};