import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema/schema';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../drizzle/drizzle.module';

@Injectable()
export class StudentsService {
  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>
  ) {}

  async enrollUserInClass(userId: number, classId: number) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId));
    if (!user) throw new NotFoundException('User not found');

    const [cls] = await this.db
      .select()
      .from(schema.classes)
      .where(eq(schema.classes.id, classId));
    if (!cls) throw new NotFoundException('Class not found');

    const [existingStudent] = await this.db
      .select()
      .from(schema.students)
      .where(eq(schema.students.user_id, userId));
    if (!existingStudent) {
      await this.db.insert(schema.students).values({
        user_id: user.id,
        name: user.name,
        age: 0,
        classId: classId,
      });
    } else {
      await this.db
        .update(schema.students)
        .set({ classId: classId })
        .where(eq(schema.students.user_id, userId));
    }

    await this.db
      .update(schema.users)
      .set({ role: 'student' as schema.Role })
      .where(eq(schema.users.id, userId));

    return { message: `${user.name} enrolled in class ${cls.name}` };
  }

  async getStudentsByClass(classId: number) {
    return this.db
      .select()
      .from(schema.students)
      .where(eq(schema.students.classId, classId));
  }
}
