import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
const path = require("path")
import * as ffmpeg from 'fluent-ffmpeg';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Item, ItemDocument } from 'src/schemas/user_panel/items.schema';
import { CreateItemDto, UpdateItemDto } from './dtos/request_dtos/item.dto';
import { Collection, CollectionDocument, PlanType } from 'src/schemas/user_panel/collection.schema';
import { FirebaseService } from '../firebase/firebase.service';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_LIMIT } from 'src/constants';
import { Payment, PaymentDocument } from 'src/schemas/user_panel/payment.schema';
import { PaymentStatus } from 'src/payment/dtos/request_dtos/payment.dto';

@Injectable()
export class ItemService {
    constructor(
        @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
        @InjectModel(Collection.name) private readonly collectionModel: Model<CollectionDocument>,
        @InjectModel(Payment.name) private readonly paymenyModel: Model<PaymentDocument>,
        private readonly firebaseService: FirebaseService
    ) { }

    private readonly get_item_path = (collection_id: string, user_id: string, file_name: string, normal: boolean) => `cineverse/videos/${user_id}/${collection_id}/${uuidv4()}_${file_name}_${normal ? "normal" : "watermarked"}/`

    async createItem(file: Express.Multer.File, createItemDto: CreateItemDto, userId: string): Promise<Item> {
        if (!file) throw new NotFoundException('Video file is required');

        const collection = await this.collectionModel.findById(createItemDto.parent_collection);
        if (!collection) throw new NotFoundException('Collection not found');

        if (collection.creator.toString() !== userId) {
            throw new ForbiddenException('You are not allowed to add items to this collection');
        }

        let watermarkedVideoUrl
        if (createItemDto.plan === PlanType.PREMIUM) {

            const tempInputPath = `${uuidv4()}.mp4`;
            const tempOutputPath = `${uuidv4()}.mp4`;

            fs.writeFileSync(tempInputPath, file.buffer)

            await this.addWatermark(tempInputPath, tempOutputPath);

            const path = this.get_item_path(collection._id.toString(), userId, file.filename, false)
            const marked_file = fs.readFileSync(tempOutputPath)
            watermarkedVideoUrl = await this.firebaseService.uploadBuffer(marked_file, path); // Upload video & get URL

            fs.unlinkSync(tempInputPath)
            fs.unlinkSync(tempOutputPath)
        }

        const path = this.get_item_path(collection._id.toString(), userId, file.filename, true)
        const videoUrl = await this.firebaseService.uploadFile(file, path); // Upload video & get URL
        const newItem = new this.itemModel({ ...createItemDto, creator: userId, videoUrl, watermarkedVideoUrl });

        return newItem.save();
    }

    private async addWatermark(filePath: string, outputPath: string) {
        return new Promise((resolve, reject) => {
            new ffmpeg(filePath)
                .videoFilters("drawtext=text='Preview Only':" +
                    "fontfile=/path/to/font.ttf:" + // Provide a bold font file path
                    "fontsize=264:" + // Increase the font size
                    "fontcolor=white:" +
                    "x=(w-text_w)/2:" + // Center horizontally
                    "y=(h-text_h)/2:" + // Center vertically
                    "shadowcolor=black:" + // Add a shadow for visibility
                    "shadowx=2:shadowy=2")
                .output(outputPath)
                .on("end", resolve)
                .on("error", reject)
                .run();
        });
    }

    async getItems(collectionId?: string): Promise<Item[]> {
        const query = collectionId ? { parent_collection: new Types.ObjectId(collectionId) } : {};
        return this.itemModel.find(query).populate('creator', 'name').exec();
    }

