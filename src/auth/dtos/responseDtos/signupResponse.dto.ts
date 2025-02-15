import { UserResponseDto } from './userResponse.dto';
import { GetOtpResponseDto } from './getOtpResponse.dto';

export class SignUpResponseDto {
  user: UserResponseDto;
  otp_res: GetOtpResponseDto;

  constructor(obj: SignUpResponseDto) {
    this.user = obj.user;
    this.otp_res = obj.otp_res;
  }
}
