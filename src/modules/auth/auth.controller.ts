import { Body, Controller, Post, UseGuards, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { Request } from "express";
import { RefreshGuard } from "./jwt-refresh.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(RefreshGuard)
  @Post("refresh")
  async refresh(@Req() req: Request, @Body("refreshToken") refreshToken: string) {
    const user = req.user as { userId: number; email: string; role: string };
    return this.authService.refresh(user.userId, refreshToken);
  }
}
