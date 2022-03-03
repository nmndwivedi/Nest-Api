import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class BookmarkDTO {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsOptional()
    description: string;
}

export class EditBookmarkDTO {
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    url: string;

    @IsString()
    @IsOptional()
    description: string;
}