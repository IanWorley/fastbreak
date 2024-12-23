import { relations } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import { type z } from "zod";
import { sqlLiteTable } from "./_table";
import { player } from "./player";

// Define the 'shot' table
export const shot = sqlLiteTable("shot", {
  id: text("id", { length: 25 }).primaryKey().notNull(),
  // createdAt: integer("created_at", { mode: "timestamp" })
  //   .default(sql`(strftime('%s', 'now'))`)
  //   .notNull(),
  // updatedAt: integer("updatedAt", { mode: "timestamp" })
  //   .default(sql`(strftime('%s', 'now'))`)
  //   .notNull(),
  player_Id: text("player_id", { length: 25 }).notNull(), // Indexed field
  game_Id: text("game_id", { length: 25 }).notNull(), // Indexed field
  points: integer("points").notNull(),
  quarter: integer("quarter").notNull(),
  made: integer("made", { mode: "boolean" }).default(true).notNull(), // Boolean field
  team_Id: text("team_id", { length: 25 }).notNull(), // Indexed field
  xPoint: integer("x_point").notNull(),
  yPoint: integer("y_point").notNull(),
  isFreeThrow: integer("is_free_throw", { mode: "boolean" }).notNull(), // Boolean field
});

// Relation between shot and player
export const playerRelations = relations(shot, ({ one }) => ({
  player: one(player, {
    fields: [shot.player_Id],
    references: [player.id],
  }),
}));

// Create select schema for 'shot' table
export const ShotSelect = createSelectSchema(shot);
export type Shot = z.infer<typeof ShotSelect>;
