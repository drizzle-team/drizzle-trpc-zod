import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod/pg";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  projectRole: text<"admin" | "user">("role"),
});

export const apiUser = createInsertSchema(users, {
  projectRole: z.enum(["admin", "user"]),
});
export const apiCreateUser = apiUser.omit({ id: true })
