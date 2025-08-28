import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema/schema';
import { eq, and } from 'drizzle-orm';
import { DRIZZLE } from '../../drizzle/drizzle.module';
import { EnrollStudentDto } from './dto/enroll-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>
  ) {}

  async enrollUserInClass(classId: string, enrollStudentDto: EnrollStudentDto) {
    const { userId, age } = enrollStudentDto;

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
      // Check if user is already enrolled in this specific class
      const [duplicateEnrollment] = await this.db
        .select()
        .from(schema.students)
        .where(and(
          eq(schema.students.user_id, userId),
          eq(schema.students.classId, classId)
        ))
        .limit(1);

      if (duplicateEnrollment) {
        throw new ConflictException(`${user.name} is already enrolled in class ${cls.name}`);
      }

      await this.db.insert(schema.students).values({
        user_id: user.id,
        name: user.name,
        age: age,
        classId: classId,
      });
    } else {
      // Check if trying to enroll in the same class again
      if (existingStudent.classId === classId) {
        throw new ConflictException(`${user.name} is already enrolled in class ${cls.name}`);
      }

      await this.db
        .update(schema.students)
        .set({ 
          classId: classId,
          age: age
        })
        .where(eq(schema.students.user_id, userId));
    }

    await this.db
      .update(schema.users)
      .set({ role: 'student' as schema.Role })
      .where(eq(schema.users.id, userId));

    return { message: `${user.name} (age ${age}) enrolled in class ${cls.name}` };
  }

  async getStudentsByClass(classId: string) {
    return this.db
      .select()
      .from(schema.students)
      .where(eq(schema.students.classId, classId));
  }
}