import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  @IsInt()
  @Min(3)
  @Max(150)
  age: number;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdateUserDtoClient extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {}

export class UpdateUserDtoDB extends PartialType(CreateUserDto) {
  @IsBoolean()
  @IsOptional()
  is_email_verified?: boolean;
}
