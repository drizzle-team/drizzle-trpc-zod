## Drizzle ORM + Neon + tRPC + Zod 
This is an example repo to showcase [Neon database](https://neon.tech) + [tRPC](https://trpc.io) + [zod](https://zod.dev) and [drizzle-orm](http://driz.li/orm) native integration.

We've implemented a native Zod module for Drizzle ORM so you can rapidly implement APIs with Zod validations:

```typescript
import { pgTable, serial, text } from "drizzle-orm-pg";
import { createInsertSchema } from "drizzle-zod/pg";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  projectRole: text<"admin" | "user">("role"),
});

export const apiUser = createInsertSchema(users, {
  projectRole: z.enum(["admin", "user"]),
});

// zod schema for API user creation
export const apiCreateUser = apiUser.omit({ id: true })
```

To run the example let's install `node_modules`
```shell
npm i
```

Prepare your Neon database and get all the needed credentials and put them to `.env`
```
## see https://neon.tech/docs/guides/node/
PGHOST='<endpoint_hostname>:<port>'
PGDATABASE='<dbname>'
PGUSER='<username>'
PGPASSWORD='<password>'
ENDPOINT_ID='<endpoint_id>'
```

then just
```shell
npm run start:server
npm run start:client
```

You can also alter `src/schema.ts` and generate new SQL migrations automatically with `drizzle-kit` just by running 
```shell
npm run generate
```
Give it a try, it's very useful. 

Help us grow!
- follow us on [Twitter](https://twitter.com/DrizzleOrm)
- give us a star on [GitHub](https://github.com/drizzle-team/drizzle-orm)
- join our community on [Discord](https://driz.li/discord)
