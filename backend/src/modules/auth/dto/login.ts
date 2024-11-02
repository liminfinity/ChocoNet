import { IsBoolean, IsOptional } from 'class-validator';
import { AuthDto } from './auth';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto extends AuthDto {
  @ApiProperty({
    description: 'Remember me flag, that indicates if user should be remembered',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  rememberMe: boolean = true;
}
