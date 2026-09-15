import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// profiles — публичные данные пользователя, синкаются через Zero.
// Связь с user.id поддерживается на уровне приложения (Better Auth hook)
// и через FK в БД (см. миграцию). В Drizzle-типах FK не дублируем
// чтобы избежать проблем с drizzle-zero и циклическими зависимостями.
export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
