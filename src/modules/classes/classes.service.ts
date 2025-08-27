import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema/schema';
import { DRIZZLE } from '../../drizzle/drizzle.module';

@Injectable()
export class ClassesService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async createClass(name: string, section: string) {
    const [cls] = await this.db
      .insert(schema.classes)
      .values({ name, section })
      .returning();
    return cls;
  }
}
