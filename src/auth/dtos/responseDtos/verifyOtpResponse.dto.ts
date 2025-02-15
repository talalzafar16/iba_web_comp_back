// @ts-nocheck

import { EmailVerificationStatus } from 'src/auth/auth.enums';

export class VerifyEmailByOtpResponse {
  email: string;
  status: EmailVerificationStatus;
  verified: boolean;
  message: string;
  reset_password_token: string;

  constructor(obj: VerifyOtpResponse) {
    Object.assign(this, obj);
  }
}
