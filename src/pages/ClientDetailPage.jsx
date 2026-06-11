import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell            from '@/components/layout/AppShell'
import Avatar              from '@/components/ui/Avatar'
import Badge, { getVariantForStatus } from '@/components/ui/Badge'
import Card                from '@/components/ui/Card'
import BiodataSection      from '@/components/features/BiodataSection'
import NotesPanel          from '@/components/features/NotesPanel'
import Spinner             from '@/components/ui/Spinner'
import Button              from '@/components/ui/Button'
import useClientStore      from '@/store/clientStore'
import { fetchClientById, updateClientStatus } from '@/firebase/firestore'
import { useMatchesForClient } from '@/hooks/useMatches'
import useMatchStore from '@/store/matchStore'
import MatchCard from '@/components/features/MatchCard'
import ProfileCompleteness from '@/components/features/ProfileCompleteness'
import AIInsightsPanel from '@/components/features/AIInsightsPanel'
import NextBestAction from '@/components/features/NextBestAction'
import JourneyPipeline from '@/components/features/JourneyPipeline'
import ConversationPrep from '@/components/features/ConversationPrep'
import PreferenceConflict from '@/components/features/PreferenceConflict'
import StaleProfileBadge from '@/components/features/StaleProfileBadge'
import { getProfileCompleteness } from '@/services/matching/profileCompleteness'

const selectClients      = (s) => s.clients
const selectSetSelected  = (s) => s.setSelectedClientId
const selectUpdateLocally = (s) => s.updateClientLocally


function formatHeight(cm) {
  if (!cm) return null
  const totalInches = Math.round(cm / 2.54)
  const feet        = Math.floor(totalInches / 12)
  const inches      = totalInches % 12
  return `${feet}'${inches}" / ${cm} cm`
}


