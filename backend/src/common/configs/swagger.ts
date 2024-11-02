import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('ChocoNet API')
  .setDescription('The ChocoNet API description')
  .setVersion('1.0')
  .build();
