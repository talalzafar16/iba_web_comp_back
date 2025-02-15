import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NGODocument = HydratedDocument<NGO>;

export enum NGO_TYPES {
    NON_PROFIT = "non-profit",
    CHARITY = "charity",
    FOUNDATION = "foundation",
    TRUST = "trust"
}

@Schema()
export class NGO {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  registration_no: string;

  @Prop({ required: true })
  type: NGO_TYPES;

  @Prop({ required: true })
  purpose: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true, type: Date, default: new Date() })
  created_at: Date;

  @Prop({ required: true })
  phone_number: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  contact_person_name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

}

export const NGOSchema = SchemaFactory.createForClass(NGO);
