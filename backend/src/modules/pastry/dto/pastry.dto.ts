import { ApiProperty } from '@nestjs/swagger';
import { Pastry, PastryUnit } from '@prisma/client';
import { PastryGeolocationDto } from './geolocation.dto';
import { MediaDto } from './media.dto';

export class PastryDto implements Pick<Pastry, 'createdAt' | 'name' | 'price' | 'unit'> {
  @ApiProperty({
    description: 'Pastry creation date',
    example: '2022-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Pastry name',
    example: 'Cake with chocolate',
  })
  name!: string;

  @ApiProperty({
    description: 'Pastry price',
    example: 42,
  })
  price!: number;

  @ApiProperty({
    description: 'Pastry unit',
    example: PastryUnit.GRAM,
    enum: PastryUnit,
  })
  unit!: PastryUnit;

  @ApiProperty({
    description: 'Pastry geolocation',
    example: {
      lat: 42,
      lng: 42,
      formatted: 'Address',
    },
    nullable: true,
  })
  geolocation!: (PastryGeolocationDto & { formatted: string }) | null;

  @ApiProperty({
    description: 'Pastry media',
    isArray: true,
    example: [{ id: '1', path: '/path/to/cake.png' }],
  })
  media!: MediaDto[];

  @ApiProperty({
    description: 'Pastry likes count',
    example: {
      likes: 42,
    },
  })
  _count!: {
    likes: number;
  };
}

export class PastryWithIdDto extends PastryDto implements Pick<Pastry, 'id'> {
  @ApiProperty({
    description: 'Pastry id',
    example: '1',
  })
  id!: string;
}
