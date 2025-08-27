import { pgTable, serial, text, integer, index } from "drizzle-orm/pg-core";

export const students = pgTable(
  "students",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").notNull(),
    name: text("name").notNull(),
    age: integer("age").notNull(),
    classId: integer("class_id"),
  },
  (t) => ({
    idIdx: index("students_id_idx").on(t.id),
    classIdx: index("students_class_idx").on(t.classId),
  })
);
