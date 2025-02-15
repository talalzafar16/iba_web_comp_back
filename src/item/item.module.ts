import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from 'src/schemas/user_panel/items.schema';
import { CollectionSchema, Collection } from 'src/schemas/user_panel/collection.schema';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Collection.name, schema: CollectionSchema }, { name: Item.name, schema: ItemSchema }])],
    controllers: [ItemController],
    providers: [ItemService, JwtService, FirebaseService]
})
export class ItemModule { }
