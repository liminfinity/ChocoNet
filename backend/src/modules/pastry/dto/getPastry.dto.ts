import { ApiProperty } from '@nestjs/swagger';
import { PastryDto } from './pastry.dto';
import { Pastry, PastryCategoryEnum, User } from '@prisma/client';
import { PastryContactDto } from './contact.dto';

export class GetPastryDto extends PastryDto implements Pick<Pastry, 'description'> {
  @ApiProperty({
    description: 'Pastry categories',
    example: [
      PastryCategoryEnum.BAKED_GOODS_AND_SWEETS,
      PastryCategoryEnum.ICE_CREAM_AND_FROZEN_DESSERTS,
    ],
    isArray: true,
    enum: PastryCategoryEnum,
  })
  categories!: PastryCategoryEnum[];

  @ApiProperty({
    description: 'Pastry contact',
    examples: [
      {
        phone: '123456789',
      },
      null,
    ],
  })
  contact!: PastryContactDto | null;

  @ApiProperty({
    description: 'Pastry description',
    example: 'Description of the pastry',
  })
  description!: string | null;
}

export class GetPastryOwnerDto extends GetPastryDto implements Pick<Pastry, 'updatedAt'> {
  @ApiProperty({
    description: 'Pastry update date',
    example: '2022-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;
}

export class OwnerDto
  implements Pick<User, 'id' | 'firstName' | 'lastName' | 'nickname' | 'createdAt'>
{
  @ApiProperty({
    description: 'User id',
    example: '1',
  })
  id!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName!: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName!: string;

  @ApiProperty({
    description: 'User nickname',
    example: 'johndoe',
  })
  nickname!: string;

  @ApiProperty({
    description: 'User creation date',
    example: '2022-01-01T00:00:00.000Z',
  })
  createdAt!: Date;
}

export class GetPastryGuestDto extends GetPastryDto {
  @ApiProperty({
    description: 'Pastry owner',
    example: {
      firstName: 'John',
      lastName: 'Doe',
      nickname: 'johndoe',
      createdAt: '2022-01-01T00:00:00.000Z',
    },
  })
  owner!: OwnerDto;
}

export class GetPastryAutorizedDto extends GetPastryGuestDto {
  @ApiProperty({
    description: 'Pastry is liked',
    example: true,
  })
  isLiked!: boolean;
}
