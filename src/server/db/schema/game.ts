import { relations, sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import type { Shot } from "./shot";
import { team } from "./team";

import { sqliteTable } from "drizzle-orm/sqlite-core";

export const game = sqliteTable("game", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`unixepoch()`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`unixepoch()`),
  teamId: text("team_id").notNull(),
});

export const teamRelations = relations(game, ({ one }) => ({
  team: one(team, {
    fields: [game.teamId],
    references: [team.id],
  }),
}));

export const shotRelations = relations(game, ({ many }) => ({
  shots: many(team),
}));

export const InsertGame = createInsertSchema(game);
export const SelectGame = createSelectSchema(game);
export type Game = z.infer<typeof SelectGame>;

// extend the Game type to include the shots relation for use in the nextjs app page

export interface GameWithRelationsShots extends Game {
  shots: Shot[];
}
