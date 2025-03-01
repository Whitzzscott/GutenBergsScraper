# Gutenberg Scraper

The Gutenberg Scraper is a tool designed to scrape content from Project Gutenberg. But how does it work?

The Gutenberg Scraper uses parallelism and other technologies to speed up the scraping process for Node.js applications. It is primarily built with TypeScript.

If you'd like to use this scraper, here's an example of how to set it up:

You’ll likely notice a file named `index.ts`. This is where you can begin. By default, it will contain some example code, such as:

```typescript
import { Scraper } from './Scraper';

const scraper = new Scraper({
  useBooknum: [12, 50],  // Scrape books from 12 to 50
  FormatOutput: 'csv',   // Output format will be CSV
  userAgent: 'Mozilla/5.0',
  timeout: 5000          // Set a timeout for requests
}, 10, 3); // Scrape 10 books at once and retry 3 times in case of failure

scraper.scrape();
```

In this example:

- `useBooknum: [12, 50]` specifies the range of books to scrape, from book number 12 to 50.
- `FormatOutput: 'csv'` indicates that the output will be in CSV format. You can also choose other formats, such as CSV, TXT, or JSON.
- `userAgent: 'Mozilla/5.0'` sets a custom user-agent to help prevent the scraper from being blocked by the website.
- `timeout: 5000` sets the timeout for each request to 5000 milliseconds (5 seconds).

The second part of the constructor, `10` and `3`, represents:

- `10`: The number of parallel requests to make at once. This allows the scraper to scrape multiple books simultaneously, speeding up the process.
- `3`: The number of retry attempts in case a request fails. If a book fails to scrape, the scraper will retry up to 3 times before it gives up.

Once you've set this up, calling `scraper.scrape()` will start the scraping process based on the provided configuration. You can choose the output format to be CSV, JSON, or TXT as per your preference.

To use it first install the package by running `npm i gutenbergscraper` once run you can directly type in the command prompt or powershell `npm i` then `npm run start` and your done~!
