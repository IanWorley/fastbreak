import { type Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/schema",
  dialect: "turso",

  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  tablesFilter: ["fastbreak_*"],
} satisfies Config;
