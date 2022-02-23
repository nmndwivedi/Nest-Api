import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AuthDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    gender: number;
}