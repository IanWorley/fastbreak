import type { z } from "zod";
import { relations, sql } from "drizzle-orm";
import { timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { mySqlTable } from "./_table";
import { team } from "./team";

export const game = mySqlTable("game", {
  id: varchar("id", { length: 26 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
  teamId: varchar("teamid", { length: 26 }).notNull(),
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
