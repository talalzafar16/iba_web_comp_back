import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Req, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, UpdateItemDto } from './dtos/request_dtos/item.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserPayloadRequest } from 'src/commons/interfaces/user_payload_request.interface';
import { isArray } from 'class-validator';

@ApiTags('Items')
@Controller('items')
export class ItemController {
    constructor(private readonly itemService: ItemService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('video'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Upload an item along with a video file',
        type: CreateItemDto,
    })
    async createItem(
        @UploadedFile() file: Express.Multer.File,
        @Body() createItemDto: CreateItemDto,
        @Req() req: UserPayloadRequest
    ) {
        createItemDto.tags = !isArray(createItemDto) ? (createItemDto.tags as string)?.split(",") : createItemDto.tags
        return this.itemService.createItem(file, createItemDto, req.user['id']);
    }

    @Get("public")
    async getItems(@Query('page_no') page_no: number, @Query('collectionId') collectionId?: string) {
        return this.itemService.getPublicItems(page_no, collectionId);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get(':id')
    async getItemById(@Param('id') id: string, @Req() req: UserPayloadRequest) {
        return this.itemService.getItemById(id, req.user.id);
    }

    @Get(':id/public')
    async getItemByIdPublic(@Param('id') id: string) {
        return this.itemService.getItemByIdPublic(id);
    }


    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Patch(':id')
    async updateItem(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto, @Req() req: UserPayloadRequest) {
        return this.itemService.updateItem(id, updateItemDto, req.user['id']);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteItem(@Param('id') id: string, @Req() req: UserPayloadRequest) {
        return this.itemService.deleteItem(id, req.user['id']);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Patch(':id/like')
    async toggleLikeItem(@Param('id') id: string, @Req() req: UserPayloadRequest) {
        return this.itemService.toggleLikeItem(id, req.user.id);
    }


    @Patch(':id/download')
    async incrementDownloads(@Param('id') id: string) {
        return this.itemService.incrementDownloads(id);
    }
}

