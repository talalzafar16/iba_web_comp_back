import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

export enum PlanType {
  BASIC = 'basic',
  PREMIUM = 'premium',
}

  export type CollectionDocument = HydratedDocument<Collection>;

@Schema({ timestamps: true })
export class Collection extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  creator: Types.ObjectId;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ required: true })
  videoUrl: string; // Link to the cinematographic video (e.g., S3, CDN, or external source)

  @Prop({ type: Boolean, default: false })
  isPublic: boolean;

  @Prop({ type: Number, default: 0 })
  downloads: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  likes: Types.ObjectId[];

}

export const CollectionSchema = SchemaFactory.createForClass(Collection);

