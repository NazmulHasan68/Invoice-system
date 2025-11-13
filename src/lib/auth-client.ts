import { createAuthClient } from "better-auth/react";
import { admin } from "better-auth/plugins"; 


export const authClient = createAuthClient({
  plugins: [
    admin({
      adminRoles: ["admin"], // admin role
      defaultRole: "user",   // normal user role
    }),
    // আরও plugin দরকার হলে এখানে add করো
  ],
  
});


export const { signIn, signUp, useSession, signOut, getSession} = authClient