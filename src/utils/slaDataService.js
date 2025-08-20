// SLA Data Service - Single Source of Truth for SLA Reports
// This service handles data generation, filtering, and chart preparation

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

// Constants
const ENVIRONMENTS = ['ASYS', 'TSYS', 'MST0', 'OSYS', 'ECT0', 'QSYS', 'VST0'];
const TYPES = ['BANK', 'CARD'];
const PHASES = ['Pre-Processing', 'Main Processing', 'Post-Processing', 'Validation', 'Cleanup'];
const STATUSES = ['COMPLETED', 'FAILED', 'PENDING'];

// Utility Functions
export const parseDateStrict = (dateStr) => {
  if (!dateStr) return null;
  
  // Handle YYYY-MM-DD format (from date inputs)
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return new Date(dateStr + 'T00:00:00');
  }
  
  // Handle MM-DD-YYYY format (from data)
  if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
    const [month, day, year] = dateStr.split('-');
    return new Date(year, month - 1, day);
  }
  
  return new Date(dateStr);
};

export const formatDateMDY = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}-${day}-${year}`;
};

export const toDaysHrsMins = (startTime, endTime) => {
  if (!startTime || !endTime) return '0:00:00';
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end - start;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  const days = Math.floor(diffMins / (24 * 60));
  const hours = Math.floor((diffMins % (24 * 60)) / 60);
  const mins = diffMins % 60;
  
  return `${days}:${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Data Generation
export const generateSlaData = (days = 30, recordsPerDay = 25) => {
  console.log('🔄 Generating SLA data...');
  const data = [];
  const rng = new SeededRandom(12345);
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Generate records for each environment and type combination
    ENVIRONMENTS.forEach(env => {
      TYPES.forEach(type => {
        // Generate 2-4 records per env/type/day
        const recordCount = rng.range(2, 4);
        
        for (let r = 0; r < recordCount; r++) {
          const runDate = new Date(date);
          const lrd = new Date(date);
          if (rng.next() > 0.7) {
            lrd.setDate(lrd.getDate() - 1);
          }
          
          // Generate start time
          const startHour = rng.range(0, 23);
          const startMinute = rng.range(0, 59);
          const startTime = new Date(runDate);
          startTime.setHours(startHour, startMinute, 0);
          
          // Generate duration (30 minutes to 8 hours)
          const durationMins = rng.range(30, 480);
          const durationHrs = durationMins / 60;
          
          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + durationMins);
          
          const phase = PHASES[rng.range(0, PHASES.length - 1)];
          const status = STATUSES[rng.range(0, STATUSES.length - 1)];
          
          data.push({
            id: `${env}-${type}-${formatDateMDY(runDate)}-${r}`,
            runDate: runDate,
            type: type,
            lrd: lrd,
            env: env,
            phase: phase,
            startTime: startTime,
            endTime: endTime,
            durationHrs: Math.round(durationHrs * 100) / 100,
            status: status
          });
        }
      });
    });
  }
  
  console.log(`✅ Generated ${data.length} SLA records`);
  console.log('📊 Sample data:', data.slice(0, 3));
  console.log('🏢 Environments:', [...new Set(data.map(d => d.env))]);
  console.log('🏷️ Types:', [...new Set(data.map(d => d.type))]);
  
  return data;
};

// Core Filtering Function - Single Source of Truth
export const filterData = (data, filters) => {
  console.log('🔍 Filtering data with:', filters);
  console.log('📥 Input data length:', data.length);
  
  if (!data || data.length === 0) {
    console.log('❌ No data to filter');
    return [];
  }
  
  // Normalize filters
  const env = filters.environment?.toUpperCase() || 'ALL';
  const type = filters.type?.toUpperCase() || 'ALL';
  const dateFrom = filters.fromDate ? parseDateStrict(filters.fromDate) : null;
  const dateTo = filters.toDate ? parseDateStrict(filters.toDate) : null;
  
  console.log('🔧 Normalized filters:', { env, type, dateFrom, dateTo });
  
  const filtered = data.filter(row => {
    // Environment filter
    const envMatch = env === 'ALL' || row.env.toUpperCase() === env;
    
    // Type filter  
    const typeMatch = type === 'ALL' || row.type.toUpperCase() === type;
    
    // Date range filter
    let dateMatch = true;
    if (dateFrom || dateTo) {
      const rowDate = new Date(row.runDate);
      if (dateFrom && rowDate < dateFrom) dateMatch = false;
      if (dateTo && rowDate > dateTo) dateMatch = false;
    }
    
    const keep = envMatch && typeMatch && dateMatch;
    
    if (!keep) {
      console.log(`❌ Filtered out: ${row.env}-${row.type}-${formatDateMDY(row.runDate)} (env:${envMatch}, type:${typeMatch}, date:${dateMatch})`);
    }
    
    return keep;
  });
  
  console.log('📤 Filtered data length:', filtered.length);
  console.log('📊 Sample filtered:', filtered.slice(0, 2));
  
  return filtered;
};

