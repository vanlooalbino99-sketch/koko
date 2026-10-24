import { defineConfig } from 'drizzle-kit';

// Génère les migrations SQL versionnées dans drizzle/ à partir de lib/db/schema.ts (npm run db:generate).
export default defineConfig({
  dialect: 'postgresql',
  schema: './lib/db/schema.ts',
  out: './drizzle',
});
