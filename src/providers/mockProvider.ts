// Mock Data Provider - Returns Promise<ReportRow[]>
import { ReportRow } from '../types/slaTypes';

// Deterministic random number generator for consistent results
class SeededRandom {
  private seed: number;

  constructor(seed = 12345) {
    this.seed = seed;
  }
  
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  range(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

const ENVIRONMENTS = ['ASYS', 'TSYS', 'MST0', 'OSYS', 'ECT0', 'QSYS', 'VST0'];
const TYPES: Array<"BANK" | "CARD"> = ['BANK', 'CARD'];
const PHASES = ['Pre-Processing', 'Main Processing', 'Post-Processing', 'Validation', 'Cleanup'];
const STATUSES: Array<"COMPLETED" | "FAILED" | "PENDING"> = ['COMPLETED', 'FAILED', 'PENDING'];

export const mockProvider = {
  async getData(days = 30): Promise<ReportRow[]> {
    console.log('🔄 Mock Provider: Generating SLA data...');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const data: ReportRow[] = [];
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
            
            // Create realistic status distribution
            // 70% completed, 20% failed, 10% pending
            const statusRand = rng.next();
            const status = statusRand < 0.7 ? 'COMPLETED' : 
                          statusRand < 0.9 ? 'FAILED' : 'PENDING';
            
            data.push({
              id: `${env}-${type}-${runDate.toISOString().split('T')[0]}-${r}`,
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
    
    console.log(`✅ Mock Provider: Generated ${data.length} SLA records`);
    return data;
  }
};