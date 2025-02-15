import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User, UserSchema } from './schemas/user_panel/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NgoController } from './ngo/ngo.controller';
import { NgoModule } from './ngo/ngo.module';

@Module({
    imports: [
        MongooseModule.forRoot(
            'mongodb+srv://nomansiddique12424:bigetron123@cluster0.efzjjpk.mongodb.net/?retryWrites=true&w=majority',
        ),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                console.log(configService.get("JWT_SECRET"))
                return {
                    secret: configService.get<string>('JWT_SECRET'),
                }
            },
        }),
        ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        AuthModule,
        NotificationsModule,
        UserModule,
        NgoModule,
    ],
    controllers: [AppController, AuthController, NgoController],
    providers: [
        AppService,
        NotificationsService,
        AuthService,
        UserService,
        JwtService,
    ],
})
export class AppModule { }
