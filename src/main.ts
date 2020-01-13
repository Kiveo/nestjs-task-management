import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('boostrap');
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server');

  if (process.env.NODE_ENV === 'development') {
    logger.log('Dev mode detected');
    app.enableCors();
  } else {
    app.enableCors({ origin: serverConfig.origin });
  }

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Listening on port: ${port}`);
}
bootstrap();
