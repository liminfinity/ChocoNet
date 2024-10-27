import { ApiProperty } from '@nestjs/swagger';
import type { Geolocation } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GeolocationDto implements Pick<Geolocation, 'lat' | 'lng'> {
  @ApiProperty({
    description: 'Geolocation latitude',
    example: 42,
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  lat!: number;

  @ApiProperty({
    description: 'Geolocation longitude',
    example: 42,
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  lng!: number;
}
