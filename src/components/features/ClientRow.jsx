import { useNavigate } from 'react-router-dom'
import Avatar from '@/components/ui/Avatar'
import Badge, { getVariantForStatus } from '@/components/ui/Badge'
import StaleProfileBadge from './StaleProfileBadge'

/**
 * Computes a person's age in whole years from a date-of-birth string.
 */
function computeAge(dob) {
  if (!dob) return null
  const birthDate = new Date(dob)
  const today     = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())
  if (!hasHadBirthdayThisYear) age--
  return age
}

/**
 * A single row in the client list on the Dashboard.
 *
 * Renders:
 *   Avatar | Name + City | Age | Marital Status | Status Tag | "View →"
 *
 * The entire row is clickable and navigates to /clients/:clientId.
 * Hover state gives a warm background tint to signal interactivity.
 *
 * Stagger animation: parent passes an `index` prop which is used to
 * set an animation delay, creating a cascade effect as rows appear.
 */
export default function ClientRow({ client, index = 0 }) {
  const navigate = useNavigate()

  const fullName = `${client.personal.firstName} ${client.personal.lastName}`
  const age      = computeAge(client.personal.dob)
  const status   = client.statusTag

  return (
    <div
      role="row"
      className="flex items-center gap-4 px-5 py-4 border-b cursor-pointer transition-all duration-150 group"
      style={{
        borderColor:      'rgba(220,158,74,0.2)'
      }}
      onClick={() => navigate(`/clients/${client.id}`)}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,158,74,0.05)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/clients/${client.id}`) }}
      aria-label={`View profile for ${fullName}`}
    >
      {/* Avatar */}
      <Avatar name={fullName} size="md" className="shrink-0" />

      {/* Name + City */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: '#f5eddc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {fullName}
          </p>
          <StaleProfileBadge client={client} />
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(220,158,74,0.8)', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {client.personal.city}{client.personal.nriStatus ? ' (NRI)' : ''}
        </p>
      </div>

      {/* Age */}
      <div className="hidden sm:block w-10 text-center shrink-0">
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#f5eddc', fontWeight: 500 }}>
          {age ?? '—'}
        </span>
      </div>

      {/* Marital Status */}
      <div className="hidden md:block w-28 shrink-0">
        <Badge label={client.personal.maritalStatus} variant="neutral" />
      </div>

      {/* Status Tag */}
      <div className="hidden lg:block w-20 shrink-0">
        <Badge label={status} variant={getVariantForStatus(status)} />
      </div>

      {/* View arrow */}
      <div
        className="shrink-0 transition-transform duration-150 group-hover:translate-x-1"
        style={{ color: '#dc9e4a' }}
        aria-hidden="true"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
    </div>
  )
}