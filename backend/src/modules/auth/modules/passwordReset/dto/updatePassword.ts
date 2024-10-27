import { EmailDto } from '@/common/dto';
import { IsPassword } from '@/modules/auth/decorators';
import { IsBoolean, ValidateIf } from 'class-validator';

export class UpdatePasswordDto extends EmailDto {
  @IsPassword()
  newPassword!: string;

  @ValidateIf(
    ({ newPassword, confirmPassword }: UpdatePasswordDto) => newPassword === confirmPassword,
    {
      message: 'Passwords do not match',
    },
  )
  confirmPassword!: string;

  @IsBoolean()
  logoutFromOtherDevices!: boolean;
  
}
