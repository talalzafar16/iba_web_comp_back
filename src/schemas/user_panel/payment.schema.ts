import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from "./user.schema"
import { Item } from "./items.schema"
import { Collection } from './collection.schema';
import { HydratedDocument } from 'mongoose';


export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment extends Document {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    buyer: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    seller: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Item.name, required: true })
    item: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Collection.name, required: true })
    item_collection: Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    currency: string;

    @Prop({ required: true })
    stripeInvoiceId: string;

    @Prop({ default: 'pending', enum: ['pending', 'completed', 'failed'] })
    status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

