import 'dotenv/config';
import z from 'zod';

const envSchema = z.object({
  DISCORD_BOT_ID: z.string(),
  DISCORD_TOKEN: z.string(),
  BOT_OWNER_ID: z.string(),
  BOT_NEEDED_PERMISSION_ID: z.string().transform(Number),
  MONGODB_SRV: z.string().url(),
  OSU_API_ID: z.string().transform(Number),
  OSU_API_SECRET: z.string(),
  OSU_API_URL: z.string().url(),
  OSU_TOKEN_URL: z.string().url()
});

export const ENV = envSchema.parse(process.env);
