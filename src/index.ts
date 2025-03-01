import { Scraper } from './Scraper';

const scraper = new Scraper({
  useBooknum: [12, 50],  // Scrape books from 12 to 50
  FormatOutput: 'csv',   // Ensures CSV format
  userAgent: 'Mozilla/5.0',
  timeout: 5000
}, 10, 3); // Scrape 10 books at once, retry 3 times

scraper.scrape();
