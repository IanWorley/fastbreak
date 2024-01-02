import { TRPCError, initTRPC } from "@trpc/server";
import Prisma from "@/src/lib/PrismaClient";
import { currentUser } from "@clerk/nextjs";

//* Create TRPC Context here
const t = initTRPC.context<typeof createTRPCContext>().create();

export const createTRPCContext = () => {
  return {
    db: Prisma,
  };
};

//* Define Middleware here for authentication

const isAuthed = t.middleware(async ({ next }) => {
  const user = await currentUser();

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }

  return next({
    ctx: {
      user,
    },
  });
});

//* Define router and types of procedures here
export const router = t.router;
export const publicProcedure = t.procedure;
// This means create a procedure that is protected by the isAuthed middleware
export const protectedProcedure = t.procedure.use(isAuthed);
