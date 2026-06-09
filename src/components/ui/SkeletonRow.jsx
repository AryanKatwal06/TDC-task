/**
 * Shimmer skeleton placeholder for client rows.
 * Shown while Firestore is loading the client list.
 * Matches the visual dimensions of a real ClientRow.
 */
function Shimmer({ className = '' }) {
  return (
    <div
      className={`rounded animate-pulse bg-[length:200%_100%] animate-shimmer ${className}`}
      style={{ background: 'linear-gradient(90deg, rgba(220,158,74,0.08) 25%, rgba(220,158,74,0.15) 50%, rgba(220,158,74,0.08) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s linear infinite' }}
    />
  )
}

export default function SkeletonRow() {
  return (
    <div
      className="flex items-center gap-4 px-5 py-4 border-b"
      style={{ borderColor: 'rgba(220,158,74,0.15)' }}
    >
      <Shimmer className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-3.5 w-36 rounded" />
        <Shimmer className="h-3 w-24 rounded" />
      </div>
      <Shimmer className="h-3 w-8 rounded hidden sm:block" />
      <Shimmer className="h-5 w-16 rounded-full hidden md:block" />
      <Shimmer className="h-5 w-14 rounded-full hidden lg:block" />
      <Shimmer className="h-3 w-20 rounded hidden xl:block" />
    </div>
  )
}