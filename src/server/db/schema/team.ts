import { relations } from "drizzle-orm";
import { text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { sqlLiteTable } from "./_table";
import { game } from "./game";
import { player } from "./player"; // Assuming a 'player' table exists

export const team = sqlLiteTable("team", {
  id: text("id", { length: 26 }).primaryKey(),
  name: text("name", { length: 256 }).notNull(),
  user_id: text("user_id").notNull(), // Adding index
  // createdAt: integer("created_at", { mode: "timestamp" })
  //   .default(sql`(strftime('%s', 'now'))`)
  //   .notNull(),
  // updatedAt: integer("updatedAt", { mode: "timestamp" })
  //   .default(sql`(strftime('%s', 'now'))`)
  //   .notNull(),
});

export const gameRelations = relations(team, ({ many }) => ({
  games: many(game),
}));

// Correcting the playerRelations relation to 'player' table
export const playerRelations = relations(team, ({ many }) => ({
  players: many(player), // Assuming you have a 'player' table
}));

export const SelectTeam = createSelectSchema(team);
export type Team = z.infer<typeof SelectTeam>;
