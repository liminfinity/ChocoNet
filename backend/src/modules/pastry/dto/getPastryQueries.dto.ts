import { PastryCategoryEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderBy } from '../types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueriesDto } from '@/common/dto';
import { Order } from '@/common/types';

class PriceQueriesDto {
  @ApiPropertyOptional({
    description: 'Minimum price',
    example: 42,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  min = 0;

  @ApiPropertyOptional({
    description: 'Maximum price',
    example: 42,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  max?: number;
}

class GeolocationQueriesDto {
  @ApiProperty({
    description: 'Latitude',
    example: 42,
    required: true,
  })
  @IsLatitude()
  lat!: number;

  @ApiProperty({
    description: 'Longitude',
    example: 42,
    required: true,
  })
  @IsLongitude()
  lng!: number;

  @ApiPropertyOptional({
    description: 'Search radius in kilometers',
    example: 5,
    default: 150,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  radius = 150;
}

export class GetPastryQueriesDto {
  @ApiPropertyOptional({
    description: 'Search query',
    example: 'Cake',
    default: '',
  })
  @IsOptional()
  @IsString()
  search: string = '';

  @ApiPropertyOptional({
    description: 'List of categories',
    isArray: true,
    enum: PastryCategoryEnum,
    example: [PastryCategoryEnum.BAKED_GOODS_AND_SWEETS, PastryCategoryEnum.CANDIES_AND_LOLLIPOPS],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(PastryCategoryEnum, { each: true })
  categories?: PastryCategoryEnum[];

  @ApiPropertyOptional({
    description: 'Price queries',
    example: { min: 42, max: 42 },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PriceQueriesDto)
  price?: PriceQueriesDto;

  @ApiPropertyOptional({
    description: 'Geolocation queries',
    example: { lat: 42, lng: 42, radius: 42 },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => GeolocationQueriesDto)
  geolocation?: GeolocationQueriesDto;

  @ApiPropertyOptional({
    description: 'Order by',
    enum: ['price', 'createdAt', 'popularity'],
    example: 'price',
    default: 'popularity',
  })
  @IsOptional()
  @IsString()
  @IsIn(<[OrderBy, OrderBy, OrderBy]>['price', 'createdAt', 'popularity'])
  orderBy: OrderBy = 'popularity';

  @ApiPropertyOptional({
    description: 'Order',
    enum: ['asc', 'desc'],
    example: 'asc',
    default: 'asc',
  })
  @IsOptional()
  @IsString()
  @IsIn(<[Order, Order]>['asc', 'desc'])
  order: Order = 'asc';

  @ApiPropertyOptional({
    description: 'Pagination queries',
    example: { limit: 10, cursor: '123e4567-e89b-12d3-a456-426655440000' },
    default: { limit: 10 },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationQueriesDto)
  pagination: PaginationQueriesDto = new PaginationQueriesDto();
}
