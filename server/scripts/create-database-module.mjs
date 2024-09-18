import { parseTemplate } from './config.mjs';
import { createDirectoryIfNotExists, writeFile } from './file-io.mjs';

const folder = parseTemplate('src/kabab-case');
createDirectoryIfNotExists(folder);

// Service
const serviceTemplate = `import { PascalCase } from '@bjanderson/moneytool-shared';
import { Injectable } from '@nestjs/common';
import { AbstractCRUDService, DatabaseService } from 'src/database';

@Injectable()
export class PascalCaseService extends AbstractCRUDService<PascalCase> {
  constructor(protected databaseService: DatabaseService) {
    super(databaseService, PascalCase);
  }
}
`;

const serviceFileName = parseTemplate(`${folder}/kabab-case.service.ts`);
const serviceTxt = parseTemplate(serviceTemplate);
writeFile(serviceFileName, serviceTxt);

// Controller
const controllerTemplate = `import { PascalCase } from '@bjanderson/moneytool-shared';
import { Controller } from '@nestjs/common';
import { AbstractCRUDController } from 'src/database';
import { PascalCaseService } from './kabab-case.service';

@Controller('api/kabab-case')
export class PascalCaseController extends AbstractCRUDController<PascalCase> {
  constructor(protected camelCaseService: PascalCaseService) {
    super(camelCaseService);
  }
}
`;

const controllerFileName = parseTemplate(`${folder}/kabab-case.controller.ts`);
const controllerTxt = parseTemplate(controllerTemplate);
writeFile(controllerFileName, controllerTxt);

// Module
const moduleTemplate = `import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database';
import { PascalCaseController } from './kabab-case.controller';
import { PascalCaseService } from './kabab-case.service';

@Module({
  controllers: [PascalCaseController],
  providers: [PascalCaseService, DatabaseService],
})
export class PascalCaseModule {}
`;

const moduleFileName = parseTemplate(`${folder}/kabab-case.module.ts`);
const moduleTxt = parseTemplate(moduleTemplate);
writeFile(moduleFileName, moduleTxt);
