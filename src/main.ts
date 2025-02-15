import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    const config = new DocumentBuilder()
        .setTitle('IBA HACKATHON')
        .setDescription('The API description')
        .setVersion('1.0')
        .addTag('APIS')
        .addBearerAuth()
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
    app.use('/payment/webhook', express.raw({ type: 'application/json' }));
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
