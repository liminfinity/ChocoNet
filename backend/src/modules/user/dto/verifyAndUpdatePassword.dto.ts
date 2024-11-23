import { IsPassword, Match } from '@/modules/auth/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class VerifyAndUpdatePasswordDto {
  @ApiProperty({
    description: 'Old password',
    example: 'password123',
    required: true,
  })
  @IsPassword()
  oldPassword!: string;

  @ApiProperty({
    description: 'New password',
    example: 'password123',
    required: true,
  })
  @IsPassword()
  newPassword!: string;

  @ApiProperty({
    description: 'Confirm new password',
    example: 'password123',
    required: true,
  })
  @Match('newPassword', { message: 'Passwords do not match' })
  confirmPassword!: string;

  @ApiProperty({
    description: 'Logout from other devices',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  logoutFromOtherDevices: boolean = true;
}
