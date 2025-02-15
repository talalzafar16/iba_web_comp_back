import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Collection } from 'src/schemas/user_panel/collection.schema';
import { CreateCollectionDto, UpdateCollectionDto } from './dtos/request_dtos/collection.dto';

@Injectable()
export class CollectionService {
  constructor(@InjectModel(Collection.name) private collectionModel: Model<Collection>) {}

  async createCollection(createDto: CreateCollectionDto, userId: string): Promise<Collection> {
    const newCollection = new this.collectionModel({ ...createDto, creator: new Types.ObjectId(userId) });
    return newCollection.save();
  }

  async getAllPublicCollections(): Promise<Collection[]> {
    return this.collectionModel.find({ isPublic: true }).populate('creator', 'name').exec();
  }

  async getUserCollections(userId: string): Promise<Collection[]> {
    return this.collectionModel.find({ creator: new Types.ObjectId(userId)}).exec();
  }

  async getCollectionById(id: string, userId: string): Promise<Collection> {
    const collection = await this.collectionModel.findById(id).exec();
    if (!collection) throw new NotFoundException('Collection not found');

    if (!collection.isPublic && collection.creator.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return collection;
  }

  async updateCollection(id: string, updateDto: UpdateCollectionDto, userId: string): Promise<Collection> {
    const collection = await this.collectionModel.findById(id).exec();
    if (!collection) throw new NotFoundException('Collection not found');

    if (collection.creator.toString() !== userId) {
      throw new ForbiddenException('You are not the owner of this collection');
    }

    Object.assign(collection, updateDto);
    return collection.save();
  }

  async deleteCollection(id: string, userId: string): Promise<void> {
    const collection = await this.collectionModel.findById(id).exec();
    if (!collection) throw new NotFoundException('Collection not found');

    if (collection.creator.toString() !== userId) {
      throw new ForbiddenException('You are not the owner of this collection');
    }

    await collection.deleteOne();
  }
}

