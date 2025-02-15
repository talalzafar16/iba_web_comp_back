import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsNotEmpty()
    @IsInt()
    @Min(3)
    @Max(150)
    age: number;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class UpdateUserDtoClient extends PartialType(
    OmitType(CreateUserDto, ['password'] as const),
) { }

export class UpdateUserDtoDB extends PartialType(CreateUserDto) {
    @IsBoolean()
    @IsOptional()
    is_email_verified?: boolean;
}

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsInt()
    @IsOptional()
    age?: number;

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsOptional()
    profileImage?: string;


    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    website?: string;

    @IsString()
    @IsOptional()
    location?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    skills?: string[];
}
