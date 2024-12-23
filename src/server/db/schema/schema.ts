import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "~/env";

import * as game from "./game";
import * as player from "./player";
import * as shot from "./shot";
import * as team from "./team";

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

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

export const client =
  globalForDb.client ??
  createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });
if (env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema: schema });
