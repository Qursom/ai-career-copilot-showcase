import { isRedisConfigured } from './redis-enabled';

describe('isRedisConfigured', () => {
  it('is false for empty, none, and disabled', () => {
    expect(isRedisConfigured('')).toBe(false);
    expect(isRedisConfigured('none')).toBe(false);
    expect(isRedisConfigured('disabled')).toBe(false);
    expect(isRedisConfigured(undefined)).toBe(false);
  });

  it('is true for a redis URL', () => {
    expect(isRedisConfigured('redis://localhost:6379')).toBe(true);
  });
});

