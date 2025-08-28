import { Injectable, ConflictException, UnauthorizedException, Inject } from "@nestjs/common";

import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../drizzle/schema/schema";
import { users } from "../../drizzle/schema/users.schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { DRIZZLE } from "../../drizzle/drizzle.module";

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
    private jwt: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.db.query.users.findFirst({
      where: eq(users.email, dto.email),
    });
    if (existing) throw new ConflictException("Email already exists");

    const hash = await bcrypt.hash(dto.password, 10);

    const [user] = await this.db
      .insert(users)
      .values({
        name: dto.name,
        email: dto.email,
        passwordHash: hash,
        role: dto.role,
      })
      .returning();

    return this.signTokens(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, dto.email),
    });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException("Invalid credentials");

    return this.signTokens(user.id, user.email, user.role);
  }

  // Changed userId parameter from number to string (UUID)
  private async signTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET ?? "ACCESS_SECRET",
      expiresIn: "15m",
    });

    const refreshToken = await this.jwt.signAsync(
      { ...payload, tokenType: "refresh" },
      {
        secret: process.env.JWT_REFRESH_SECRET ?? "REFRESH_SECRET",
        expiresIn: "7d",
      },
    );

    const hash = await bcrypt.hash(refreshToken, 10);
    await this.db.update(users).set({ refreshTokenHash: hash }).where(eq(users.id, userId));

    return { accessToken, refreshToken };
  }

  // Changed userId parameter from number to string (UUID)
  async refresh(userId: string, refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException("Invalid token");
    }

    const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!valid) {
      throw new UnauthorizedException("Invalid token");
    }

    return this.signTokens(user.id, user.email, user.role);
  }
}