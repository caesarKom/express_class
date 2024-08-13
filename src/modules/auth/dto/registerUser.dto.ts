import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
  
  @IsString()
  @IsOptional()
  image!: string;
}
