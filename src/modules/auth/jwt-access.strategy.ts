import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export type JwtPayload = { sub: number; role: string; email: string };

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, "jwt-access") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET ?? "ACCESS_SECRET",
    });
  }

  validate(payload: JwtPayload) {
    return { userId: payload.sub, role: payload.role, email: payload.email };
  }
}
