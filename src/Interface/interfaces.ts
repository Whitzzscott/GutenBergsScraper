export interface ScraperOptions {
  useBooknum: number | [number, number];
  FormatOutput: 'txt' | 'csv' | 'json';
  userAgent?: string;
  proxy?: string;
  timeout?: number;
}
