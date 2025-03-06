// src/lib/env.mjs
import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);