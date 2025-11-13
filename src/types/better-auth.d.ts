import "better-auth";

declare module "better-auth" {
  interface User {
    role: "admin" | "user"; // add any other roles if you need
  }
}
