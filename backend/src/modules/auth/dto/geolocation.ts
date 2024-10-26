import type { Geolocation } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GeolocationDto implements Pick<Geolocation, 'lat' | 'lng'> {
  @IsNumber()
  @Type(() => Number)
  lat!: number;

  @IsNumber()
  @Type(() => Number)
  lng!: number;
}
