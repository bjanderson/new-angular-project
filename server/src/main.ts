import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { ExceptionLogger } from './exception-logger';

const limit = '50mb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ExceptionLogger());
  app.setGlobalPrefix('api');
  app.use(json({ limit }));
  app.use(urlencoded({ extended: true, limit }));
  await app.listen(3001);
}
bootstrap();
