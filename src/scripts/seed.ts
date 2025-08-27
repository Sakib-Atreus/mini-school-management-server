/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../drizzle/schema/schema';
import 'dotenv/config';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;

// Helper to hash password
const hashPassword = (password: string) => bcrypt.hashSync(password, 10);

async function main() {
  // 1️⃣ Seed some classes
  const classIds: number[] = [];
  for (let i = 0; i < 5; i++) {
    const insertedClass = await db
      .insert(schema.classes)
      .values({
        name: `Class ${i + 1}`,
        section: faker.helpers.arrayElement(['A', 'B', 'C']),
      })
      .returning();

    classIds.push(insertedClass[0].id);
  }

  // 2️⃣ Seed users & students
  const userIds: number[] = [];
  for (let i = 0; i < 20; i++) {
    const role = 'student'; 
    const insertedUser = await db
      .insert(schema.users)
      .values({
        name: faker.person.firstName() + ' ' + faker.person.lastName(),
        email: faker.internet.email(),
        passwordHash: hashPassword('123456'),
        role: role,
      })
      .returning();

    const userId = insertedUser[0].id as number;
    userIds.push(userId);

    // Insert student linked to user and random class
    await db.insert(schema.students).values({
      user_id: userId, 
      name: insertedUser[0].name,
      age: faker.number.int({ min: 10, max: 20 }),
      classId: faker.helpers.arrayElement(classIds),
    });
  }

  console.log('✅ Dummy data seeded successfully');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
