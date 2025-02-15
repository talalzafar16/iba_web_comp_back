// @ts-nocheck

export class GetOtpResponseDto {
  email: string;
  expires_in: number;
  created_at: Date;

  constructor(obj: OtpResponseDto) {
    (this.email = obj.email), (this.expires_in = obj.expires_in);
    this.created_at = obj.created_at;
  }
}
