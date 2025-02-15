// @ts-nocheck
export class ErrorResDto {
  success: boolean;
  message: string;
  status_code: string;

  constructor(obj: SuccessResDto) {
    Object.assign(this, obj);
  }
}
