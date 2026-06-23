import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(8080),
  GEMINI_API_KEY: z.string().min(20),
  GOOGLE_CLOUD_PROJECT: z.string().min(2),
  FIREBASE_STORAGE_BUCKET: z.string().min(3),
  INTERNAL_AGENT_SECRET: z.string().min(24),
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173,http://127.0.0.1:5173')
});

export const env = schema.parse(process.env);
export const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(v => v.trim());
