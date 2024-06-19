import { ICSVModel } from '@bjanderson/my-project-shared';
import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class FileIOService {
  getFilePath(fileName: string): string {
    const myProjectFolder = resolve(process.env.MY_PROJECT_FOLDER || '..');
    const filePath = resolve(myProjectFolder, fileName);
    return filePath;
  }

  createDirectory(fileName: string): void {
    const filePath = this.getFilePath(fileName);
    try {
      mkdirSync(filePath, { recursive: true });
    } catch (err) {
      console.error(`Failed to create directory: ${filePath}`);
      console.error(err);
      process.exit(1);
    }
  }

  pathExists(fileName: string): boolean {
    const filePath = this.getFilePath(fileName);
    return existsSync(filePath);
  }

  createDirectoryIfNotExists(fileName: string): void {
    if (!this.pathExists(fileName)) {
      this.createDirectory(fileName);
    }
  }

  readFile(fileName: string): string {
    try {
      const filePath = this.getFilePath(fileName);
      const fileContents = readFileSync(filePath, { encoding: 'utf-8' });
      return fileContents;
    } catch (error) {
      return '';
    }
  }

  readCSVFile(fileName: string, delimiter = '\t'): any[] {
    if (this.pathExists(fileName)) {
      try {
        const str = this.readFile(fileName);
        const rows = str.split('\n');
        const header = rows[0].split(delimiter).map((h) => h.replace(/"/g, ''));
        const items = [];
        rows.slice(1).forEach((row) => {
          const values = row.split(delimiter).map((v) => v.replace(/"/g, ''));
          const item = {};
          header.forEach((key, i) => {
            item[key] = values[i];
          });
          items.push(item);
        });
        return items;
      } catch (err) {
        console.error(`ERROR: Could not read CSV file ${fileName}`);
        return [];
      }
    }
    return [];
  }

  readJSONFile(fileName: string): any {
    if (this.pathExists(fileName)) {
      try {
        const str = this.readFile(fileName);
        return JSON.parse(str);
      } catch (err) {
        console.error(`ERROR: Could not read file ${fileName}`);
        return {};
      }
    }
    return {};
  }

  writeFile(fileName: string, text: string, overwrite = false): void {
    const filePath = this.getFilePath(fileName);
    if (!overwrite && this.pathExists(fileName)) {
      console.error(`${filePath} already exists. Enter a different name.`);
      process.exit(1);
    }
    try {
      writeFileSync(filePath, text, { encoding: 'utf-8' });
    } catch (err) {
      console.error(`Failed to write file: ${filePath}`);
      console.error(err);
      process.exit(1);
    }
  }

  writeCSVFile(fileName: string, items: ICSVModel[], delimiter = '\t'): void {
    const header = items[0].csvHeader;
    const csv = [header.join(delimiter)];
    items.forEach((i) => {
      const item = [];
      header.forEach((h) => {
        item.push(i[h]);
      });
      csv.push(item.join(delimiter));
    });
    const text = csv.join('\n');
    this.writeFile(fileName, text, true);
  }

  writeJSONFile(fileName: string, json: any): void {
    const str = JSON.stringify(json, null, 2);
    this.writeFile(fileName, str);
  }
}
