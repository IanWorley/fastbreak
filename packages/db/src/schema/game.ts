import type { z } from "zod";
import { relations, sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import type { Shot } from "./shot";
import { sqlLiteTable } from "./_table";
import { team } from "./team";

export const game = sqlLiteTable("game", {
  id: text("id", { length: 26 }).primaryKey(),
  name: text("name", { length: 256 }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  teamId: text("teamid", { length: 26 }).notNull(),
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
