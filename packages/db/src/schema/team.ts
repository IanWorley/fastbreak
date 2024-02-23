import type { z } from "zod";
import { relations, sql } from "drizzle-orm";
import { text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createSelectSchema } from "drizzle-zod";

import { mySqlTable } from "./_table";
import { game } from "./game";

export const team = mySqlTable("team", {
  id: varchar("id", { length: 26 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  user_id: text("user_id").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),

  //   players: text("players").notNull(),
  //   games: text("games").notNull(),
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
