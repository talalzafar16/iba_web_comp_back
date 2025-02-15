import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from 'src/schemas/user_panel/payment.schema';
import { ItemService } from 'src/item/item.service';
import { Item, ItemSchema } from 'src/schemas/user_panel/items.schema';
import { Collection, CollectionSchema } from 'src/schemas/user_panel/collection.schema';
import { FirebaseService } from 'src/firebase/firebase.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema},{ name: Collection.name, schema: CollectionSchema }, { name: Item.name, schema: ItemSchema }])],
  controllers: [PaymentController],
  providers: [PaymentService, ItemService, FirebaseService, JwtService]
})
export class PaymentModule {}
