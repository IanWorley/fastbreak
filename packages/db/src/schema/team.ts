import { sql } from "drizzle-orm";
import { text, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";

export const Team = mySqlTable("team", {
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

// index the user_id column drizzle orm
