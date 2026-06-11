export function getPriorityQueue(clients) {
  return clients.filter(c => {
    if (c.statusTag === 'New') return true
    if (c.statusTag === 'Active' && (!c.sentMatches || c.sentMatches.length === 0)) return true
    return false
  })
}
