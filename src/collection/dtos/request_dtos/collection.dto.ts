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

