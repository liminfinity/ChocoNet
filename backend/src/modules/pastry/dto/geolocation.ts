import { ApiProperty } from '@nestjs/swagger';
import type { PastryGeolocation } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude } from 'class-validator';

export class PastryGeolocationDto implements Pick<PastryGeolocation, 'lat' | 'lng'> {
  @ApiProperty({
    description: 'Pastry geolocation latitude',
    example: 42,
    required: true,
  })
  @IsLatitude()
  @Type(() => Number)
  lat!: number;

  @ApiProperty({
    description: 'Pastry geolocation longitude',
    example: 42,
    required: true,
  })
  @IsLongitude()
  @Type(() => Number)
  lng!: number;
}
