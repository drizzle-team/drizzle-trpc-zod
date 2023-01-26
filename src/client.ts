// @filename: client.ts
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./server";

// Notice the <AppRouter> generic here.
const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://127.0.0.1:4000/trpc",
    }),
  ],
});

const main = async () => {
  const [inserted] = await trpc.createUser.mutate({
    name: "Daniel",
    email: "daniel@radcliffe.com",
    projectRole: "user",
  });

  const user = await trpc.userById.query(inserted.id);
  console.log(user);

  const all = await trpc.users.query();
  console.log(all)
};

main();
