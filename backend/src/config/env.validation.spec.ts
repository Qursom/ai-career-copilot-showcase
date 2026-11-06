import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  const base = {
    NODE_ENV: 'test',
    LLM_PROVIDER: 'mock',
  };

  it('accepts the mock LLM without an API key', () => {
    expect(() => validateEnv(base)).not.toThrow();
  });

  it('rejects the unimplemented openai LLM provider', () => {
    expect(() =>
      validateEnv({ ...base, LLM_PROVIDER: 'openai' }),
    ).toThrow(/Invalid environment configuration/);
  });

  it('refuses production without Mongo, Redis, and Firebase', () => {
    expect(() =>
      validateEnv({
        ...base,
        NODE_ENV: 'production',
        LLM_PROVIDER: 'groq',
        GROQ_API_KEY: 'gsk_test',
      }),
    ).toThrow(/Production requires durable sessions/);
  });

  it('accepts production when durable deps and a real LLM are set', () => {
    expect(() =>
      validateEnv({
        ...base,
        NODE_ENV: 'production',
        LLM_PROVIDER: 'groq',
        GROQ_API_KEY: 'gsk_test',
        MONGODB_URI: 'mongodb://localhost:27017/career_copilot',
        REDIS_URL: 'redis://localhost:6379',
        FIREBASE_PROJECT_ID: 'demo',
        FIREBASE_CLIENT_EMAIL: 'sa@demo.iam.gserviceaccount.com',
        FIREBASE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\\nM\\n-----END PRIVATE KEY-----\\n',
        CORS_ORIGIN: 'https://app.example.com',
      }),
    ).not.toThrow();
  });

  it('accepts production when Redis is provided as UPSTASH_REDIS_URL', () => {
    const env = validateEnv({
      ...base,
      NODE_ENV: 'production',
      LLM_PROVIDER: 'groq',
      GROQ_API_KEY: 'gsk_test',
      MONGODB_URI: 'mongodb://localhost:27017/career_copilot',
      UPSTASH_REDIS_URL: 'redis://default:secret@prod-slug.upstash.io:6379',
      FIREBASE_PROJECT_ID: 'demo',
      FIREBASE_CLIENT_EMAIL: 'sa@demo.iam.gserviceaccount.com',
      FIREBASE_PRIVATE_KEY:
        '-----BEGIN PRIVATE KEY-----\\nM\\n-----END PRIVATE KEY-----\\n',
      CORS_ORIGIN: 'https://app.example.com',
    });
    expect(env.REDIS_URL).toBe(
      'rediss://default:secret@prod-slug.upstash.io:6379',
    );
  });

  it('accepts production when only Upstash REST env is set', () => {
    expect(() =>
      validateEnv({
        ...base,
        NODE_ENV: 'production',
        LLM_PROVIDER: 'groq',
        GROQ_API_KEY: 'gsk_test',
        MONGODB_URI: 'mongodb://localhost:27017/career_copilot',
        UPSTASH_REDIS_REST_URL: 'https://ready-slug.upstash.io',
        UPSTASH_REDIS_REST_TOKEN: 'token',
        FIREBASE_PROJECT_ID: 'demo',
        FIREBASE_CLIENT_EMAIL: 'sa@demo.iam.gserviceaccount.com',
        FIREBASE_PRIVATE_KEY:
          '-----BEGIN PRIVATE KEY-----\\nM\\n-----END PRIVATE KEY-----\\n',
        CORS_ORIGIN: 'https://app.example.com',
      }),
    ).not.toThrow();
  });

  it('refuses AUTH_DEV_BYPASS in production', () => {
    expect(() =>
      validateEnv({
        ...base,
        NODE_ENV: 'production',
        LLM_PROVIDER: 'groq',
        GROQ_API_KEY: 'gsk_test',
        MONGODB_URI: 'mongodb://localhost:27017/x',
        REDIS_URL: 'redis://localhost:6379',
        FIREBASE_PROJECT_ID: 'demo',
        FIREBASE_CLIENT_EMAIL: 'sa@demo.iam.gserviceaccount.com',
        FIREBASE_PRIVATE_KEY: 'key',
        AUTH_DEV_BYPASS: 'true',
      }),
    ).toThrow(/AUTH_DEV_BYPASS/);
  });
});