    async getPublicItems(page_no: number, user_id: string, collectionId?: string): Promise<any[]> {

        let query;
        if (collectionId) {
            const collection = await this.collectionModel.findById(collectionId);
            if (!collection) throw new NotFoundException('Collection not found');
            if (!collection.isPublic) throw new BadRequestException("Its a private collection")

            query = collectionId ? { parent_collection: new Types.ObjectId(collectionId) } : {};
        } else {
            const collection_ids = (await this.collectionModel.find({ isPublic: true })).map(col => col._id)
            query = { parent_collection: { $in: collection_ids } }
        }
        const skip = (page_no - 1) * DEFAULT_LIMIT
        const items = await this.itemModel.find(query).skip(skip).limit(DEFAULT_LIMIT).populate('creator', 'name').exec();

        let filtered_items = []

        for (const item of items) {
            if (item.plan === PlanType.BASIC) {
                filtered_items.push(item)
            } else {
                if (user_id) {
                    const payment = await this.paymenyModel.findOne({ buyer: new Types.ObjectId(user_id), item: item._id, status: PaymentStatus.COMPLETED })
                    if (payment || (user_id === item?.creator?._id?.toString())) {
                        filtered_items.push(item)
                    } else {
                        const { videoUrl, ...rest } = item.toObject();
                        filtered_items.push(rest)
                    }
                } else {
                    const { videoUrl, ...rest } = item.toObject();
                    filtered_items.push(rest)
                }
            }
        };

        return filtered_items;
    }


    async getItemById(id: string, user_id: string): Promise<Item> {
        const item = await this.itemModel.findById(id).populate('creator', 'name');
        if (!item) throw new NotFoundException('Item not found');
        if (item.creator.toString() !== user_id) throw new BadRequestException("Item not found")
        return item;
    }


    async getMyItemByColId(collectionId: string, user_id: string): Promise<Item[]> {
        const items = await this.itemModel.find({ parent_collection: new Types.ObjectId(collectionId), creator: new Types.ObjectId(user_id) }).populate('creator', 'name');
        return items;
    }

    async getItemByColIdUserId(collectionId: string, user_id: string, access_user_id: string): Promise<any[]> {
        const col = await this.collectionModel.findById(collectionId)
        if (!col.isPublic) throw new BadRequestException("Collection is private")
        const items = await this.itemModel.find({ parent_collection: new Types.ObjectId(collectionId), creator: new Types.ObjectId(user_id) }).populate('creator', 'name');

        let filtered_items = []

        for (const item of items) {
            if (item.plan === PlanType.BASIC) {
                filtered_items.push(item)
            } else {
                if (access_user_id) {
                    const payment = await this.paymenyModel.findOne({ buyer: new Types.ObjectId(user_id), item: item._id, status: PaymentStatus.COMPLETED })
                    if (payment || (access_user_id === item?.creator?._id?.toString())) {
                        filtered_items.push(item)
                    } else {
                        const { videoUrl, ...rest } = item.toObject();
                        filtered_items.push(rest)
                    }
                } else {
                    const { videoUrl, ...rest } = item.toObject();
                    filtered_items.push(rest)
                }
            }
        };

        return filtered_items;

    }


    async findById(id: string): Promise<Item> {
        const item = await this.itemModel.findById(id)
        return item;
    }


    async getItemByIdPublic(id: string, user_id: string | undefined): Promise<any> {
        const item = await this.itemModel.findById(id).populate('creator', 'name');
        if (!item) throw new NotFoundException('Item not found');

        const col = await this.collectionModel.findById(item.parent_collection)
        if (!col.isPublic) throw new BadRequestException("Public item not found")

        if (item.plan === PlanType.BASIC) return item

        if (user_id) {
            const payment = await this.paymenyModel.findOne({ buyer: new Types.ObjectId(user_id), item: item._id, status: PaymentStatus.COMPLETED })
            if (payment || (user_id === item?.creator?._id?.toString())) return item
        }
        const { videoUrl, ...rest } = item.toObject();
        return rest;

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

    async toggleLikeItem(itemId: string, userId: string): Promise<{ message: string }> {
        const item = await this.itemModel.findById(itemId);
        if (!item) throw new NotFoundException('Item not found');

        const userIndex = item.likes.map(u => u.toString()).indexOf(userId);
        if (userIndex === -1) {
            item.likes.push(new Types.ObjectId(userId));
            await item.save();
            return { message: 'Item liked' };
        } else {
            item.likes.splice(userIndex, 1);
            await item.save();
            return { message: 'Item unliked' };
        }
    }

    async incrementDownloads(itemId: string): Promise<{ message: string }> {
        const item = await this.itemModel.findById(itemId);
        if (!item) throw new NotFoundException('item not found');

        item.downloads += 1;
        await item.save();

        return { message: 'Download count updated' };
    }


}

