// Data Contracts - Clear interfaces for SLA Reports
export interface ReportRow {
  id: string;
  runDate: Date;
  type: "BANK" | "CARD";
  lrd: Date;
  env: string;
  phase: string;
  startTime: Date;
  endTime: Date;
  durationHrs: number;
  status: "COMPLETED" | "FAILED" | "PENDING";
}

export interface Filters {
  env: "ALL" | string;
  type: "ALL" | "BANK" | "CARD";
  from: Date | null;
  to: Date | null;
}

export interface SeriesPoint {
  date: Date;
  weightedAvgHrs: number;
  actualAvgHrs: number;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    fill: boolean;
    borderWidth: number;
    pointRadius: number;
    pointHoverRadius: number;
    borderDash?: number[];
  }>;
}

export interface ValidationErrors {
  env?: string;
  type?: string;
  from?: string;
  to?: string;
}