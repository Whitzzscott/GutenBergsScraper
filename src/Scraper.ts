import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';
import path from 'path';
import { ScraperOptions } from './Interface/interfaces';
import { formatCSV, saveToFile } from './Utils/Utils';

export class Scraper {
  options: ScraperOptions;
  parallelScrapes: number;
  maxRetries: number;

  constructor(options: ScraperOptions, parallelScrapes: number = 20, maxRetries: number = 3) {
    this.options = options;
    this.parallelScrapes = parallelScrapes;
    this.maxRetries = maxRetries;

    if (!fs.existsSync('books')) {
      fs.mkdirSync('books');
    }
  }

  async scrape() {
    let bookIds: number[] = [];

    if (Array.isArray(this.options.useBooknum) && this.options.useBooknum.length === 2) {
      const [start, end] = this.options.useBooknum;
      bookIds = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    } else if (typeof this.options.useBooknum === 'number') {
      bookIds = [this.options.useBooknum];
    } else {
      console.error('Invalid useBooknum format. It must be a number or an array with two numbers.');
      return;
    }

    console.log(`Scraping books: ${bookIds.length} total`);

    await this.processInBatches(bookIds, 50);
  }

  async processInBatches(bookIds: number[], batchSize: number) {
    let index = 0;
    const total = bookIds.length;

    const scrapeBatch = async () => {
      while (index < total) {
        const batch = bookIds.slice(index, index + batchSize);
        index += batchSize;
        await Promise.all(batch.map((bookId) => this.scrapeBookWithRetry(bookId, this.maxRetries)));
      }
    };

    await scrapeBatch();
  }

  async scrapeBookWithRetry(bookId: number, retriesLeft: number) {
    try {
      await this.scrapeBook(bookId);
    } catch (error) {
      if (retriesLeft > 0) {
        console.warn(`Retrying book ${bookId} (${this.maxRetries - retriesLeft + 1}/${this.maxRetries})`);
        await this.scrapeBookWithRetry(bookId, retriesLeft - 1);
      } else {
        console.error(`Failed to scrape book ${bookId} after multiple attempts.`);
      }
    }
  }

  async scrapeBook(bookId: number) {
    const url = `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}-images.html`;

    const config: any = {
      headers: this.options.userAgent ? { 'User-Agent': this.options.userAgent } : {},
    };

    console.log(`Fetching book: ${bookId}`);
    const response = await axios.get(url, config);

    if (!response.data) {
      throw new Error(`No data received for book ${bookId}`);
    }

    const $ = load(response.data);
    const chapters = $('div.chapter');
    let scrapedData = '';

    chapters.each((i, chapter) => {
      scrapedData += `Chapter ${i + 1}:\n`;
      $(chapter).find('p, h1, h2, h3, h4, h5, h6').each((_, tag) => {
        let text = $(tag).text();
        scrapedData += `${text}\n`;
      });
    });

    if (this.options.FormatOutput === 'csv') {
      scrapedData = formatCSV(scrapedData);
    } else if (this.options.FormatOutput === 'json') {
      scrapedData = JSON.stringify({ bookId, content: scrapedData }, null, 2);
    }

    saveToFile(scrapedData, bookId, this.options.FormatOutput);
    console.log(`✔ Book ${bookId} scraped successfully`);
  }
}
