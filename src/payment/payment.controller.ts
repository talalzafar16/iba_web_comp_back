import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserPayloadRequest } from 'src/commons/interfaces/user_payload_request.interface';
import { CreateIntentDto, PaymentStatus } from './dtos/request_dtos/payment.dto';
const stripe = require('stripe')('sk_test_51PSfJA02frVP0OxbOEXskPhXI5E7LufVL5U7I8gJBcnlwtQsuDKa8hIlKMizhehsg4PmZWV17Kww81i2TXRXxRPl0026wWnhG5');

@Controller('payment')
export class PaymentController {

    constructor(private paymentService: PaymentService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post('create_intent')
    async createPaymentIntent(@Body() body: CreateIntentDto, @Req() req: UserPayloadRequest) {
        return this.paymentService.createPayementIntent(body.item, req.user.id);
    }


    @Get('get_payment_intent')
    async getPaymentIntent(@Query('id') id: string) {
        return this.paymentService.getPaymentIntent(id);
    }


    @Post('webhook')
    async handleWebhook(@Req() req: Request) {
        const sig = req.headers['stripe-signature'];
        const webhookSecret = "whsec_04296f282601780280f03f1ed84aaf759f54af5d5f17a236e2a06528f520d2f2";

        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } catch (err) {
            return { error: `Webhook Error: ${err.message}` };
        }

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const up = await this.paymentService.updatePayment(paymentIntent.id, PaymentStatus.COMPLETED);
            console.log(up)
        }

        return { received: true };
    }

}
