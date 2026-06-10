import { useMemo, useState }    from 'react'
import { useNavigate }          from 'react-router-dom'
import AppShell                 from '@/components/layout/AppShell'
import ClientRow                from '@/components/features/ClientRow'
import Card                     from '@/components/ui/Card'
import EmptyState               from '@/components/ui/EmptyState'
import SkeletonRow              from '@/components/ui/SkeletonRow'
import Button                   from '@/components/ui/Button'
import Spinner                  from '@/components/ui/Spinner'
import { useClients, useClientsLoading, useClientsError } from '@/hooks/useClients'
import useUiStore               from '@/store/uiStore'
import ClientFilters            from '@/components/features/ClientFilters'

// ─── Store selectors ───────────────────────────────────────────
const selectSearch       = (s) => s.searchQuery
const selectFilter       = (s) => s.statusFilter

// ─── Stats strip ───────────────────────────────────────────────
function StatCard({ label, value, icon }) {
  return (
    <Card padding="md">
      <div className="flex items-start justify-between">
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(220,158,74,0.8)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
            {label}
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: '#f5eddc', fontWeight: 600, lineHeight: 1 }}>
            {value}
          </p>
        </div>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(220,158,74,0.15)' }}
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>
    </Card>
  )
}


function countNewThisMonth(clients) {
  const now   = new Date()
  const year  = now.getFullYear()
  const month = now.getMonth()
  return clients.filter((c) => {
    const d = new Date(c.createdAt)
    return d.getFullYear() === year && d.getMonth() === month
  }).length
}

export default function DashboardPage() {
  const retry      = () => window.location.reload()
  const clients    = useClients()
  const loading    = useClientsLoading()
  const error      = useClientsError()

  const searchQuery = useUiStore(selectSearch)
  const statusFilter = useUiStore(selectFilter)

  // Client-side filtering — no Firestore calls on search/filter
  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const fullName  = `${c.personal.firstName} ${c.personal.lastName}`.toLowerCase()
      const city      = (c.personal.city ?? '').toLowerCase()
      const company   = (c.professional.company ?? '').toLowerCase()
      const query     = searchQuery.toLowerCase()

      const matchesSearch = !query ||
        fullName.includes(query) ||
        city.includes(query) ||
        company.includes(query)

      const matchesFilter = statusFilter === 'All' || c.statusTag === statusFilter

      return matchesSearch && matchesFilter
    })
  }, [clients, searchQuery, statusFilter])

  // Stats computed from the full client list, not the filtered view
  const stats = useMemo(() => ({
    total:        clients.length,
    active:       clients.filter((c) => c.statusTag === 'Active').length,
    matched:      clients.filter((c) => c.statusTag === 'Matched').length,
    newThisMonth: countNewThisMonth(clients),
  }), [clients])

  return (
    <AppShell>
      {/* Loading Overlay */}
      {loading && clients.length === 0 && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <Spinner size="lg" color="#dc9e4a" className="mb-6" />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#f5eddc', fontWeight: 500, fontStyle: 'italic', marginBottom: '8px' }}>
            Hang on a moment...
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(245,237,220,0.7)' }}>
            We are loading your clients' information.
          </p>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Page header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', color: '#f5eddc', fontWeight: 500, fontStyle: 'italic', marginBottom: '4px' }}>
              Your Clients
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(245,237,220,0.6)' }}>
              Manage profiles and track each client's matchmaking journey.
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Clients" value={stats.total} icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc9e4a" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          } />
          <StatCard label="Active" value={stats.active} icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc9e4a" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          } />
          <StatCard label="Matched" value={stats.matched} icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc9e4a" strokeWidth="2" strokeLinecap="round"><path d="M12 21C12 21 3 14.5 3 8.5C3 6.01 4.79 4 7 4C9.03 4 10.8 5.69 12 7.5C13.2 5.69 14.97 4 17 4C19.21 4 21 6.01 21 8.5C21 14.5 12 21 12 21Z"/></svg>
          } />
          <StatCard label="New This Month" value={stats.newThisMonth} icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc9e4a" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          } />
        </div>

        {/* Search + filter bar */}
        <ClientFilters />

        {/* Result count */}
        {!loading && !error && clients.length > 0 && (
          <p className="mb-3 text-xs" style={{ fontFamily: 'var(--font-body)', color: 'rgba(220,158,74,0.65)' }}>
            {filtered.length === clients.length
              ? `${clients.length} client${clients.length !== 1 ? 's' : ''}`
              : `${filtered.length} of ${clients.length} clients`}
          </p>
        )}

        {/* Client list card */}
        <Card padding="none">
          {/* Loading state */}
          {loading && (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          )}

          {/* Error state */}
          {!loading && error && (
            <EmptyState
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc9e4a" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
              title="Couldn't load clients"
              description={error}
              action={<Button variant="secondary" size="sm" onClick={retry}>Try again</Button>}
            />
          )}

          {/* Empty — no clients at all */}
          {!loading && !error && clients.length === 0 && (
            <EmptyState
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc9e4a" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
              title="No clients yet"
              description="Once clients are assigned to your account they will appear here."
            />
          )}

          {/* Empty — search/filter produced no results */}
          {!loading && !error && clients.length > 0 && filtered.length === 0 && (
            <EmptyState
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc9e4a" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>}
              title="No results found"
              description={`No clients match "${searchQuery || statusFilter}". Try adjusting your search.`}
              action={<Button variant="ghost" size="sm" onClick={() => { useUiStore.getState().setSearchQuery(''); useUiStore.getState().setStatusFilter('All') }}>Clear filters</Button>}
            />
          )}

          {/* Client rows */}
          {!loading && !error && filtered.map((client, i) => (
            <ClientRow key={client.id} client={client} index={i} />
          ))}
        </Card>

      </div>
    </AppShell>
  )
}