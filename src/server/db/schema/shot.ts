import { relations, sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";

import { type z } from "zod";
import { sqlLiteTable } from "./_table";
import { player } from "./player";

export const shot = sqlLiteTable("shot", {
  id: text("id", { length: 25 }).primaryKey().notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  player_Id: text("player_id", { length: 25 }).notNull(),
  game_Id: text("game_id", { length: 25 }).notNull(),
  points: integer("points").notNull(),
  quarter: integer("quarter").notNull(),
  made: integer("made", { mode: "boolean" }).default(false).notNull(),
  team_Id: text("team_id", { length: 25 }).notNull(),
  xPoint: integer("x_point").notNull(),
  yPoint: integer("y_point").notNull(),
  isFreeThrow: integer("is_free_throw", { mode: "boolean" }).notNull(),
});

export const playerRelations = relations(shot, ({ one }) => ({
  player: one(player, {
    fields: [shot.player_Id],
    references: [player.id],
  }),
}));

export const shotRelations = relations(shot, ({ one }) => ({
  player: one(player, {
    fields: [shot.player_Id],
    references: [player.id],
  }),
}));

export const ShotSelect: z.ZodSchema = createSelectSchema(shot);
export type Shot = z.infer<typeof ShotSelect>;
