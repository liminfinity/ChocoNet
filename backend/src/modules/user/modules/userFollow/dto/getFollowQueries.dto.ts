import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueriesDto } from '@/common/dto';
import { OrderBy } from '../types';
import { Order } from '@/common/types';

export enum FollowType {
  FOLLOWING = 'following',
  FOLLOWER = 'follower',
}

export class GetFollowQueriesDto {
  @ApiPropertyOptional({
    description: 'Follow type',
    enum: FollowType,
    example: 'following',
    default: FollowType.FOLLOWER,
  })
  @IsEnum(FollowType)
  @IsOptional()
  @IsString()
  followType: FollowType = FollowType.FOLLOWER;

  @ApiPropertyOptional({
    description: 'Search query',
    example: 'John Doe',
    default: '',
  })
  @IsOptional()
  @IsString()
  name: string = '';

  @ApiPropertyOptional({
    description: 'Order by',
    enum: ['createdAt'],
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  @IsIn(<[OrderBy]>['createdAt'])
  orderBy: OrderBy = 'createdAt';

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
