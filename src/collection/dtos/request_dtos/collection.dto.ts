import { IsString, IsOptional, IsBoolean, IsEnum, IsArray, ArrayMinSize, IsMongoId } from 'class-validator';
import { Transform } from 'class-transformer';

export enum PlanType {
  BASIC = 'basic',
  PREMIUM = 'premium',
}

// DTO for Creating a Collection
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

  @IsArray()
  @IsOptional()
  @IsEnum(PlanType, { each: true })
  plan?: PlanType[];
}

// DTO for Updating a Collection
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

  @IsArray()
  @IsOptional()
  @IsEnum(PlanType, { each: true })
  plan?: PlanType[];
}

// DTO for Response Transformation
export class CollectionResponseDto {
  @Transform(({ value }) => value.toString())
  _id: string;

  title: string;
  description?: string;
  tags?: string[];
  isPublic: boolean;
  plan?: PlanType[];
}

