import fs from 'fs';
import path from 'path';

export function formatCSV(data: string): string {
  const rows = data.split('\n').map(line => line.split(/\s+/).join(','));
  return rows.join('\n');
}

export function saveToFile(data: string, bookId: number, format: string) {
  const filePath = path.join('books', `book_${bookId}.${format}`);
  fs.writeFileSync(filePath, data);
  console.log(`📂 Data saved as ${filePath}`);
}
