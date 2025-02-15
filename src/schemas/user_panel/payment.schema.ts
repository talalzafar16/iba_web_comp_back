import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from "./user.schema"
import { Item } from "./items.schema"

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  buyer: Types.ObjectId; // User who purchased

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  seller: Types.ObjectId; // Owner of the item

  @Prop({ type: Types.ObjectId, ref: Item.name, required: true })
  item: Types.ObjectId; // Purchased item

  @Prop({ required: true })
  amount: number; // Payment amount

  @Prop({ required: true })
  currency: string; // Currency (e.g., USD)

  @Prop({ required: true })
  stripeInvoiceId: string; // Stripe Invoice ID

  @Prop({ default: 'pending', enum: ['pending', 'completed', 'failed'] })
  status: string; // Payment status
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

