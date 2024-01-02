This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


### Setting up Developer Environment

As when working with next js is often cases to use multiple external services to create a well polished web application, we need to setup a developer environment to work with these services.

#### Setting up Prisma (Object Relational Mapper) with Postgres 
When setting up with Prisma unfortunately we need to prisma edge client to work with next js, to interact with the middleware. The following steps to set this up are as follows:
1. install dependencies
```bash
npm i
```
2. Create the generated types for the prisma client
```bash
npm run prisma:generate
```
3. copy the env.example and rename to .env
```bash
cp env.example .env
```
4. Create a supabase account and create a new project
5. Create a new database and copy the credentials into DIRECT_DATABASE_URL in the .env file
6. Create a Prisma Cloud account and create a new project and select the Accelerate service and copy and paste again the credentials that are for the supabase database into the DATABASE_URL required to fill out the form in the Prisma Cloud
7. in Prisma cloud copy and paste the new credentials into the DATABASE_URL in the .env file
8. Update the data schemia on database with the following command
```bash
npm run prisma:migrate
```
9.  Profit 🎉

#### Setting up Clerk (Authentication Service)
1. Create a Clerk account and create a new project
2. Create a new application and select the Next.js option
3. Copy the credentials into the .env file
4. Profit 🎉

