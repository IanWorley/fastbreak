# Fastbreak Analytics (TanStack Start)

This project has been migrated from Next.js (T3 Stack) to [TanStack Start](https://tanstack.com/start).

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start)
- **Routing:** [TanStack Router](https://tanstack.com/router)
- **API Layer:** [tRPC](https://trpc.io) (mounted on `/api/trpc`)
- **Database:** [Drizzle ORM](https://orm.drizzle.team) + [Turso](https://turso.tech)
- **Auth:** [Clerk](https://clerk.com) (via `@clerk/tanstack-start`)
- **State Management:** [TanStack Query](https://tanstack.com/query) + [Zustand](https://zustand-demo.pmnd.rs/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) + [Radix UI](https://www.radix-ui.com/)

## Getting Started

1. Install dependencies:
   ```bash
   bun install
   ```

2. Set up environment variables in `.env`:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

3. Run the development server:
   ```bash
   bun run dev
   ```

4. Build for production:
   ```bash
   bun run build
   ```

## Project Structure

- `src/routes/`: File-based routing for TanStack Router.
- `src/server/`: Backend logic (tRPC routers, Drizzle schema).
- `src/components/`: UI components (migrated from Next.js).
- `src/trpc/`: tRPC client and provider setup.
