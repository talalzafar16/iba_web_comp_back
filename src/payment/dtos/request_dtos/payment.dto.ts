import { IsMongoId, IsNotEmpty, IsNumber, IsString, IsIn } from 'class-validator';
import { Types } from 'mongoose';

export enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed"
}


export class CreateIntentDto {
    @IsMongoId()
    @IsNotEmpty()
    item: string

}

export class CreatePaymentDto {
    @IsMongoId()
    @IsNotEmpty()
    buyer: string | Types.ObjectId;

    @IsMongoId()
    @IsNotEmpty()
    seller: string | Types.ObjectId;

    @IsMongoId()
    @IsNotEmpty()
    item: string | Types.ObjectId;

    @IsMongoId()
    @IsNotEmpty()
    item_collection: Types.ObjectId;

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
    status: PaymentStatus;

}

export class UpdatePaymentDto {
    @IsString()
    @IsIn(['pending', 'completed', 'failed'])
    status: PaymentStatus;
}

