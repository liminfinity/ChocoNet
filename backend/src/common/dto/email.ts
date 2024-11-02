import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailDto {
  @ApiProperty({
    description: 'Email address',
    example: 'john124@example.com',
    required: true,
  })
  @IsEmail()
  email!: string;
}
