import { GetListDto } from '@/common/dto';
import { PastryDto } from '@/modules/pastry/dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetLikedPastriesDto extends GetListDto {
  @ApiProperty({
    description: 'List of pastries',
    isArray: true,
    type: PastryDto,
  })
  data!: PastryDto[];
}
