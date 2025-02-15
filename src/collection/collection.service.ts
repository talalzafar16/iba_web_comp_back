import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Collection } from 'src/schemas/user_panel/collection.schema';
import { CreateCollectionDto, UpdateCollectionDto } from './dtos/request_dtos/collection.dto';
import { DEFAULT_LIMIT } from 'src/constants';

@Injectable()
export class CollectionService {
    constructor(@InjectModel(Collection.name) private collectionModel: Model<Collection>) { }

    async createCollection(createDto: CreateCollectionDto, userId: string): Promise<Collection> {
        const newCollection = new this.collectionModel({ ...createDto, creator: new Types.ObjectId(userId) });
        return newCollection.save();
    }

    async getAllPublicCollections(
        page_no: number,
        search?: string,
        tags?: string[],
        sortBy?: 'likes' | 'downloads' | 'createdAt',
        sortOrder: 'asc' | 'desc' = 'desc',
    ): Promise<Collection[]> {
        const filter: any = { isPublic: true };
        const skip = (page_no - 1) * DEFAULT_LIMIT

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { tags: { $in: [search] } },
            ];
        }

        if (tags && tags.length > 0) {
            filter.tags = { $in: tags };
        }

        const sortOptions: any = {};
        if (sortBy) {
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        } else {
            sortOptions['createdAt'] = -1;
        }

        return this.collectionModel.find(filter).sort(sortOptions).skip(skip).limit(DEFAULT_LIMIT).populate('creator', 'name email profileImage').exec();
    }


    async getUserCollections(userId: string, page_no: number): Promise<Collection[]> {
        const skip = (page_no - 1) * DEFAULT_LIMIT
        return this.collectionModel.find({ creator: new Types.ObjectId(userId) }).skip(skip).limit(DEFAULT_LIMIT).exec();
    }


    async getCollectionByIdPublic(id: string): Promise<Collection> {
        const collection = await this.collectionModel.findById(id).exec();
        if (!collection) throw new NotFoundException('Collection not found');
        if (collection.isPublic === false) throw new BadRequestException("Not found")

        return collection;
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

    async toggleLikeCollection(collectionId: string, userId: string): Promise<{ message: string }> {
        const collection = await this.collectionModel.findById(collectionId);
        if (!collection) throw new NotFoundException('Collection not found');

        const likeIndex = collection.likes.map(u => u.toString()).indexOf(userId);

        if (likeIndex === -1) {
            // User has not liked it yet → Add like
            collection.likes.push(new Types.ObjectId(userId));
        } else {
            // User already liked it → Remove like
            collection.likes.splice(likeIndex, 1);
        }

        await collection.save();

        return { message: likeIndex === -1 ? 'Collection liked' : 'Like removed' };
    }

    async incrementDownloads(collectionId: string): Promise<{ message: string }> {
        const collection = await this.collectionModel.findById(collectionId);
        if (!collection) throw new NotFoundException('Collection not found');
        if (!collection.isPublic) throw new BadRequestException("Cant download private collection!")

        collection.downloads += 1; // Increment downloads count
        await collection.save();

        return { message: 'Download count updated' };
    }


}

