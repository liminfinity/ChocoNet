import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { GetListDto } from '@/common/dto';
import { PastryWithIdDto } from './pastry.dto';

class PastryAutorizedDto extends PastryWithIdDto {
  @ApiProperty({
    description: 'Pastry is liked',
    example: true,
  })
  isLiked!: boolean;
}

@ApiExtraModels(PastryAutorizedDto, PastryWithIdDto)
export class GetPastriesDto extends GetListDto {
  @ApiProperty({
    description: 'List of pastries',
    isArray: true,
    oneOf: [{ $ref: getSchemaPath(PastryAutorizedDto) }, { $ref: getSchemaPath(PastryWithIdDto) }],
  })
  data!: (PastryAutorizedDto | PastryWithIdDto)[];
}
