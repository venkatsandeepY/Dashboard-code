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

const environments = ['ASYS', 'TSYS', 'MST0', 'OSYS', 'ECT0', 'QSYS', 'VST0'];
const types = ['BANK', 'CARD'];
const phases = ['Pre-Processing', 'Main Processing', 'Post-Processing', 'Validation', 'Cleanup'];
const statuses = ['Completed', 'Failed', 'Pending'];

// Format date as MM-DD-YYYY
const formatDate = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

// Generate runtime data for charts
export const generateRuntimeData = (days = 30) => {
  const data = [];
  const rng = new SeededRandom(12345);
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);
    
    environments.forEach(env => {
      types.forEach(type => {
        // Generate weighted average (5-35 hours with some consistency)
        const baseWeightedAvg = rng.float(5, 35);
        const weightedAvg = baseWeightedAvg + rng.float(-2, 2);
        
        // Generate actual runtime (can vary more from weighted avg, 0.5-40 hours)
        const actualRuntime = Math.max(0.5, Math.min(40, weightedAvg + rng.float(-5, 5)));
        
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
  
  console.log('Generated runtime data:', data.length, 'records');
  console.log('Sample runtime data:', data.slice(0, 10));
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
      runDate: formatDate(runDate),
      type,
      lrd: formatDate(lrd),
      env,
      phase,
      startTime,
      endTime,
      duration,
      status
    });
  }
  
  // Sort by run date descending (most recent first)
  const sorted = data.sort((a, b) => {
    const dateA = new Date(convertToISODate(a.runDate));
    const dateB = new Date(convertToISODate(b.runDate));
    return dateB - dateA;
  });
  
  console.log('Generated application details:', sorted.length, 'records');
  console.log('Sample application data:', sorted.slice(0, 5));
  return sorted;
};

// Helper function to convert MM-DD-YYYY to YYYY-MM-DD for comparison
const convertToISODate = (dateStr) => {
  if (!dateStr) return '';
  
  // If already in YYYY-MM-DD format, return as is
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }
  
  // If in MM-DD-YYYY format, convert to YYYY-MM-DD
  if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
    const [month, day, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  }
  
  return dateStr;
};

// FIXED: Filter runtime data based on filters
export const filterRuntimeData = (data, filters) => {
  console.log('=== FILTERING RUNTIME DATA ===');
  console.log('Input data length:', data.length);
  console.log('Filters:', filters);
  
  const filtered = data.filter(item => {
    let keep = true;
    
    // Environment filter
    if (filters.environment && filters.environment !== 'ALL' && filters.environment !== '') {
      if (item.env !== filters.environment) {
        keep = false;
        console.log(`Filtered out by env: ${item.env} !== ${filters.environment}`);
      }
    }
    
    // Type filter
    if (keep && filters.type && filters.type !== 'ALL' && filters.type !== '') {
      if (item.type !== filters.type) {
        keep = false;
        console.log(`Filtered out by type: ${item.type} !== ${filters.type}`);
      }
    }
    
    // Date range filter
    if (keep && filters.fromDate) {
      const itemDate = convertToISODate(item.date);
      const fromDate = convertToISODate(filters.fromDate);
      if (itemDate < fromDate) {
        keep = false;
        console.log(`Filtered out by from date: ${itemDate} < ${fromDate}`);
      }
    }
    
    if (keep && filters.toDate) {
      const itemDate = convertToISODate(item.date);
      const toDate = convertToISODate(filters.toDate);
      if (itemDate > toDate) {
        keep = false;
        console.log(`Filtered out by to date: ${itemDate} > ${toDate}`);
      }
    }
    
    return keep;
  });
  
  console.log('Filtered runtime data length:', filtered.length);
  console.log('Sample filtered data:', filtered.slice(0, 3));
  return filtered;
};

