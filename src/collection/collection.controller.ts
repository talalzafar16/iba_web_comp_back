import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dtos/request_dtos/collection.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserPayloadRequest } from 'src/commons/interfaces/user_payload_request.interface';

@ApiTags('collections')
@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async createCollection(@Body() createDto: CreateCollectionDto, @Req() req: UserPayloadRequest) {
    return this.collectionService.createCollection(createDto, req.user['id']);
  }

  @Get('public')
  async getAllPublicCollections() {
    return this.collectionService.getAllPublicCollections();
  }

  @Get('my')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUserCollections(@Req() req: UserPayloadRequest) {
    return this.collectionService.getUserCollections(req.user['id']);
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
}