function formatDate(isoStr) {
  if (!isoStr) return null
  return new Date(isoStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}


function computeAge(dob) {
  if (!dob) return null
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}

export default function ClientDetailPage() {
  const { clientId }   = useParams()
  const navigate       = useNavigate()
  const clients        = useClientStore(selectClients)
  const setSelectedId  = useClientStore(selectSetSelected)

  // Try to find the client in the store first (avoids Firestore read if already loaded)
  const clientFromStore = clients.find((c) => c.id === clientId) ?? null
  const [client, setClient]   = [clientFromStore, (c) => useClientStore.getState().updateClientLocally(clientId, c)]

  // Match features
  useMatchesForClient(client)
  const { matches, computing, error: matchError, visibleCount, showMore } = useMatchStore()

  // If the client is not in the store (e.g. direct URL navigation), fetch from Firestore
  useEffect(() => {
    setSelectedId(clientId)

    async function loadIfNeeded() {
      if (clientFromStore) return // Already have it
      try {
        const data = await fetchClientById(clientId)
        if (data) useClientStore.getState().updateClientLocally(data.id, data)
      } catch {
        // Error handled by the null-client fallback UI below
      }
    }

    loadIfNeeded()

    return () => setSelectedId(null) // Clear selection on unmount
  }, [clientId, clientFromStore, setSelectedId])

  // Loading state
  if (!client) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </AppShell>
    )
  }

  const fullName = `${client.personal.firstName} ${client.personal.lastName}`
  const age      = computeAge(client.personal.dob)

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 mb-6 group hover:text-brand-400 transition-colors"
          style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(220,158,74,0.8)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-150 group-hover:-translate-x-0.5">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          All clients
        </button>

        {/* Client header */}
        <div className="flex items-start gap-4 mb-8">
          <Avatar name={fullName} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.625rem', color: '#f5eddc', fontWeight: 500, lineHeight: 1.2 }}>
                  {fullName}
                </h1>
                <StaleProfileBadge client={client} />
                <select 
                  value={client.statusTag}
                  onChange={(e) => {
                    useClientStore.getState().updateClientLocally(client.id, { statusTag: e.target.value });
                    updateClientStatus(client.id, e.target.value);
                  }}
                  className="bg-surface-100 border border-surface-200 text-surface-900 text-xs font-semibold py-1 px-2 rounded-lg cursor-pointer outline-none hover:bg-surface-200 transition-colors"
                >
                  <option value="Active">Active</option>
                  <option value="New">New</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Matched">Matched</option>
                  <option value="Paused">Paused</option>
                </select>
                {client.personal.nriStatus && <Badge label="NRI" variant="violet" />}
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(220,158,74,0.8)' }}>
              {age ? `${age} years` : ''}{age && client.personal.city ? ' · ' : ''}{client.personal.city}{client.personal.nriStatus ? ' (based abroad)' : ''}
              {client.professional.designation ? ` · ${client.professional.designation}` : ''}
            </p>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">

          {/* LEFT — Biodata */}
          <div className="space-y-6">
            
            <JourneyPipeline client={client} />
            <PreferenceConflict client={client} availableMatches={matches} />

            <Card padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-[15px] font-medium text-surface-50 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc9e4a" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Personal Information
                </h3>
              </div>
              <AIInsightsPanel profile={client} />
              <div className="mt-6">
                <BiodataSection
                  title=""
                  fields={[
                  { label: 'Gender',           value: client.personal.gender },
                  { label: 'Date of Birth',     value: `${formatDate(client.personal.dob)} (Age ${age})` },
                  { label: 'Marital Status',    value: client.personal.maritalStatus },
                  { label: 'Height',            value: formatHeight(client.personal.heightCm) },
                  { label: 'City',              value: client.personal.city },
                  { label: 'Country',           value: client.personal.country },
                  { label: 'Email',             value: client.personal.email },
                  { label: 'Phone',             value: client.personal.phone },
                  { label: 'Languages Known',   value: client.personal.languagesKnown },
                  { label: 'Complexion',        value: client.personal.complexion },
                ]}
              />
              </div>
            </Card>

            <Card padding="lg">
              <BiodataSection
                title="Professional Background"
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc9e4a" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>}
                fields={[
                  { label: 'Company',           value: client.professional.company },
                  { label: 'Designation',       value: client.professional.designation },
                  { label: 'Annual Income',     value: client.professional.annualIncomeLakh ? `₹${client.professional.annualIncomeLakh} LPA` : null },
                  { label: 'College',           value: client.professional.college },
                  { label: 'Degree',            value: client.professional.degree },
                  { label: 'NRI Status',        value: client.professional.nriStatus ? 'Yes — based abroad' : 'No' },
                  { label: 'Work City',         value: client.professional.workCity },
                ]}
                columns={2}
              />
            </Card>

            <Card padding="lg">
              <BiodataSection
                title="Lifestyle & Values"
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc9e4a" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                fields={[
                  { label: 'Dietary Preference', value: client.personal.dietaryPref },
                  { label: 'Smoking',             value: client.personal.smoking },
                  { label: 'Drinking',            value: client.personal.drinking },
                  { label: 'Family Type',         value: client.family.familyType },
                  { label: 'Family Values',       value: client.family.familyValues },
                  { label: 'Open to Pets',        value: client.preferences.openToPets },
                ]}
              />
            </Card>

            <Card padding="lg">
              <BiodataSection
                title="Cultural Background"
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc9e4a" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
                fields={[
                  { label: 'Religion',        value: client.personal.religion },
                  { label: 'Caste',           value: client.personal.caste },
                  { label: 'Mother Tongue',   value: client.personal.motherTongue },
                  { label: 'Manglik',         value: client.personal.manglik },
                ]}
              />
            </Card>

            <Card padding="lg">
              <BiodataSection
                title="Partner Preferences"
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc9e4a" strokeWidth="2" strokeLinecap="round"><path d="M12 21C12 21 3 14.5 3 8.5C3 6.01 4.79 4 7 4C9.03 4 10.8 5.69 12 7.5C13.2 5.69 14.97 4 17 4C19.21 4 21 6.01 21 8.5C21 14.5 12 21 12 21Z"/></svg>}
                fields={[
                  { label: 'Partner Age Range',    value: `${client.preferences.partnerAgeMin}–${client.preferences.partnerAgeMax} years` },
                  { label: 'Min Partner Height',   value: formatHeight(client.preferences.partnerHeightMinCm) },
                  { label: 'Min Partner Income',   value: client.preferences.partnerIncomeMinLakh ? `₹${client.preferences.partnerIncomeMinLakh} LPA` : 'No preference' },
                  { label: 'Want Kids',            value: client.preferences.wantKids },
                  { label: 'Open to Relocate',     value: client.preferences.openToRelocate },
                ]}
              />
            </Card>

            <Card padding="lg">
              <BiodataSection
                title="Family Details"
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc9e4a" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                fields={[
                  { label: 'Father\'s Occupation', value: client.family.fatherOccupation },
                  { label: 'Mother\'s Occupation', value: client.family.motherOccupation },
                  { label: 'Brothers',             value: client.family.brothers },
                  { label: 'Sisters',              value: client.family.sisters },
                  { label: 'Family Income',        value: client.family.familyIncomeLakh ? `₹${client.family.familyIncomeLakh} LPA` : null },
                ]}
              />
            </Card>

            <Card padding="lg">
              <NotesPanel client={client} />
            </Card>

          </div>

          {/* RIGHT — Matches */}
          <div className="space-y-4">
            
            <ProfileCompleteness completeness={getProfileCompleteness(client)} />
            <NextBestAction client={client} matches={matches} />
            <ConversationPrep client={client} />

            <div className="flex items-center justify-between mb-2 mt-8">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#f5eddc', fontWeight: 500 }}>
                Suggested Matches ({matches.length})
              </h3>
            </div>
            
            {computing && (
              <div className="flex items-center justify-center p-8 bg-surface-50 rounded-xl border border-surface-200">
                <Spinner size="md" />
              </div>
            )}
            
            {!computing && matchError && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                {matchError}
              </div>
            )}
            
            {!computing && !matchError && matches.length === 0 && (
              <div className="p-8 text-center bg-surface-50 rounded-xl border border-surface-200 text-surface-500 text-sm">
                No matches found in the current pool.
              </div>
            )}

            {!computing && !matchError && matches.slice(0, visibleCount).map((m) => (
              <MatchCard key={m.profile.id} client={client} matchResult={m} />
            ))}

            {!computing && !matchError && visibleCount < matches.length && (
              <button
                onClick={showMore}
                className="w-full py-3 bg-surface-100 hover:bg-surface-200 text-surface-700 text-sm font-semibold rounded-xl transition-colors mt-4"
              >
                Show More Matches
              </button>
            )}
          </div>

        </div>
      </div>
    </AppShell>
  )
}