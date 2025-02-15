import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateWriteOpResult } from 'mongoose';
import { Payment } from 'src/schemas/user_panel/payment.schema';
import { CreatePaymentDto, PaymentStatus, UpdatePaymentDto } from './dtos/request_dtos/payment.dto';
import { ItemService } from 'src/item/item.service';
const stripe = require('stripe')('sk_test_51PSfJA02frVP0OxbOEXskPhXI5E7LufVL5U7I8gJBcnlwtQsuDKa8hIlKMizhehsg4PmZWV17Kww81i2TXRXxRPl0026wWnhG5');

@Injectable()
export class PaymentService {
    constructor(@InjectModel(Payment.name) private paymentModel: Model<Payment>, private itemService: ItemService) { }

    async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
        const payment = new this.paymentModel(createPaymentDto);
        return payment.save();
    }

    async getPayments(filter: Record<string, any> = {}): Promise<Payment[]> {
        return this.paymentModel.find(filter).populate('buyer seller item').exec();
    }

    async getPaymentById(id: string): Promise<Payment> {
        const payment = await this.paymentModel.findById(id).populate('buyer seller item');
        if (!payment) throw new NotFoundException('Payment not found');
        return payment;
    }

    async updatePayment(stripe_pid: string, status: PaymentStatus): Promise<UpdateWriteOpResult> {
        const payment = await this.paymentModel.updateOne({stripeInvoiceId: stripe_pid}, { status }, { new: true });
        if (!payment) throw new NotFoundException('Payment not found');
        return payment;
    }

    async deletePayment(id: string): Promise<{ message: string }> {
        const result = await this.paymentModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException('Payment not found');
        return { message: 'Payment deleted successfully' };
    }

    async createPayementIntent(item_id: string, user_id:string) {

        try {
        
            const item = await this.itemService.findById(item_id)
            if (!item) throw new BadRequestException("item not found")

            const paymentIntent = await stripe.paymentIntents.create({
                amount: item.price,
                currency: 'usd',
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            const payment : CreatePaymentDto = {
                buyer: new Types.ObjectId(user_id),
                seller : item.creator,
                amount : item.price,
                item: item._id as Types.ObjectId,
                currency: "usd",
                status: PaymentStatus.PENDING,
                stripeInvoiceId: paymentIntent.id,
                item_collection: item.parent_collection
            } 

            await this.createPayment(payment)

            return paymentIntent
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException(e)
        }

    }

    async getPaymentIntent(paymentIntentId: string) {
        try {
            return await stripe.paymentIntents.retrieve(paymentIntentId);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

}

