import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema",
  driver: "turso",

  dbCredentials: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  tablesFilter: ["t3turbo_*"],
  dialect: "sqlite",
} satisfies Config;
