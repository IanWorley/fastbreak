import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as game from "./schema/game";
import * as player from "./schema/player";
import * as shot from "./schema/shot";
import * as team from "./schema/team";

export const schema = {
  ...shot,
  ...game,
  ...player,
  ...team,
  ...game.shotRelations,
};

// allow me to export the type of the table
export type gameType = game.Game;
export type playerType = player.Player;
export type shotType = shot.Shot;
export type teamType = team.Team;
export type GameWithRelationsShots = game.GameWithRelationsShots;

export { sqlLiteTable } from "./schema/_table";

export * from "drizzle-orm";

const connection = createClient({
  // Specify the type of the connection object
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(connection, { schema });
