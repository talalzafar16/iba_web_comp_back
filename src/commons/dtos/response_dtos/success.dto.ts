// @ts-nocheck
export class SuccessResDto {
  success: boolean;
  message: string;

  constructor(obj: SuccessResDto) {
    Object.assign(this, obj);
  }
}
