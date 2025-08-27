import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export type RefreshPayload = { sub: number; email: string; role: string; tokenType: "refresh" };

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
      secretOrKey: process.env.JWT_REFRESH_SECRET ?? "REFRESH_SECRET",
    });
  }

  validate(payload: RefreshPayload) {
    if (payload.tokenType !== "refresh") throw new UnauthorizedException("Invalid token");
    return { userId: payload.sub, role: payload.role, email: payload.email };
  }
}
