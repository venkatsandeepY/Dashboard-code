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
        
        // Generate actual runtime (can vary more from weighted avg, 0-40 hours)
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
  
  console.log('Generated runtime data sample:', data.slice(0, 5));
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
  
  console.log('Generated application details sample:', sorted.slice(0, 5));
  return sorted;
};

// Filter runtime data based on filters
export const filterRuntimeData = (data, filters) => {
  console.log('Filtering runtime data:', { filters, dataLength: data.length });
  
  const filtered = data.filter(item => {
    // Environment filter
    if (filters.environment && filters.environment.trim() !== '' && filters.environment !== 'ALL') {
      if (item.env !== filters.environment) {
        console.log(`Environment filter: ${item.env} !== ${filters.environment}`);
        return false;
      }
    }
    
    // Type filter
    if (filters.type && filters.type.trim() !== '' && filters.type !== 'ALL') {
      if (item.type !== filters.type) {
        console.log(`Type filter: ${item.type} !== ${filters.type}`);
        return false;
      }
    }
    
    // Date range filter - convert MM-DD-YYYY to YYYY-MM-DD for comparison
    if (filters.fromDate) {
      const itemDate = convertToISODate(item.date);
      const fromDate = convertToISODate(filters.fromDate);
      if (itemDate < fromDate) {
        console.log(`From date filter: ${itemDate} < ${fromDate}`);
        return false;
      }
    }
    
    if (filters.toDate) {
      const itemDate = convertToISODate(item.date);
      const toDate = convertToISODate(filters.toDate);
      if (itemDate > toDate) {
        console.log(`To date filter: ${itemDate} > ${toDate}`);
        return false;
      }
    }
    
    return true;
  });
  
  console.log('Filtered runtime data result:', { originalLength: data.length, filteredLength: filtered.length });
  return filtered;
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
  
  // Handle date input format (YYYY-MM-DD from HTML date input)
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }
  
  console.log('Unknown date format:', dateStr);
  return dateStr;
};

// Filter application details based on filters
export const filterApplicationDetails = (data, filters) => {
  console.log('Filtering application details:', { filters, dataLength: data.length });
  
  const filtered = data.filter(item => {
    // Environment filter
    if (filters.environment && filters.environment.trim() !== '' && filters.environment !== 'ALL') {
      if (item.env !== filters.environment) {
        console.log(`App details env filter: ${item.env} !== ${filters.environment}`);
        return false;
      }
    }
    
    // Type filter
    if (filters.type && filters.type.trim() !== '' && filters.type !== 'ALL') {
      if (item.type !== filters.type) {
        console.log(`App details type filter: ${item.type} !== ${filters.type}`);
        return false;
      }
    }
    
    // Date range filter - convert MM-DD-YYYY to YYYY-MM-DD for comparison
    if (filters.fromDate) {
      const itemDate = convertToISODate(item.runDate);
      const fromDate = convertToISODate(filters.fromDate);
      if (itemDate < fromDate) {
        console.log(`App details from date filter: ${itemDate} < ${fromDate}`);
        return false;
      }
    }
    
    if (filters.toDate) {
      const itemDate = convertToISODate(item.runDate);
      const toDate = convertToISODate(filters.toDate);
      if (itemDate > toDate) {
        console.log(`App details to date filter: ${itemDate} > ${toDate}`);
        return false;
      }
    }
    
    return true;
  });
  
  console.log('Filtered application details result:', { originalLength: data.length, filteredLength: filtered.length });
  return filtered;
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
  })).sort((a, b) => {
    // Sort by date - convert MM-DD-YYYY to Date objects for proper sorting
    const dateA = new Date(convertToISODate(a.date));
    const dateB = new Date(convertToISODate(b.date));
    return dateA - dateB;
  });
};

// Prepare chart data for Chart.js
export const prepareChartData = (data, type) => {
  console.log('Preparing chart data:', { type, dataLength: data.length });
  
  // Filter by type - if type is specified and not ALL, filter by that type
  let filteredData = data;
  if (type && type !== 'ALL') {
    filteredData = data.filter(item => item.type === type);
  }
  
  console.log('Filtered data for chart:', { type, filteredLength: filteredData.length });
  
  const aggregatedData = aggregateRuntimeData(filteredData);
  
  return {
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
      console.log('getSlaDetails called with filters:', filters);
      
      const allRuntimeData = generateRuntimeData(30);
      const allApplicationData = generateApplicationDetails(700);
      
      console.log('Generated data lengths:', {
        runtime: allRuntimeData.length,
        application: allApplicationData.length
      });
      
      const filteredRuntimeData = filterRuntimeData(allRuntimeData, filters);
      const filteredApplicationData = filterApplicationDetails(allApplicationData, filters);
      
      console.log('Final filtered data lengths:', {
        runtime: filteredRuntimeData.length,
        application: filteredApplicationData.length
      });
      
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