// import 'dotenv/config';
// import { defineConfig } from 'drizzle-kit';

// export default defineConfig({
//   out: './drizzle',
//   schema: './src/**/model/**/*.ts',
//   dialect: 'postgresql',
//   dbCredentials: {
//     url: process.env.DATABASE_URL!,
//   },
// });

import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

export default defineConfig({
  schema: "./src/drizzle/schema/**.schema.ts",
  out: "./drizzle", 
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

