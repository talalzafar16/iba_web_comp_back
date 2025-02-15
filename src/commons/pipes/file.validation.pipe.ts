import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SingleFileValidationPipe implements PipeTransform {
  private readonly DEFAULT_SIZE = 1024 * 1024 * 5;

  constructor(
    private readonly format: RegExp,
    private readonly size: number = this.DEFAULT_SIZE,
  ) {}

  transform(value: any) {
    if (!value) return;

    if (value.size > this.size) {
      console.log('executed');
      throw new BadRequestException(`Image too big, max size is ${this.size}`);
    }
    if (!this.format.test(value.mimetype)) {
      throw new BadRequestException(`Only ${this.format} formats are allowed`);
    }

    return value;
  }
}
//
