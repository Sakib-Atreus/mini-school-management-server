import { pgTable, serial, text, index } from "drizzle-orm/pg-core";

export const classes = pgTable(
  "classes",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    section: text("section").notNull(),
  },
  (t) => ({
    idIdx: index("classes_id_idx").on(t.id),
  })
);
