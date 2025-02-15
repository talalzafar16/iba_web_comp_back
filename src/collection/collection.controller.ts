import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Req, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto, GetPublicCollectionsDto, UpdateCollectionDto } from './dtos/request_dtos/collection.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UserPayloadRequest } from 'src/commons/interfaces/user_payload_request.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('collections')
@Controller('collections')
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) { }

    @Post()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('video'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Upload an collection along with a video file',
        type: CreateCollectionDto,
    })
    async createCollection(@Body() createDto: CreateCollectionDto, @Req() req: UserPayloadRequest
        ,@UploadedFile() file: Express.Multer.File,
                          ) {
        return this.collectionService.createCollection(createDto, req.user['id'], file);
    }

    @Get('/public')
    async getPublicCollections(@Query() query: GetPublicCollectionsDto) {
        const { page_no, search, tags, sortBy, sortOrder } = query;
        const tagArray = tags ? tags.split(',') : [];
        return this.collectionService.getAllPublicCollections(page_no, search, tagArray, sortBy, sortOrder);
    }


    @Get('my')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async getUserCollections(@Req() req: UserPayloadRequest, @Query('page_no') page_no: number) {
        return this.collectionService.getUserCollections(req.user['id'], page_no);
    }


    @Get(':id/public')
    async getCollectionByIdPublic(@Param('id') id: string) {
        return this.collectionService.getCollectionByIdPublic(id);
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async getCollectionById(@Param('id') id: string, @Req() req: UserPayloadRequest) {
        return this.collectionService.getCollectionById(id, req.user['id']);
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async updateCollection(@Param('id') id: string, @Body() updateDto: UpdateCollectionDto, @Req() req: UserPayloadRequest) {
        return this.collectionService.updateCollection(id, updateDto, req.user['id']);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async deleteCollection(@Param('id') id: string, @Req() req: UserPayloadRequest) {
        return this.collectionService.deleteCollection(id, req.user['id']);
    }

    @ApiBearerAuth()
    @Patch(':id/like')
    @UseGuards(AuthGuard) // Ensure only authenticated users can like/unlike
    async toggleLike(@Param('id') id: string, @Req() req: UserPayloadRequest) {
        return this.collectionService.toggleLikeCollection(id, req.user.id);
    }

    @Patch(':id/increment_download')
    async incrementDownloads(@Param('id') id: string) {
        return this.collectionService.incrementDownloads(id);
    }


}

