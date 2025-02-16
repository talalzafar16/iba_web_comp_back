import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from 'src/auth/dtos/requestDtos/signup.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserPayloadRequest } from 'src/commons/interfaces/user_payload_request.interface';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async get_all_users() {
        return this.userService.get_all_users();
    }


    @Get("cinematographers")
    async get_all_cine() {
        return this.userService.get_all_cinematographers();
    }


    @Get("get_one_by_id")
    async get_user_by_id(@Query("user_id") id: string) {
        return this.userService.find_by_id(id);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('me')
    async getUserById(@Req() req: UserPayloadRequest) {
        return this.userService.find_by_id(req.user.id);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Put('me')
    async updateUser(@Req() req: UserPayloadRequest, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update_one_by_id(req.user.id, updateUserDto);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }
}

