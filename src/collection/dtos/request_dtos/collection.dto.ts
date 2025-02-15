import { IsString, IsOptional, IsBoolean, IsEnum, IsArray, ArrayMinSize } from 'class-validator';
import { IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export function ParseToBoolean() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  });
}

export function ParseTags() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(",")
    }
    return value
  });
}


export class CreateCollectionDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Video file to upload'
    })


    video: Express.Multer.File
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsArray()
    @ParseTags()
    @IsOptional()
    @ArrayMinSize(1)
    @IsString({ each: true })
    tags?: string[];

    @ParseToBoolean()
    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;


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

}



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

    @ApiProperty({ type: String, description: "Allowed values are ['likes', 'downloads', 'createdAt']" })
    @IsOptional()
    @IsEnum(['likes', 'downloads', 'createdAt'])
    sortBy?: 'likes' | 'downloads' | 'createdAt';

    @ApiProperty({ type: String })
    @ApiProperty({ type: String, description: "Allowed values are ['asc', 'desc']" })
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc';
}

