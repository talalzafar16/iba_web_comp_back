import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/requestDtos/signin.dto';
import {
  SendOtpReqDto,
  VerifyEmailByOtpRequest,
} from './dtos/requestDtos/otp_verification.dto';
import { ResetPasswordReqDto } from './dtos/requestDtos/reset_password.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/requestDtos/signup.dto';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('user/signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.userSignIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('user/signup')
  signUp(@Body() signupDto: CreateUserDto) {
    return this.authService.userSignUp(signupDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify_email_by_otp')
  verifyEmailByOtp(@Body() body: VerifyEmailByOtpRequest) {
    return this.authService.verifyEmailByOtp(body.email, body.otp);
  }

  @HttpCode(HttpStatus.OK)
  @Post('forget_password')
  forget_password(@Body() body: SendOtpReqDto) {
    return this.authService.forget_password(body.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('send_otp_for_email_verification')
  send_otp_for_email_verification(@Body() body: SendOtpReqDto) {
    return this.authService.authenticateByOtp(body.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset_password')
  reset_password(@Body() body: ResetPasswordReqDto) {
    return this.authService.reset_password(
      body.email,
      body.password,
      body.confirm_password,
      body.reset_password_token,
    );
  }
}
