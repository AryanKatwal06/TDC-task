import React, { useState } from 'react'
import { MapPin, Briefcase, GraduationCap, Ruler, ChevronDown, ChevronUp, Check } from 'lucide-react'
import ScoreRing from '@/components/ui/ScoreRing'
import MatchExplanation from './MatchExplanation'
import SendMatchModal from './SendMatchModal'

export default function MatchCard({ client, matchResult }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)
  
  const { profile, score, tier, confidence, alreadySent } = matchResult
  const { personal, professional } = profile


  const tierColors = {
    Exceptional: 'bg-jade-50 text-jade-700 border-jade-200',
    Strong:      'bg-brand-50 text-brand-700 border-brand-200',
    Good:        'bg-surface-100 text-surface-700 border-surface-200',
    Fair:        'bg-amber-50 text-amber-700 border-amber-200',
    Low:         'bg-crimson-50 text-crimson-700 border-crimson-200',
  }


  const age = personal.dob 
    ? Math.floor((Date.now() - new Date(personal.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : '?'

  return (
    <>
      <div className={`bg-white rounded-xl border ${isExpanded ? 'border-brand shadow-md' : 'border-surface-200 shadow-sm hover:border-surface-300 hover:shadow-md'} transition-all duration-200 overflow-hidden`}>
        

        <div 
          className="p-5 flex flex-col sm:flex-row gap-5 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >

          <div className="flex sm:flex-col items-center gap-4 sm:w-24 flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-surface-100 border border-surface-200 flex items-center justify-center overflow-hidden">
              {personal.photoUrl ? (
                <img src={personal.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-surface-400">
                  {personal.firstName.charAt(0)}{personal.lastName.charAt(0)}
                </span>
              )}
            </div>
            
            <div className="flex flex-col items-center">
              <ScoreRing score={score} size={48} strokeWidth={4} />
              <span className="text-[10px] font-medium text-surface-500 mt-1 uppercase tracking-wider">
                {confidence}% Conf
              </span>
            </div>
          </div>


          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="text-lg font-bold text-surface-900 truncate">
                  {personal.firstName} {personal.lastName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tierColors[tier]}`}>
                    {tier} Match
                  </span>
                  <span className="text-sm font-medium text-surface-600">
                    {age} yrs • {personal.religion}
                  </span>
                </div>
              </div>

              {/* e.stopPropagation() prevents the card from expanding/collapsing when clicking action buttons. */}
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {alreadySent ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-jade rounded-lg border border-green-200 font-medium text-sm">
                    <Check className="w-4 h-4" />
                    Sent
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSendModalOpen(true)}
                    className="btn-primary text-sm px-4 py-1.5 shadow-sm"
                  >
                    Send Match
                  </button>
                )}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 text-surface-400 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
            </div>


            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <div className="flex items-center gap-2 text-sm text-surface-600">
                <MapPin className="w-4 h-4 text-surface-400" />
                <span className="truncate">{personal.city}, {personal.country}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-surface-600">
                <Briefcase className="w-4 h-4 text-surface-400" />
                <span className="truncate">{professional?.designation || 'Professional'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-surface-600">
                <GraduationCap className="w-4 h-4 text-surface-400" />
                <span className="truncate">{professional?.degree || 'Degree'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-surface-600">
                <Ruler className="w-4 h-4 text-surface-400" />
                <span>{personal.heightCm} cm</span>
              </div>
            </div>
          </div>
        </div>

        {/* sm:pl-[136px] aligns the expanded content with the text column, skipping the avatar column. */}
        {isExpanded && (
          <div className="px-5 pb-5 sm:pl-[136px]">
            <MatchExplanation matchResult={matchResult} />
          </div>
        )}
      </div>

      <SendMatchModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        client={client}
        matchResult={matchResult}
      />
    </>
  )
}
