import { z } from 'zod';

const emptyToUndef = (v: unknown) =>
  v == null ||
  v === '' ||
  (typeof v === 'string' &&
    (v.trim() === '' ||
      v.trim().toLowerCase() === 'none' ||
      v.trim().toLowerCase() === 'disabled'))
    ? undefined
    : v;

/**
 * Environment schema. Parsed once at boot by `validateEnv()` — if invalid,
 * the process fails fast with a readable error.
 */
export const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  API_PREFIX: z.string().default('api'),

  CORS_ORIGIN: z
    .string()
    .default('http://localhost:3000')
    .describe('Comma-separated list of allowed origins'),

  THROTTLE_TTL_MS: z.coerce.number().int().positive().default(60_000),
  THROTTLE_LIMIT: z.coerce.number().int().positive().default(30),

  LOG_LEVEL: z
    .enum(['error', 'warn', 'log', 'debug', 'verbose'])
    .default('log'),

  /**
   * LLM provider selection.
   * - `gemini` requires GEMINI_API_KEY.
   * - `groq` requires GROQ_API_KEY (LangChain ChatGroq).
   * - `mock` returns deterministic fake responses (good for dev/tests).
   */
  LLM_PROVIDER: z.enum(['gemini', 'groq', 'mock']).default('mock'),
  GEMINI_API_KEY: z.preprocess(emptyToUndef, z.string().min(1).optional()),
  GEMINI_MODEL: z.string().default('gemini-3.6-flash'),
  GROQ_API_KEY: z.preprocess(emptyToUndef, z.string().min(1).optional()),
  GROQ_MODEL: z.string().default('openai/gpt-oss-20b'),
  LLM_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),

  /** Showcase build: market-context RAG is not included, so this stays off. */
  RAG_ENABLED: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),

  MONGODB_URI: z.preprocess(emptyToUndef, z.string().min(1).optional()),
  REDIS_URL: z.preprocess(emptyToUndef, z.string().min(1).optional()),
  UPSTASH_REDIS_REST_URL: z.preprocess(emptyToUndef, z.string().min(1).optional()),
  UPSTASH_REDIS_REST_TOKEN: z.preprocess(
    emptyToUndef,
    z.string().min(1).optional(),
  ),
  REDIS_CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(86_400),
  SESSION_TTL_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(7 * 24 * 60 * 60),
  /**
   * `lax` works for same-site deployments (including localhost:3000 → :3001)
   * and survives top-level navigations. Use `strict` to harden further, or
   * `none` only when the API lives on a different site than the UI (forces a
   * secure cookie, so it needs HTTPS).
   */
  SESSION_COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  /** Optional cookie Domain. Leave empty so the host that set it is used. */
  SESSION_COOKIE_DOMAIN: z.preprocess(emptyToUndef, z.string().min(1).optional()),

  /**
   * Public site origin. Also a reminder of which origin belongs in CORS_ORIGIN.
   */
  FRONTEND_URL: z.string().default('http://localhost:3000'),

  /**
   * Production refuses LLM_PROVIDER=mock unless this is true. Staging can set
   * it to keep Groq/Gemini spend at zero.
   */
  ALLOW_MOCK_LLM: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),

  LOG_FORMAT: z.enum(['pretty', 'json']).default('pretty'),

  SENTRY_DSN: z.preprocess(emptyToUndef, z.string().min(1).optional()),

  /**
   * Opt-in for the local `x-user-id` identity header, which authenticates as
   * whatever uid it names. It must be requested explicitly, and the guard
   * additionally refuses it in production and whenever Firebase Admin is
   * configured, so a real deployment cannot be weakened by setting it.
   */
  AUTH_DEV_BYPASS: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),

  FIREBASE_SERVICE_ACCOUNT_PATH: z.preprocess(
    emptyToUndef,
    z.string().min(1).optional(),
  ),
  FIREBASE_PROJECT_ID: z.preprocess(emptyToUndef, z.string().min(1).optional()),
  FIREBASE_CLIENT_EMAIL: z.preprocess(
    emptyToUndef,
    z.string().min(1).optional(),
  ),
  FIREBASE_PRIVATE_KEY: z.preprocess(
    emptyToUndef,
    z.string().min(1).optional(),
  ),

  RESUME_COIN_COST: z.coerce.number().int().positive().default(10),
  JOB_MATCH_COIN_COST: z.coerce.number().int().positive().default(10),
  USER_STARTING_COINS: z.coerce.number().int().nonnegative().default(20),
  RESUME_MAX_FILE_SIZE_MB: z.coerce.number().int().positive().default(20),
  RESUME_ANALYSIS_MAX_RETRIES: z.coerce.number().int().nonnegative().default(2),
});

export type Env = z.infer<typeof EnvSchema>;
