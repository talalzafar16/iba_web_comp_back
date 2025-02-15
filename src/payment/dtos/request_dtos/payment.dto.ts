import { IsMongoId, IsNotEmpty, IsNumber, IsString, IsIn } from 'class-validator';

export class CreatePaymentDto {
  @IsMongoId()
  @IsNotEmpty()
  buyer: string;

  @IsMongoId()
  @IsNotEmpty()
  seller: string;

  @IsMongoId()
  @IsNotEmpty()
  item: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  stripeInvoiceId: string;

  @IsString()
  @IsIn(['pending', 'completed', 'failed'])
  status: string;
}

export class UpdatePaymentDto {
  @IsString()
  @IsIn(['pending', 'completed', 'failed'])
  status: string;
}

