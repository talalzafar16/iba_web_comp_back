import { IsString, IsNotEmpty, IsOptional, IsArray, IsMongoId, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlanType } from 'src/schemas/user_panel/collection.schema';

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


    @IsString()
    @IsOptional()
    @IsEnum(PlanType, { each: true })
    plan?: PlanType;


    @IsNumber()
    @IsOptional()
    price?: number
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

    @IsNumber()
    @IsOptional()
    price?: number

    //  @IsString()
    //  @IsOptional()
    //  @IsEnum(PlanType, { each: true })
    //  plan?: PlanType;
}

