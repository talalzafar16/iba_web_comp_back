import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from 'src/auth/dtos/requestDtos/signup.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserPayloadRequest } from 'src/commons/interfaces/user_payload_request.interface';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async get_all_users() {
    return this.userService.get_all_users();
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getUserById(@Req() req: UserPayloadRequest) {
    return this.userService.find_by_id(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Put('me')
  async updateUser(@Req() req: UserPayloadRequest ,@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update_one_by_id(req.user.id , updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}

