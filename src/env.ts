import 'dotenv/config';
import z from 'zod';

const envSchema = z.object({
  DISCORD_BOT_ID: z.string().nonempty(),
  DISCORD_TOKEN: z.string().nonempty(),
  BOT_OWNER_ID: z.string().nonempty(),
  BOT_NEEDED_PERMISSION_ID: z.string().transform(Number),
  MONGODB_SRV: z.string().url().nonempty(),
  OSU_API_ID: z.string().transform(Number),
  OSU_API_SECRET: z.string().nonempty(),
  OSU_API_URL: z.string().url().nonempty(),
  OSU_TOKEN_URL: z.string().url().nonempty()
});

export const ENV = envSchema.parse(process.env);
