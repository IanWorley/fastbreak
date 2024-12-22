import { relations, sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { sqlLiteTable } from "./_table";
import { game } from "./game";

export const team = sqlLiteTable("team", {
  id: text("id", { length: 26 }).primaryKey(),
  name: text("name", { length: 256 }).notNull(),
  user_id: text("user_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

export const gameRelations = relations(team, ({ many }) => ({
  games: many(game),
}));

export const playerRelations = relations(team, ({ many }) => ({
  players: many(game),
}));

// index the user_id column drizzle orm

export const SelectTeam = createSelectSchema(team);
export type Team = z.infer<typeof SelectTeam>;
