import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

// Database URL from environment
const databaseUrl = process.env.DATABASE_URL || '';

// For now, we use a mock/placeholder connection
// When Supabase is configured, this will connect to the real database
// Using dynamic import pattern so the app still builds without a real DB
let db: ReturnType<typeof drizzle<typeof schema>>;

if (databaseUrl) {
  // Production: connect to real database
  const postgres = require('postgres');
  const client = postgres(databaseUrl);
  db = drizzle(client, { schema });
} else {
  // Development without DB: create a placeholder that will throw helpful errors
  db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
    get(_, prop) {
      if (prop === 'query' || prop === 'select' || prop === 'insert' || prop === 'update' || prop === 'delete') {
        return new Proxy(() => {}, {
          get() {
            return () => {
              console.warn('Database not configured. Set DATABASE_URL in .env to connect.');
              return Promise.resolve([]);
            };
          },
          apply() {
            console.warn('Database not configured. Set DATABASE_URL in .env to connect.');
            return Promise.resolve([]);
          },
        });
      }
      return undefined;
    },
  });
}

export { db };
export { schema };
