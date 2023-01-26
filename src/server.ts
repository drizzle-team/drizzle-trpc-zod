import { initTRPC, inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";
import { drizzle } from "drizzle-orm-pg/postgres.js";
import { migrate } from "drizzle-orm-pg/postgres.js/migrator";
import postgres from "postgres";
import { users, apiUser, apiCreateUser } from "./schema";
import { eq } from "drizzle-orm/expressions";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { config } from "dotenv";

// see https://neon.tech/docs/guides/node/
config();
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const connection = postgres(URL, { ssl: "require", max: 1 });
const db = drizzle(connection);

const createContext = ({}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;

export const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  users: t.procedure.query(async () => {
    return await db.select(users);
  }),
  userById: t.procedure.input(z.number()).query(async (req) => {
    const result = await db.select(users).where(eq(users.id, req.input));
    return result[0];
  }),
  createUser: t.procedure.input(apiCreateUser).mutation(async (req) => {
    return await db.insert(users).values(req.input).returning();
  }),
});

export type AppRouter = typeof appRouter;

const app = express();
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const main = async () => {
  await migrate(db, { migrationsFolder: "./drizzle" });

  app.listen(4000, () => {
    console.log("listening on http://127.0.0.1:4000");
  });
};

main();
