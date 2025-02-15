import { IsString, IsNotEmpty, IsOptional, IsArray, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  parent_collection: string; // Must belong to a collection

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: "bhai send comma seperated strings, or a array of string"
  })
  @IsOptional()
  @IsString()
  tags?: string | string[]; // Example: ["cinematic", "film-noir"]

  @ApiProperty({ 
    type: 'string', 
    format: 'binary', 
    description: 'Video file to upload' 
  })
  video: Express.Multer.File
}

export class UpdateItemDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}

