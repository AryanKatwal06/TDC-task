export function getStaleProfiles(clients) {
  const STALE_THRESHOLD_DAYS = 14
  const now = new Date().getTime()

  return clients.filter(c => {
    // If no update, assume stale if created > 14 days ago
    const lastActivityStr = c.updatedAt || c.createdAt
    if (!lastActivityStr) return false
    
    const lastActivity = new Date(lastActivityStr).getTime()
    const daysSince = (now - lastActivity) / (1000 * 60 * 60 * 24)
    
    return daysSince >= STALE_THRESHOLD_DAYS
  })
}
