export type ResetPasswordPayload = {
  email: string;
  allow_reset: boolean;
  time: Date;
};