// FIXED: Filter application details based on filters
export const filterApplicationDetails = (data, filters) => {
  console.log('=== FILTERING APPLICATION DETAILS ===');
  console.log('Input data length:', data.length);
  console.log('Filters:', filters);
  
  const filtered = data.filter(item => {
    let keep = true;
    
    // Environment filter
    if (filters.environment && filters.environment !== 'ALL' && filters.environment !== '') {
      if (item.env !== filters.environment) {
        keep = false;
        console.log(`App filtered out by env: ${item.env} !== ${filters.environment}`);
      }
    }
    
    // Type filter
    if (keep && filters.type && filters.type !== 'ALL' && filters.type !== '') {
      if (item.type !== filters.type) {
        keep = false;
        console.log(`App filtered out by type: ${item.type} !== ${filters.type}`);
      }
    }
    
    // Date range filter using runDate
    if (keep && filters.fromDate) {
      const itemDate = convertToISODate(item.runDate);
      const fromDate = convertToISODate(filters.fromDate);
      if (itemDate < fromDate) {
        keep = false;
        console.log(`App filtered out by from date: ${itemDate} < ${fromDate}`);
      }
    }
    
    if (keep && filters.toDate) {
      const itemDate = convertToISODate(item.runDate);
      const toDate = convertToISODate(filters.toDate);
      if (itemDate > toDate) {
        keep = false;
        console.log(`App filtered out by to date: ${itemDate} > ${toDate}`);
      }
    }
    
    return keep;
  });
  
  console.log('Filtered application details length:', filtered.length);
  console.log('Sample filtered app data:', filtered.slice(0, 3));
  return filtered;
};

// Aggregate runtime data for charts (compute averages for ALL selections)
export const aggregateRuntimeData = (data) => {
  console.log('=== AGGREGATING RUNTIME DATA ===');
  console.log('Input data for aggregation:', data.length);
  
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
  
  const result = Object.values(aggregated).map(item => ({
    date: item.date,
    weightedAvg: Math.round((item.weightedAvgSum / item.count) * 100) / 100,
    actualRuntime: Math.round((item.actualRuntimeSum / item.count) * 100) / 100
  })).sort((a, b) => {
    // Sort by date - convert MM-DD-YYYY to Date objects for proper sorting
    const dateA = new Date(convertToISODate(a.date));
    const dateB = new Date(convertToISODate(b.date));
    return dateA - dateB;
  });
  
  console.log('Aggregated data length:', result.length);
  console.log('Sample aggregated data:', result.slice(0, 3));
  return result;
};

// FIXED: Prepare chart data for Chart.js
export const prepareChartData = (data, type) => {
  console.log('=== PREPARING CHART DATA ===');
  console.log('Input data length:', data.length);
  console.log('Chart type:', type);
  
  // If no data, return empty chart
  if (!data || data.length === 0) {
    console.log('No data available for chart');
    return {
      labels: [],
      datasets: [
        {
          label: 'Weighted Average Runtime',
          data: [],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1,
          fill: false
        },
        {
          label: 'Actual Runtime',
          data: [],
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.1,
          fill: false
        }
      ]
    };
  }
  
  // Filter by type if specified and not ALL
  let filteredData = data;
  if (type && type !== 'ALL') {
    filteredData = data.filter(item => item.type === type);
    console.log(`Filtered by type ${type}:`, filteredData.length);
  }
  
  const aggregatedData = aggregateRuntimeData(filteredData);
  
  const chartData = {
    labels: aggregatedData.map(item => {
      // Convert MM-DD-YYYY to display format
      const [month, day, year] = item.date.split('-');
      const date = new Date(year, month - 1, day);
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
  
  console.log('Final chart data:', chartData);
  return chartData;
};

// FIXED: API placeholder function
export const getSlaDetails = async (filters) => {
  console.log('=== GET SLA DETAILS ===');
  console.log('Called with filters:', filters);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate fresh data
      const allRuntimeData = generateRuntimeData(30);
      const allApplicationData = generateApplicationDetails(700);
      
      console.log('Generated fresh data - Runtime:', allRuntimeData.length, 'Application:', allApplicationData.length);
      
      // Apply filters
      const filteredRuntimeData = filterRuntimeData(allRuntimeData, filters);
      const filteredApplicationData = filterApplicationDetails(allApplicationData, filters);
      
      console.log('Final filtered results - Runtime:', filteredRuntimeData.length, 'Application:', filteredApplicationData.length);
      
      const result = {
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
      };
      
      console.log('Returning SLA details:', result);
      resolve(result);
    }, 500);
  });
};