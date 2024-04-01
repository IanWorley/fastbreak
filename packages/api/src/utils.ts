import process from "process";
import { init } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Unit = "ms" | "s" | "m" | "h" | "d"; //* This is for using upstash/ratelimit
type Duration = `${number} ${Unit}` | `${number}${Unit}`; //* This is for using upstash/ratelimit

export const cuid2 = init({
  length: 25,
});

export async function rateLimiter(
  userId: string,
  numRequest: number,
  windowNum: Duration = "10 s",
) {
  if (process.env.NODE_ENV === "production") {
    const ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),

      limiter: Ratelimit.slidingWindow(numRequest, windowNum),
      analytics: false,

      prefix: "@upstash/ratelimit",
    });
    const { success } = await ratelimit.limit(userId);
    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests",
      });
    }
  }
}
