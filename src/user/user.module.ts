import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from 'src/schemas/user_panel/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, JwtService],
  controllers: [UserController],
})
export class UserModule {}
