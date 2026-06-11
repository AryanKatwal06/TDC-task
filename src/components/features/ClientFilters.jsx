import { useState } from 'react'
import useUiStore from '@/store/uiStore'
import { parseNLSearch } from '@/lib/ai/nlSearch'
import { Sparkles, X, Loader2, SlidersHorizontal } from 'lucide-react'

const STATUS_OPTIONS = ['All', 'Active', 'New', 'On Hold', 'Matched', 'Paused']

const selectSearch       = (s) => s.searchQuery
const selectFilter       = (s) => s.statusFilter
const selectAiFilters    = (s) => s.aiFilters
const selectSetSearch    = (s) => s.setSearchQuery
const selectSetFilter    = (s) => s.setStatusFilter
const selectSetAiFilters = (s) => s.setAiFilters
const selectAdvanced     = (s) => s.advancedFilters
const selectSetAdvanced  = (s) => s.setAdvancedFilters
const selectClearAdvanced= (s) => s.clearAdvancedFilters

export default function ClientFilters() {
  const [isSearching, setIsSearching] = useState(false)
  const searchQuery = useUiStore(selectSearch)
  const statusFilter = useUiStore(selectFilter)
  const aiFilters = useUiStore(selectAiFilters)
  const advancedFilters = useUiStore(selectAdvanced)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const setSearch   = useUiStore(selectSetSearch)
  const setFilter   = useUiStore(selectSetFilter)
  const setAiFilters= useUiStore(selectSetAiFilters)
  const setAdvancedFilters = useUiStore(selectSetAdvanced)
  const clearAdvancedFilters = useUiStore(selectClearAdvanced)

  async function handleAISearch() {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    try {
      const filters = await parseNLSearch(searchQuery)
      if (filters) {
        setAiFilters(filters)
      }
    } catch (error) {
      console.error("AI Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const hasAnyFilter = 
    searchQuery.trim() !== '' || 
    statusFilter !== 'All' || 
    (aiFilters && Object.keys(aiFilters).length > 0) || 
    Object.values(advancedFilters).some(v => v !== '' && v !== undefined && v !== null);

  function clearAllFilters() {
    setSearch('')
    setFilter('All')
    setAiFilters(null)
    clearAdvancedFilters()
  }

  return (
    <div className="flex flex-col gap-3 mb-5">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 flex gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7d5115" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // Standard search doesn't need Enter, but if they want AI search they can click the button.
                }
              }}
              placeholder="Search by name, city, or try 'Find women under 28 in Mumbai'"
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
          <button
            onClick={handleAISearch}
            disabled={isSearching || !searchQuery.trim()}
            className="h-10 px-4 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
            style={{
              background: 'linear-gradient(135deg, #1a1814 0%, #111111 100%)',
              color: '#dc9e4a',
              border: '1px solid rgba(220,158,74,0.4)',
            }}
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin text-brand-500" /> : <Sparkles className="w-4 h-4 text-brand-500 group-hover:animate-pulse" />}
            AI Search
          </button>
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

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="h-10 px-4 rounded-lg flex items-center gap-2 text-sm transition-all shadow-sm"
          style={{
            background: showAdvanced ? 'rgba(220,158,74,0.15)' : '#1a1814',
            border: showAdvanced ? '1px solid rgba(220,158,74,0.6)' : '1px solid rgba(220,158,74,0.3)',
            color: showAdvanced ? '#dc9e4a' : '#f5eddc',
            fontFamily: 'var(--font-body)',
          }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Advanced
        </button>

        {hasAnyFilter && (
          <button
            onClick={clearAllFilters}
            className="h-10 px-4 rounded-lg flex items-center gap-2 text-sm transition-all shadow-sm hover:opacity-80"
            style={{
              background: 'transparent',
              border: '1px solid rgba(220,158,74,0.3)',
              color: '#dc9e4a',
              fontFamily: 'var(--font-body)',
            }}
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="rounded-lg p-5 grid grid-cols-2 md:grid-cols-4 gap-5 animate-in fade-in slide-in-from-top-2"
          style={{
            background: '#1a1814',
            border: '1px solid rgba(220,158,74,0.2)',
          }}
        >
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(220,158,74,0.8)' }}>City</label>
            <input type="text" placeholder="e.g. Bangalore" value={advancedFilters.city || ''} onChange={(e) => setAdvancedFilters({ city: e.target.value })} 
              className="h-9 px-3 rounded-md text-sm outline-none transition-all placeholder:text-surface-600" 
              style={{ background: '#111111', border: '1px solid rgba(220,158,74,0.2)', color: '#f5eddc' }} 
              onFocus={(e) => e.target.style.borderColor = '#dc9e4a'} onBlur={(e) => e.target.style.borderColor = 'rgba(220,158,74,0.2)'} />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(220,158,74,0.8)' }}>Religion</label>
            <input type="text" placeholder="e.g. Hindu" value={advancedFilters.religion || ''} onChange={(e) => setAdvancedFilters({ religion: e.target.value })} 
              className="h-9 px-3 rounded-md text-sm outline-none transition-all placeholder:text-surface-600" 
              style={{ background: '#111111', border: '1px solid rgba(220,158,74,0.2)', color: '#f5eddc' }} 
              onFocus={(e) => e.target.style.borderColor = '#dc9e4a'} onBlur={(e) => e.target.style.borderColor = 'rgba(220,158,74,0.2)'} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(220,158,74,0.8)' }}>Caste</label>
            <input type="text" placeholder="e.g. Brahmin" value={advancedFilters.caste || ''} onChange={(e) => setAdvancedFilters({ caste: e.target.value })} 
              className="h-9 px-3 rounded-md text-sm outline-none transition-all placeholder:text-surface-600" 
              style={{ background: '#111111', border: '1px solid rgba(220,158,74,0.2)', color: '#f5eddc' }} 
              onFocus={(e) => e.target.style.borderColor = '#dc9e4a'} onBlur={(e) => e.target.style.borderColor = 'rgba(220,158,74,0.2)'} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(220,158,74,0.8)' }}>Min Income (LPA)</label>
            <input type="number" placeholder="e.g. 10" value={advancedFilters.minIncome || ''} onChange={(e) => setAdvancedFilters({ minIncome: e.target.value ? Number(e.target.value) : '' })} 
              className="h-9 px-3 rounded-md text-sm outline-none transition-all placeholder:text-surface-600" 
              style={{ background: '#111111', border: '1px solid rgba(220,158,74,0.2)', color: '#f5eddc' }} 
              onFocus={(e) => e.target.style.borderColor = '#dc9e4a'} onBlur={(e) => e.target.style.borderColor = 'rgba(220,158,74,0.2)'} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(220,158,74,0.8)' }}>Education</label>
            <input type="text" placeholder="e.g. Masters" value={advancedFilters.education || ''} onChange={(e) => setAdvancedFilters({ education: e.target.value })} 
              className="h-9 px-3 rounded-md text-sm outline-none transition-all placeholder:text-surface-600" 
              style={{ background: '#111111', border: '1px solid rgba(220,158,74,0.2)', color: '#f5eddc' }} 
              onFocus={(e) => e.target.style.borderColor = '#dc9e4a'} onBlur={(e) => e.target.style.borderColor = 'rgba(220,158,74,0.2)'} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(220,158,74,0.8)' }}>Kids</label>
            <select value={advancedFilters.kids || ''} onChange={(e) => setAdvancedFilters({ kids: e.target.value })} 
              className="h-9 px-3 rounded-md text-sm outline-none transition-all appearance-none" 
              style={{ background: '#111111', border: '1px solid rgba(220,158,74,0.2)', color: '#f5eddc' }} 
              onFocus={(e) => e.target.style.borderColor = '#dc9e4a'} onBlur={(e) => e.target.style.borderColor = 'rgba(220,158,74,0.2)'}>
              <option value="">Any</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(220,158,74,0.8)' }}>Open to Relocate</label>
            <select value={advancedFilters.relocate || ''} onChange={(e) => setAdvancedFilters({ relocate: e.target.value })} 
              className="h-9 px-3 rounded-md text-sm outline-none transition-all appearance-none" 
              style={{ background: '#111111', border: '1px solid rgba(220,158,74,0.2)', color: '#f5eddc' }} 
              onFocus={(e) => e.target.style.borderColor = '#dc9e4a'} onBlur={(e) => e.target.style.borderColor = 'rgba(220,158,74,0.2)'}>
              <option value="">Any</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(220,158,74,0.8)' }}>Age Range</label>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" value={advancedFilters.minAge || ''} onChange={(e) => setAdvancedFilters({ minAge: e.target.value ? Number(e.target.value) : '' })} 
                className="h-9 w-full px-3 rounded-md text-sm outline-none transition-all placeholder:text-surface-600" 
                style={{ background: '#111111', border: '1px solid rgba(220,158,74,0.2)', color: '#f5eddc' }} 
                onFocus={(e) => e.target.style.borderColor = '#dc9e4a'} onBlur={(e) => e.target.style.borderColor = 'rgba(220,158,74,0.2)'} />
              <input type="number" placeholder="Max" value={advancedFilters.maxAge || ''} onChange={(e) => setAdvancedFilters({ maxAge: e.target.value ? Number(e.target.value) : '' })} 
                className="h-9 w-full px-3 rounded-md text-sm outline-none transition-all placeholder:text-surface-600" 
                style={{ background: '#111111', border: '1px solid rgba(220,158,74,0.2)', color: '#f5eddc' }} 
                onFocus={(e) => e.target.style.borderColor = '#dc9e4a'} onBlur={(e) => e.target.style.borderColor = 'rgba(220,158,74,0.2)'} />
            </div>
          </div>

          <div className="col-span-full flex justify-end mt-2 pt-4" style={{ borderTop: '1px solid rgba(220,158,74,0.1)' }}>
            <button 
              onClick={clearAdvancedFilters}
              className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors hover:bg-brand-500/10"
              style={{ color: '#dc9e4a' }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {aiFilters && Object.keys(aiFilters).length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs font-semibold text-brand-400">AI Filters Applied:</span>
          {Object.entries(aiFilters).map(([key, filterValue]) => (
            <div key={key} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-medium text-brand-200">
              <span className="opacity-70">{key}:</span> {String(filterValue)}
            </div>
          ))}
          <button 
            onClick={() => setAiFilters(null)}
            className="ml-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors hover:bg-brand-500/10"
            style={{ color: 'rgba(220,158,74,0.8)' }}
          >
            <X className="w-3 h-3" />
            Clear AI Filters
          </button>
        </div>
      )}
    </div>
  )
}
