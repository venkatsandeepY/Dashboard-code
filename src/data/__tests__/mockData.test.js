import { 
  fetchBatchData, 
  fetchJobsData, 
  fetchHistoryData,
  mockBatchData,
  mockJobsData,
  mockHistoryData
} from '../mockData';

describe('Mock Data', () => {
  describe('mockBatchData', () => {
    test('contains expected number of environments', () => {
      expect(mockBatchData).toHaveLength(7);
    });

    test('each batch item has required properties', () => {
      mockBatchData.forEach(batch => {
        expect(batch).toHaveProperty('id');
        expect(batch).toHaveProperty('environment');
        expect(batch).toHaveProperty('bank');
        expect(batch).toHaveProperty('card');
        expect(batch).toHaveProperty('lastRun');
        expect(batch).toHaveProperty('eta');
        expect(batch).toHaveProperty('runtime');
        
        expect(batch.bank).toHaveProperty('status');
        expect(batch.bank).toHaveProperty('progress');
        expect(batch.card).toHaveProperty('status');
        expect(batch.card).toHaveProperty('progress');
      });
    });

    test('progress values are within valid range', () => {
      mockBatchData.forEach(batch => {
        expect(batch.bank.progress).toBeGreaterThanOrEqual(0);
        expect(batch.bank.progress).toBeLessThanOrEqual(100);
        expect(batch.card.progress).toBeGreaterThanOrEqual(0);
        expect(batch.card.progress).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('mockJobsData', () => {
    test('contains data for all environments', () => {
      const environments = ['ASYS', 'TSYS', 'MST0', 'OSYS', 'ECT0', 'QSYS', 'VST0'];
      
      environments.forEach(env => {
        expect(mockJobsData).toHaveProperty(env);
        expect(Array.isArray(mockJobsData[env])).toBe(true);
      });
    });

    test('job items have required properties', () => {
      Object.values(mockJobsData).forEach(jobs => {
        jobs.forEach(job => {
          expect(job).toHaveProperty('name');
          expect(job).toHaveProperty('status');
          expect(job).toHaveProperty('startTime');
          expect(job).toHaveProperty('icon');
          expect(job).toHaveProperty('color');
        });
      });
    });
  });

  describe('mockHistoryData', () => {
    test('contains data for all environments', () => {
      const environments = ['ASYS', 'TSYS', 'MST0', 'OSYS', 'ECT0', 'QSYS', 'VST0'];
      
      environments.forEach(env => {
        expect(mockHistoryData).toHaveProperty(env);
        expect(Array.isArray(mockHistoryData[env])).toBe(true);
      });
    });

    test('history items have required properties', () => {
      Object.values(mockHistoryData).forEach(history => {
        history.forEach(item => {
          expect(item).toHaveProperty('type');
          expect(item).toHaveProperty('completedAt');
          expect(item).toHaveProperty('duration');
          expect(item).toHaveProperty('status');
          expect(item).toHaveProperty('records');
        });
      });
    });
  });

  describe('API simulation functions', () => {
    test('fetchBatchData returns mock data', async () => {
      const data = await fetchBatchData();
      expect(data).toEqual(mockBatchData);
    });

    test('fetchJobsData returns correct environment data', async () => {
      const data = await fetchJobsData('ASYS');
      expect(data).toEqual(mockJobsData['ASYS']);
    });

    test('fetchJobsData returns empty array for unknown environment', async () => {
      const data = await fetchJobsData('UNKNOWN');
      expect(data).toEqual([]);
    });

    test('fetchHistoryData returns correct environment data', async () => {
      const data = await fetchHistoryData('TSYS');
      expect(data).toEqual(mockHistoryData['TSYS']);
    });

    test('fetchHistoryData returns empty array for unknown environment', async () => {
      const data = await fetchHistoryData('UNKNOWN');
      expect(data).toEqual([]);
    });

    test('API functions simulate network delay', async () => {
      const startTime = Date.now();
      await fetchBatchData();
      const endTime = Date.now();
      
      // Should take at least 500ms due to setTimeout
      expect(endTime - startTime).toBeGreaterThanOrEqual(500);
    });
  });
});