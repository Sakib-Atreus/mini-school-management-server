import { IsOptional, IsString, IsEmail } from "class-validator";
import { Role } from "src/drizzle/schema/users.schema";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password_hash?: string; // will be mapped to passwordHash in service

  @IsOptional()
  role?: Role;
}
