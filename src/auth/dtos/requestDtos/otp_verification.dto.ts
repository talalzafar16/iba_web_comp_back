// @ts-nocheck
import { OmitType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailByOtpRequest {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class SendOtpReqDto extends OmitType(VerifyEmailByOtpRequest, [
  'otp',
] as const) {}
