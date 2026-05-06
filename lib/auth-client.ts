
// import { toNextJsHandler } from "better-auth/next-js";
// import { auth } from "./auth";

// export const { GET, POST } = toNextJsHandler(auth);


// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000", // তোর লোকালহোস্ট বেস ইউআরএল
});

export const { signUp, signIn, signOut, useSession } = authClient;