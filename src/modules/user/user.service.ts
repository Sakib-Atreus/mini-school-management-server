import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { DRIZZLE } from '../../drizzle/drizzle.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  // Create user
  async createUser(dto: {
    name: string;
    email: string;
    password_hash: string;
    role: schema.Role;
  }) {
    // Check if email already exists
    const existingUser = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, dto.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new ConflictException('User with this email already exists');
    }

    const [user] = await this.db
      .insert(schema.users)
      .values({
        name: dto.name,
        email: dto.email,
        passwordHash: dto.password_hash,
        role: dto.role,
      })
      .returning();

    return user;
  }

  // Get all users
  async findAll() {
    return this.db.select().from(schema.users);
  }
}
