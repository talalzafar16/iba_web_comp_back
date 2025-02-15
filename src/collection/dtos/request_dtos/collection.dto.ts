import { IsString, IsOptional, IsBoolean, IsEnum, IsArray, ArrayMinSize, IsMongoId } from 'class-validator';
import { PlanType } from 'src/schemas/user_panel/collection.schema';

export class CreateCollectionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @IsString({ each: true })
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsString()
  @IsOptional()
  @IsEnum(PlanType, { each: true })
  plan?: PlanType;
}

export class UpdateCollectionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsString()
  @IsOptional()
  @IsEnum(PlanType, { each: true })
  plan?: PlanType;
}


import { IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetPublicCollectionsDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  page_no: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  tags?: string; // Comma-separated string (e.g., "cinematic,drama")

  @ApiProperty({ type : String , description:"Allowed values are ['likes', 'downloads', 'createdAt']"})
  @IsOptional()
  @IsEnum(['likes', 'downloads', 'createdAt'])
  sortBy?: 'likes' | 'downloads' | 'createdAt';

  @ApiProperty({ type : String })
  @ApiProperty({ type : String , description:"Allowed values are ['asc', 'desc']"})
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}

