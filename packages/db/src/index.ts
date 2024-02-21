import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as game from "./schema/game";
import * as player from "./schema/player";
import * as post from "./schema/post";
import * as shot from "./schema/shot";
import * as team from "./schema/team";

export const schema = { ...post, ...shot, ...game, ...player, ...team };

export { mySqlTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

const connection = connect({
  host: process.env.DB_HOST!,
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
});

export const db = drizzle(connection, { schema });
