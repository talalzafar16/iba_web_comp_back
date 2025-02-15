import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user_panel/user.schema';
import {
  CreateUserDto,
  UpdateUserDtoDB,
} from 'src/auth/dtos/requestDtos/signup.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private user_model: Model<User>) {}

  async create(dto: CreateUserDto) {
    const created_user = new this.user_model(dto);
    return created_user.save();
  }

  async get_all_users() {
    return this.user_model.find().exec();
  }

  async get_one_user_by_email(email: string) {
    return this.user_model.findOne({ email }).exec();
  }

  async update_one_by_email(email: string, dto: UpdateUserDtoDB) {
    return this.user_model.updateOne({ email }, dto).exec();
  }
}
