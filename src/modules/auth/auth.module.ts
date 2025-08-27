import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { DrizzleModule } from "../../drizzle/drizzle.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtAccessStrategy } from "./jwt-access.strategy";
import { JwtRefreshStrategy } from "./jwt-refresh.strategy";

@Module({
  imports: [DrizzleModule, JwtModule.register({})],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