// Chart Data Preparation
export const buildSeries = (filteredData) => {
  console.log('📈 Building chart series from', filteredData.length, 'records');
  
  if (!filteredData || filteredData.length === 0) {
    return {
      labels: [],
      weightedAvg: [],
      actualAvg: []
    };
  }
  
  // Group by date
  const dailyData = {};
  
  filteredData.forEach(row => {
    const dateKey = formatDateMDY(row.runDate);
    
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = {
        date: new Date(row.runDate),
        durations: [],
        weights: []
      };
    }
    
    dailyData[dateKey].durations.push(row.durationHrs);
    dailyData[dateKey].weights.push(1); // Equal weight for now
  });
  
  // Sort by date and calculate averages
  const sortedDates = Object.keys(dailyData).sort((a, b) => {
    return dailyData[a].date - dailyData[b].date;
  });
  
  const labels = [];
  const weightedAvg = [];
  const actualAvg = [];
  
  sortedDates.forEach(dateKey => {
    const dayData = dailyData[dateKey];
    
    // Format label
    const date = dayData.date;
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    
    // Calculate weighted average (same as actual for now)
    const totalDuration = dayData.durations.reduce((sum, d) => sum + d, 0);
    const totalWeight = dayData.weights.reduce((sum, w) => sum + w, 0);
    const avgDuration = totalDuration / totalWeight;
    
    weightedAvg.push(Math.round(avgDuration * 100) / 100);
    actualAvg.push(Math.round(avgDuration * 100) / 100);
  });
  
  console.log('📈 Chart series built:', { labels: labels.length, weightedAvg: weightedAvg.length, actualAvg: actualAvg.length });
  
  return { labels, weightedAvg, actualAvg };
};

// Chart.js Data Preparation
export const prepareChartData = (filteredData, chartType = 'ALL') => {
  console.log('🎨 Preparing chart data for type:', chartType);
  
  // Filter by chart type if specified
  let chartData = filteredData;
  if (chartType !== 'ALL') {
    chartData = filteredData.filter(row => row.type.toUpperCase() === chartType.toUpperCase());
  }
  
  const series = buildSeries(chartData);
  
  return {
    labels: series.labels,
    datasets: [
      {
        label: 'Weighted Average Runtime',
        data: series.weightedAvg,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        fill: false
      },
      {
        label: 'Actual Runtime',
        data: series.actualAvg,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
        fill: false
      }
    ]
  };
};

// CSV Export
export const csvFromRows = (rows) => {
  console.log('📄 Exporting', rows.length, 'rows to CSV');
  
  const headers = ['Run Date', 'Type', 'LRD', 'ENV', 'Phase', 'Start Time', 'End Time', 'Days:Hrs:Mins', 'Status'];
  
  const csvRows = rows.map(row => [
    formatDateMDY(row.runDate),
    row.type,
    formatDateMDY(row.lrd),
    row.env,
    row.phase,
    row.startTime.toLocaleTimeString('en-US', { hour12: false }),
    row.endTime.toLocaleTimeString('en-US', { hour12: false }),
    toDaysHrsMins(row.startTime, row.endTime),
    row.status
  ]);
  
  const csvContent = [headers, ...csvRows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return new Blob([csvContent], { type: 'text/csv' });
};

// Main API function
export const getSlaDetails = async (filters) => {
  console.log('🚀 Getting SLA details with filters:', filters);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate fresh data
      const rawData = generateSlaData(30, 25);
      
      // Apply filters
      const filteredData = filterData(rawData, filters);
      
      const result = {
        rawData,
        filteredData,
        summary: {
          totalRecords: filteredData.length,
          dateRange: {
            from: filters.fromDate || 'All',
            to: filters.toDate || 'All'
          },
          environment: filters.environment || 'ALL',
          type: filters.type || 'ALL'
        }
      };
      
      console.log('✅ SLA details ready:', result.summary);
      resolve(result);
    }, 300);
  });
};