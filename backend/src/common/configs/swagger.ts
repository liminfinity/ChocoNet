import { COOKIES } from '@/modules/auth/constants';
import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('ChocoNet API')
  .setDescription('The ChocoNet API description')
  .setVersion('1.0')
  .addCookieAuth(COOKIES.ACCESS_TOKEN, {
    bearerFormat: 'JWT',
    description: 'Access token',
    in: 'cookie',
    type: 'apiKey',
  })
  .build();
