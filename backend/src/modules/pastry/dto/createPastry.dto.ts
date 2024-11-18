import { Pastry, PastryUnit, PastryCategoryEnum } from '@prisma/client';
import { IsArray, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { PastryContactDto } from './contact.dto';
import { Type } from 'class-transformer';
import { PastryGeolocationDto } from './geolocation.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePastryDto implements Omit<Pastry, 'id' | 'createdAt' | 'updatedAt' | 'userId'> {
  @ApiProperty({
    description: 'Pastry name',
    example: 'Cake with chocolate',
    required: true,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Pastry description',
    example: 'Description of the pastry',
    required: true,
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: 'Pastry price',
    example: 42,
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  price!: number;

  @ApiProperty({
    description: 'Pastry unit',
    example: PastryUnit.GRAM,
    required: true,
    enum: PastryUnit,
  })
  @IsEnum(PastryUnit)
  unit!: PastryUnit;

  @ApiProperty({
    description: 'Pastry categories',
    example: [PastryCategoryEnum.BAKED_GOODS_AND_SWEETS, PastryCategoryEnum.CAKES_AND_PASTRIES],
    required: true,
    type: [String],
    enum: PastryCategoryEnum,
  })
  @IsArray()
  @IsEnum(PastryCategoryEnum, { each: true })
  categories!: PastryCategoryEnum[];

  @ApiProperty({
    description: 'Pastry contact',
    example: {
      phone: '123456789',
    },
    required: true,
  })
  @ValidateNested()
  @Type(() => PastryContactDto)
  contact!: PastryContactDto;

  @ApiProperty({
    description: 'Pastry geolocation',
    example: {
      lat: 42,
      lng: 42,
    },
    required: true,
  })
  @ValidateNested()
  @Type(() => PastryGeolocationDto)
  geolocation!: PastryGeolocationDto;

  @ApiProperty({
    description: 'Pastry media',
    example: [],
    required: false,
    format: 'binary',
  })
  media!: Express.Multer.File[];
}
