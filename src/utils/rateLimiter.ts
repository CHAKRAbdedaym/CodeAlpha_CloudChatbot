const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(identifier: string, limit: number = 10, windowMs: number = 60000) {
  const now = Date.now();
  const userData = rateLimitMap.get(identifier) || { count: 0, lastReset: now };

  if (now - userData.lastReset > windowMs) {
    userData.count = 0;
    userData.lastReset = now;
  }

  userData.count++;
  rateLimitMap.set(identifier, userData);

  return userData.count <= limit;
}
