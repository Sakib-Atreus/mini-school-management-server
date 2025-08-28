/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  console.log('Starting to seed database...');

  // 1️⃣ Seed classes first
  console.log('Seeding classes...');
  const classIds: string[] = [];
  
  for (let i = 0; i < 5; i++) {
    const [insertedClass] = await db
      .insert(schema.classes)
      .values({
        name: `Class ${i + 1}`,
        section: faker.helpers.arrayElement(['A', 'B', 'C']),
      })
      .returning();
    
    classIds.push(insertedClass.id);
    console.log(`Created class: ${insertedClass.name} - ${insertedClass.section}`);
  }

  // 2️⃣ Seed users and students
  console.log('Seeding users and students...');
  
  for (let i = 0; i < 20; i++) {
    // Insert user first
    const [insertedUser] = await db
      .insert(schema.users)
      .values({
        name: faker.person.firstName() + ' ' + faker.person.lastName(),
        email: faker.internet.email(),
        passwordHash: hashPassword('123456'),
        role: 'student',
      })
      .returning();

    // Insert corresponding student
    await db.insert(schema.students).values({
      user_id: insertedUser.id,
      name: insertedUser.name,
      age: faker.number.int({ min: 10, max: 20 }),
      classId: faker.helpers.arrayElement(classIds),
    });
    
    console.log(`Created student: ${insertedUser.name}`);
  }

  // 3️⃣ Create admin user
  console.log('Creating admin user...');
  const [adminUser] = await db
    .insert(schema.users)
    .values({
      name: 'Admin User',
      email: 'admin@school.com',
      passwordHash: hashPassword('admin123'),
      role: 'admin',
    })
    .returning();
  console.log(`Created admin: ${adminUser.name}`);

  // 4️⃣ Create teacher user
  console.log('Creating teacher user...');
  const [teacherUser] = await db
    .insert(schema.users)
    .values({
      name: 'Teacher User',
      email: 'teacher@school.com',
      passwordHash: hashPassword('teacher123'),
      role: 'teacher',
    })
    .returning();
  console.log(`Created teacher: ${teacherUser.name}`);

  console.log('\n=== SEEDING COMPLETED ===');
  console.log('Test accounts created:');
  console.log('Admin: admin@school.com / admin123');
  console.log('Teacher: teacher@school.com / teacher123');
  console.log('Students: any student email / 123456');
  
}

main()
  .then(() => {
    console.log('Seeding completed successfully!');
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  })
  .finally(() => {
    pool.end();
    process.exit(0);
  });