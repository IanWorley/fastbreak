import type { z } from "zod";
import { relations, sql } from "drizzle-orm";
import { boolean, int, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createSelectSchema } from "drizzle-zod";

import { mySqlTable } from "./_table";
import { team } from "./team";

export const player = mySqlTable("player", {
  id: varchar("id", { length: 26 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  team_id: varchar("team_id", { length: 26 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
  archived: boolean("archived").default(false).notNull(),
  jerseyNumber: int("jersey_number").notNull(),
});

export const teamRelations = relations(player, ({ one }) => ({
  team: one(team, {
    fields: [player.team_id],
    references: [team.id],
  }),
}));

export const shotRelations = relations(player, ({ many }) => ({
  shots: many(team),
}));

export const SelectPlayer = createSelectSchema(player);
export type Player = z.infer<typeof SelectPlayer>;
