import { IsEmail, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Role, roles } from 'src/drizzle/schema/users.schema';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(roles)
  role?: Role;
}