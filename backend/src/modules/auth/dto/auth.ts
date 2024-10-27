import { EmailDto } from '@/common/dto';
import { User } from '@prisma/client';
import { IsPassword } from '../decorators';

export class AuthDto extends EmailDto implements Pick<User, 'password'> {
  @IsPassword()
  password!: string;
}
