import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  API_PREFIX: z.string().default('/api/v1'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_COOKIE_NAME: z.string().default('gamex_token'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  MERCADOPAGO_ACCESS_TOKEN: z.string().default('TEST-token'),
  MERCADOPAGO_WEBHOOK_SECRET: z.string().optional(),
  MERCADOPAGO_NOTIFICATION_URL: z.string().url().default('http://localhost:4000/api/v1/payments/webhook'),
  RESEND_API_KEY: z.string().default('re_test_key'),
  RESEND_FROM_EMAIL: z.string().default('Gamex Import <noreply@gameximport.com>'),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  ADMIN_NAME: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data!;
export const isProduction = env.NODE_ENV === 'production';
