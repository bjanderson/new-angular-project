import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(protected jsonService: FileService) {}

  @Post(':filename')
  write(@Param('filename') filename: string, @Body() text: any): Promise<void> {
    return this.jsonService.write(filename, text);
  }

  @Get(':filename')
  read(@Param('filename') filename: string): Promise<any> {
    return this.jsonService.read(filename);
  }
}
