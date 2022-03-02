import { IsOptional, IsString } from 'class-validator';

export class EditUserDTO {
    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    email?: string;
}