import { IsBoolean } from 'class-validator';
import { AuthDto } from './auth';

export class LoginDto extends AuthDto {
  @IsBoolean()
  rememberMe!: boolean;
}
