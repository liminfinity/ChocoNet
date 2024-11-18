import { ApiProperty } from '@nestjs/swagger';
import { PastryContact } from '@prisma/client';
import { IsPhoneNumber } from 'class-validator';

export class PastryContactDto implements Pick<PastryContact, 'phone'> {
  @ApiProperty({
    description: 'Pastry phone number',
    example: '123456789',
    required: true,
  })
  @IsPhoneNumber()
  phone!: string;
}
