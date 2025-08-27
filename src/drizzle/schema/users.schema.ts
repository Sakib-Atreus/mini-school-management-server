import { pgTable, serial, text, index, timestamp } from "drizzle-orm/pg-core";

export const roles = ["admin", "teacher", "student"] as const;
export type Role = typeof roles[number];

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").$type<Role>().notNull(),
    refreshTokenHash: text("refresh_token_hash"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    idIdx: index("users_id_idx").on(t.id),
    emailIdx: index("users_email_idx").on(t.email),
    roleIdx: index("users_role_idx").on(t.role),
  })
);
