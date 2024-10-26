import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { exceptionFactory } from './common/lib';
import cookieParser from 'cookie-parser';
import { ENV } from '@/common/constants';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser(ENV.COOKIE_SECRET));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory,
    }),
  );

  await app.listen(ENV.PORT, ENV.HOST);
}
bootstrap();
