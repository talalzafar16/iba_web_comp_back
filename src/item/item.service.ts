import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Item, ItemDocument } from 'src/schemas/user_panel/items.schema';
import { CreateItemDto, UpdateItemDto } from './dtos/request_dtos/item.dto';
import { Collection, CollectionDocument } from 'src/schemas/user_panel/collection.schema';
import { FirebaseService } from '../firebase/firebase.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
    @InjectModel(Collection.name) private readonly collectionModel: Model<CollectionDocument>,
    private readonly firebaseService: FirebaseService
  ) {}

   private readonly get_item_path = (collection_id: string, user_id: string, file_name: string) => `cineverse/videos/${user_id}/${collection_id}/${uuidv4()}_${file_name}/`

  async createItem(file: Express.Multer.File, createItemDto: CreateItemDto, userId: string): Promise<Item> {
    if (!file) throw new NotFoundException('Video file is required');

    const collection = await this.collectionModel.findById(createItemDto.parent_collection);
    if (!collection) throw new NotFoundException('Collection not found');

    if (collection.creator.toString() !== userId) {
      throw new ForbiddenException('You are not allowed to add items to this collection');
    }

    const path  = this.get_item_path(collection._id.toString(), userId, file.filename)
    const videoUrl = await this.firebaseService.uploadFile(file, path); // Upload video & get URL
    const newItem = new this.itemModel({ ...createItemDto, creator: userId, videoUrl });

    return newItem.save();
  }

  async getItems(collectionId?: string): Promise<Item[]> {
    const query = collectionId ? { parent_collection : new Types.ObjectId(collectionId)} : {};
    return this.itemModel.find(query).populate('creator', 'name').exec();
  }

  async getItemById(id: string): Promise<Item> {
    const item = await this.itemModel.findById(id).populate('creator', 'name');
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async updateItem(id: string, updateItemDto: UpdateItemDto, userId: string): Promise<Item> {
    const item = await this.itemModel.findById(id);
    if (!item) throw new NotFoundException('Item not found');

    if (item.creator.toString() !== userId) {
      throw new ForbiddenException('You are not allowed to update this item');
    }

    return this.itemModel.findByIdAndUpdate(id, { $set: updateItemDto }, { new: true, runValidators: true });
  }

  async deleteItem(id: string, userId: string): Promise<{ message: string }> {
    const item = await this.itemModel.findById(id);
    if (!item) throw new NotFoundException('Item not found');

    if (item.creator.toString() !== userId) {
      throw new ForbiddenException('You are not allowed to delete this item');
    }

    await this.itemModel.findByIdAndDelete(id);
    return { message: 'Item deleted successfully' };
  }
}

