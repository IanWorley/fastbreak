import type { z } from "zod";
import { relations, sql } from "drizzle-orm";
import { boolean, int, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createSelectSchema } from "drizzle-zod";

import { mySqlTable } from "./_table";
import { player } from "./player";

export const shot = mySqlTable("shot", {
  id: varchar("id", { length: 25 }).primaryKey().notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow()
    .notNull(),
  player_Id: varchar("player_id", { length: 25 }).notNull(),
  game_Id: varchar("game_id", { length: 25 }).notNull(),
  points: int("points").notNull(),
  made: boolean("made").notNull(),
  team_Id: varchar("team_id", { length: 25 }).notNull(),
  xPoint: int("x_point").notNull(),
  yPoint: int("y_point").notNull(),
  isFreeThrow: boolean("is_free_throw").notNull(),
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

export const ShotSelect = createSelectSchema(shot);
export type Shot = z.infer<typeof ShotSelect>;
