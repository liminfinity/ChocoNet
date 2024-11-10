import { Pastry, PastryUnit } from '@prisma/client';
import { PastryGeolocationDto } from './geolocation';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { MediaDto } from './media';
import { IsOptional, IsUUID } from 'class-validator';

export class PastryDto implements Pick<Pastry, 'id' | 'createdAt' | 'name' | 'price' | 'unit'> {
  @ApiProperty({
    description: 'Pastry id',
    example: '1',
  })
  id!: string;

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

class AuthenticatedPastryDto extends PastryDto {
  @ApiProperty({
    description: 'Pastry is liked',
    example: true,
  })
  isLiked!: boolean;
}

@ApiExtraModels(AuthenticatedPastryDto, PastryDto)
export class GetPastriesDto {
  @ApiProperty({
    description: 'List of pastries',
    isArray: true,
    oneOf: [{ $ref: getSchemaPath(AuthenticatedPastryDto) }, { $ref: getSchemaPath(PastryDto) }],
  })
  data!: (AuthenticatedPastryDto | PastryDto)[];

  @ApiProperty({
    description: 'Next cursor for pagination (uuid v4)',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @IsOptional()
  @IsUUID('4')
  nextCursor?: string;
}