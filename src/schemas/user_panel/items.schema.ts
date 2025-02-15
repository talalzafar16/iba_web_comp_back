import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { HydratedDocument } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema({ timestamps: true })
export class Item extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  videoUrl: string; // Link to the cinematographic video (e.g., S3, CDN, or external source)

  @Prop()
  description?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' })
  parent_collection: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  creator: Types.ObjectId; // Reference to the user who uploaded the item

  @Prop({ type: [String] })
  tags: string[]; // Tags like "cinematic", "film noir", "slow motion"

  @Prop({ type: Number, default: 0 })
  views: number; // Number of times the item has been viewed

  @Prop({ type: Number, default: 0 })
  downloads: number; // Number of times the video has been downloaded

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  likes: Types.ObjectId[]; // Users who liked this item
}

export const ItemSchema = SchemaFactory.createForClass(Item);

