import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true, type: Date, default: new Date() })
  created_at: Date;

  @Prop({ type: Boolean , default: false, required: true })
  is_email_verified: boolean;

  @Prop({ type: String, default: '' })
  profileImage: string;

  @Prop({ type: String, maxlength: 500 })
  bio: string;

  @Prop({ type: String })
  website: string;

  @Prop({ type: String })
  location: string;

  @Prop({ type: [String] })
  skills: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
