import process from "process";
import { init } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const cuid2 = init({
  length: 25,
});
export async function rateLimiter(userId: string, numRequest: number) {
  if (process.env.NODE_ENV === "production") {
    const ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(numRequest, "10 s"),
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
