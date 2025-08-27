import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn } from "class-validator";
import { roles } from "../../../drizzle/schema/users.schema";

export class SignupDto {
  @IsNotEmpty() @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsIn(roles)
  role: (typeof roles)[number];
}
