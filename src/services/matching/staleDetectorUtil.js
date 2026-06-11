// Utility function for checking if a single profile is stale (14+ days inactive)
export function isStaleProfile(client) {
  const STALE_THRESHOLD_DAYS = 14
  const now = Date.now()
  const lastActivityStr = client.updatedAt || client.createdAt
  if (!lastActivityStr) return false
  const lastActivity = new Date(lastActivityStr).getTime()
  const daysSince = (now - lastActivity) / (1000 * 60 * 60 * 24)
  return daysSince >= STALE_THRESHOLD_DAYS
}
