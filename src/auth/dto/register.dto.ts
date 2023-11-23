import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
   @Transform(({ value }) => value.trim())
   @IsString()
   @MinLength(2)
   name: string;

   @Transform(({ value }) => value.trim())
   @IsString()
   @MinLength(6)
   password: string;

   @IsEmail()
   @IsString()
   email: string;
}