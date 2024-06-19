import { Injectable, Logger } from '@nestjs/common';
import { FileIOService } from 'src/file-io';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(private fileIOService: FileIOService) {}

  write(fileName: string, data: string): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
      try {
        const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        this.fileIOService.writeFile(fileName, text, true);
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    return promise;
  }

  read(fileName: string): Promise<string> {
    const promise = new Promise<string>((resolve, reject) => {
      try {
        const text = this.fileIOService.readFile(fileName);
        resolve(text);
      } catch (error) {
        this.logger.log(error);
        reject(error);
      }
    });
    return promise;
  }
}
