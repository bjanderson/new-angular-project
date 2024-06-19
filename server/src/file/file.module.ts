import { Module } from '@nestjs/common';
import { FileIOService } from 'src/file-io';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  controllers: [FileController],
  providers: [FileService, FileIOService],
})
export class FileModule {}
