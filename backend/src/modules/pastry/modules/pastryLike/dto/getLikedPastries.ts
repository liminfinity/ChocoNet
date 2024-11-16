import { GetBasePastriesDto, PastryDto } from '@/modules/pastry/dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetLikedPastriesDto extends GetBasePastriesDto {
  @ApiProperty({
    description: 'List of pastries',
    isArray: true,
    type: PastryDto,
  })
  data!: PastryDto[];
}
