import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from 'src/schemas/user_panel/collection.schema';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Collection.name, schema: CollectionSchema }])],
    controllers: [CollectionController],
    providers: [CollectionService, JwtService, FirebaseService],
})
export class CollectionModule { }
