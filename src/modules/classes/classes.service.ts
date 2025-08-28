import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import * as schema from '../../drizzle/schema/schema';
import { DRIZZLE } from '../../drizzle/drizzle.module';

@Injectable()
export class ClassesService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async createClass(name: string, section: string) {
    // Check if class with same name and section already exists
    const existingClass = await this.db
      .select()
      .from(schema.classes)
      .where(and(
        eq(schema.classes.name, name),
        eq(schema.classes.section, section)
      ))
      .limit(1);

    if (existingClass.length > 0) {
      throw new ConflictException(`Class "${name} - Section ${section}" already exists`);
    }

    const [cls] = await this.db
      .insert(schema.classes)
      .values({ name, section })
      .returning();
    
    return cls;
  }
}