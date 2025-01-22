import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({required: true})
  name: string;

  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({required: true})
  age: number;

  @Prop({required: true})
  country: string;

  @Prop({type: Boolean})
  is_email_verified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

