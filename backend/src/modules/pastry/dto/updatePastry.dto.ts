import { Pastry, PastryUnit, PastryCategoryEnum } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { PastryContactDto } from './contact.dto';
import { Type } from 'class-transformer';
import { PastryGeolocationDto } from './geolocation.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePastryDto
  implements Partial<Omit<Pastry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>
{
  @ApiProperty({
    description: 'Pastry name',
    example: 'Cake with chocolate',
  })
  @IsOptional()
  @IsString()
  name?: string | undefined;

  @ApiProperty({
    description: 'Pastry description',
    example: 'Description of the pastry',
  })
  @IsOptional()
  @IsString()
  description?: string | undefined;

  @ApiProperty({
    description: 'Pastry price',
    example: 42,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price?: number | undefined;

  @ApiProperty({
    description: 'Pastry unit',
    example: PastryUnit.GRAM,
    enum: PastryUnit,
  })
  @IsOptional()
  @IsEnum(PastryUnit)
  unit?: PastryUnit | undefined;

  @ApiProperty({
    description: 'Pastry categories',
    example: [PastryCategoryEnum.BAKED_GOODS_AND_SWEETS, PastryCategoryEnum.CAKES_AND_PASTRIES],
    type: [String],
    enum: PastryCategoryEnum,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(PastryCategoryEnum, { each: true })
  categories?: PastryCategoryEnum[] | undefined;

  @ApiProperty({
    description: 'Pastry contact',
    example: {
      phone: '123456789',
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PastryContactDto)
  contact?: PastryContactDto | undefined;

  @ApiProperty({
    description: 'Pastry geolocation',
    example: {
      lat: 42,
      lng: 42,
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PastryGeolocationDto)
  geolocation?: PastryGeolocationDto | undefined;

  @ApiProperty({
    description: 'Pastry media to remove',
    example: ['1', '2'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  mediaToRemove?: string[] | undefined;

  @ApiProperty({
    description: 'Pastry media',
    example: [],
    format: 'binary',
  })
  @IsOptional()
  media?: Express.Multer.File[] | undefined;
}
