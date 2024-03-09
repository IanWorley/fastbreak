import type { z } from "zod";
import { relations, sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";

import { sqlLiteTable } from "./_table";
import { team } from "./team";

export const player = sqlLiteTable("player", {
  id: text("id", { length: 26 }).primaryKey(),
  name: text("name", { length: 256 }).notNull(),
  team_id: text("team_id", { length: 26 }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  archived: integer("archived", { mode: "boolean" }).notNull().default(false),
  jerseyNumber: integer("jersey_number").notNull(),
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
