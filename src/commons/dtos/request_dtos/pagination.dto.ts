//@ts-nocheck
import { Optional } from '@nestjs/common';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginatedDataDto {
  @Min(1)
  @IsInt()
  @Max(Infinity)
  @IsOptional()
  limit?: number;

  @Min(1)
  @IsInt()
  page_no: number;

  constructor(page_no: number, limit?: number) {
    this.limit = limit;
    this.page_no = page_no;
  }
}
