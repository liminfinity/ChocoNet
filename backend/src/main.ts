import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { exceptionFactory } from './common/lib';
import cookieParser from 'cookie-parser';
import { ENV, IS_DEV, ROUTER_PATHS } from '@/common/constants';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './common/configs';
import { LoggerService } from './common/services';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerService,
  });

  app.use(cookieParser(ENV.COOKIE_SECRET));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory,
    }),
  );

  app.setGlobalPrefix(ROUTER_PATHS.API, {
    exclude: [
      { path: ROUTER_PATHS.PUBLIC, method: RequestMethod.ALL },
      { path: ROUTER_PATHS.UPLOADS, method: RequestMethod.ALL },
    ],
  });

  if (IS_DEV) {
    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup(ROUTER_PATHS.API, app, document);
  }

  await app.listen(ENV.PORT, ENV.HOST);
};

bootstrap();
