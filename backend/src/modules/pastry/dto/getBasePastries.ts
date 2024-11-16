import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";

export class GetBasePastriesDto {
  @ApiProperty({
    description: 'Next cursor for pagination (uuid v4)',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @IsOptional()
  @IsUUID('4')
  nextCursor?: string;
}
