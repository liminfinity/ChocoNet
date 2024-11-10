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
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Order, OrderBy } from '../types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PriceQueriesDto {
  @ApiPropertyOptional({
    description: 'Minimum price',
    example: 42,
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
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  radius = 150;
}

class PaginationQueriesDto {
  @ApiPropertyOptional({
    description: 'Cursor for pagination (uuid v4)',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @IsOptional()
  @IsUUID('4')
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Limit for pagination',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(100)
  @Type(() => Number)
  limit = 10;
}

export class GetPastryQueriesDto {
  @ApiPropertyOptional({
    description: 'Search query',
    example: 'Cake',
  })
  @IsOptional()
  @IsString()
  search?: string;

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
  })
  @IsOptional()
  @IsString()
  @IsIn(<[OrderBy, OrderBy, OrderBy]>['price', 'createdAt', 'popularity'])
  orderBy: OrderBy = 'popularity';

  @ApiPropertyOptional({
    description: 'Order',
    enum: ['asc', 'desc'],
    example: 'asc',
  })
  @IsOptional()
  @IsString()
  @IsIn(<[Order, Order]>['asc', 'desc'])
  order: Order = 'asc';

  @ApiPropertyOptional({
    description: 'Pagination queries',
    example: { limit: 10, cursor: '123e4567-e89b-12d3-a456-426655440000' },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationQueriesDto)
  pagination?: PaginationQueriesDto;
}
