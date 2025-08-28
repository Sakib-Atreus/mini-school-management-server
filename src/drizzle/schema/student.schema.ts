
import { pgTable, uuid, text, integer, index } from "drizzle-orm/pg-core";

export const students = pgTable(
  "students",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id").notNull(),
    name: text("name").notNull(),
    age: integer("age").notNull(),
    classId: uuid("class_id"),
  },
  (t) => ({
    idIdx: index("students_id_idx").on(t.id),
    classIdx: index("students_class_idx").on(t.classId),
  })
);
