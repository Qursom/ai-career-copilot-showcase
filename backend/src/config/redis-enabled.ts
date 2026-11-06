/** True when a Redis URL is configured for cache and sessions. */
export function isRedisConfigured(
  uri: string | undefined | null = process.env.REDIS_URL,
): boolean {
  const value = uri?.trim().toLowerCase();
  if (!value || value === 'none' || value === 'disabled') {
    return false;
  }
  return true;
}

