import type { Config } from "drizzle-kit";

// Ensure the env variable exists
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in your environment");
}

export default {
  schema: "./src/lib/db/schema.ts", // Path to your Drizzle schema
  out: "./drizzle",                 // Output folder for generated migrations
  dialect: "postgresql",            // Database dialect
  dbCredentials: {
    url: process.env.DATABASE_URL, // Make sure your env variable is set
  },
} satisfies Config;
