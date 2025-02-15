import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user_panel/user.schema';
import {
  CreateUserDto,
  UpdateUserDto,
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

  async find_by_id(id: string): Promise<User | null> {
    return this.user_model.findById(id).exec();
  }

  async update_one_by_email(email: string, dto: UpdateUserDto | UpdateUserDtoDB) {
    return this.user_model.updateOne({ email }, dto).exec();
  }

  async update_one_by_id(id: string, dto: UpdateUserDto | UpdateUserDtoDB) {
    const res = await this.user_model.updateOne({ _id: new Types.ObjectId(id)}, dto).exec();
    console.log(res, id, dto)
    return res
  }

  async deleteUser(id: string): Promise<User | null> {
    return this.user_model.findByIdAndDelete(id).exec();
  }

}
