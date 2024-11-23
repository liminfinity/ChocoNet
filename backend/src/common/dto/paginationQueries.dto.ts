import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class PaginationQueriesDto {
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
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(100)
  @Type(() => Number)
  limit = 10;
}
