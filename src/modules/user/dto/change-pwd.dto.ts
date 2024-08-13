import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { CustomMatchPassword } from '../../../utils/pwd.validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  currentPassword!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword!: string;

  @IsNotEmpty()
  @IsString()
  @Validate(CustomMatchPassword, ['newPassword'])
  confirmationNewPassword!: string;
}