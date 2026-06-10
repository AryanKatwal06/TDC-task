import useUiStore from '@/store/uiStore'

const STATUS_OPTIONS = ['All', 'Active', 'New', 'On Hold', 'Matched', 'Paused']

const selectSearch       = (s) => s.searchQuery
const selectFilter       = (s) => s.statusFilter
const selectSetSearch    = (s) => s.setSearchQuery
const selectSetFilter    = (s) => s.setStatusFilter

export default function ClientFilters() {
  const searchQuery = useUiStore(selectSearch)
  const statusFilter = useUiStore(selectFilter)
  const setSearch   = useUiStore(selectSetSearch)
  const setFilter   = useUiStore(selectSetFilter)

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      {/* Search */}
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7d5115" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, city or company…"
          className="w-full h-10 pl-9 pr-4 rounded-lg outline-none transition-all text-sm"
          style={{
            background:  '#1a1814',
            border:      '1px solid rgba(220,158,74,0.3)',
            fontFamily:  'var(--font-body)',
            color:       '#f5eddc',
          }}
          onFocus={(e)  => { e.target.style.borderColor = '#dc9e4a'; e.target.style.boxShadow = '0 0 0 2px rgba(220,158,74,0.2)' }}
          onBlur={(e)   => { e.target.style.borderColor = 'rgba(220,158,74,0.4)'; e.target.style.boxShadow = 'none' }}
          aria-label="Search clients"
        />
      </div>

      {/* Status filter */}
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-10 pl-3 pr-8 rounded-lg outline-none text-sm appearance-none cursor-pointer"
          style={{
            background:  '#1a1814',
            border:      '1px solid rgba(220,158,74,0.3)',
            fontFamily:  'var(--font-body)',
            color:       '#f5eddc',
            minWidth:    '130px',
          }}
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt === 'All' ? 'All Statuses' : opt}</option>
          ))}
        </select>
        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7d5115" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>
  )
}
