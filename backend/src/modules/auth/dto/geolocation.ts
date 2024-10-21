import type { Geolocation } from '@prisma/client';
import { IsNumber } from 'class-validator';

export class GeolocationDto implements Pick<Geolocation, 'lat' | 'lng'> {
  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;
}
