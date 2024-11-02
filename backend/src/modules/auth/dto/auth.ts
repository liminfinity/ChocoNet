import { EmailDto } from '@/common/dto';
import { User } from '@prisma/client';
import { IsPassword } from '../decorators';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto extends EmailDto implements Pick<User, 'password'> {
  @ApiProperty({
    description: 'User password',
    example: 'password123',
    required: true,
    minLength: 8,
  })
  @IsPassword()
  password!: string;
}
