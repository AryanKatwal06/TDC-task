import React, { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import { updateClient } from '@/firebase/firestore'
import useClientStore from '@/store/clientStore'
import { useToastStore } from '@/components/ui/Toast'

export default function EditClientModal({ isOpen, onClose, client }) {
  const updateClientLocally = useClientStore((s) => s.updateClientLocally)
  const addToast = useToastStore((s) => s.addToast)

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form data when modal opens or client changes
  useEffect(() => {
    if (isOpen && client) {
      setStep(1)
      setFormData({
        personal: { ...client.personal, languagesKnown: client.personal.languagesKnown?.join(', ') || '' },
        professional: { ...client.professional },
        preferences: { ...client.preferences },
        family: { ...client.family }
      })
    }
  }, [isOpen, client])

  if (!formData) return null

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleNext = () => setStep((s) => Math.min(s + 1, 3))
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const cleanData = {
        personal: {
          ...formData.personal,
          heightCm: Number(formData.personal.heightCm) || null,
          languagesKnown: formData.personal.languagesKnown.split(',').map(s => s.trim()).filter(Boolean),
        },
        professional: {
          ...formData.professional,
          annualIncomeLakh: Number(formData.professional.annualIncomeLakh) || null,
        },
        preferences: {
          ...formData.preferences,
          partnerAgeMin: Number(formData.preferences.partnerAgeMin) || null,
          partnerAgeMax: Number(formData.preferences.partnerAgeMax) || null,
          partnerHeightMinCm: Number(formData.preferences.partnerHeightMinCm) || null,
          partnerIncomeMinLakh: Number(formData.preferences.partnerIncomeMinLakh) || null,
        },
        family: {
          ...formData.family,
          brothers: Number(formData.family.brothers) || 0,
          sisters: Number(formData.family.sisters) || 0,
          familyIncomeLakh: Number(formData.family.familyIncomeLakh) || null,
        }
      }

      await updateClient(client.id, cleanData)
      updateClientLocally(client.id, cleanData)
      
      addToast({ type: 'success', title: 'Client Updated', message: 'Changes saved successfully.' })
      onClose()
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to update client.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderInput = (section, field, label, type = 'text', options = null) => {
    const value = formData[section][field] ?? ''
    const onChange = (e) => {
      const val = type === 'checkbox' ? e.target.checked : e.target.value
      handleNestedChange(section, field, val)
    }

    if (options) {
      return (
        <div>
          <label className="block text-xs font-semibold text-surface-600 mb-1">{label}</label>
          <select value={value} onChange={onChange} className="input-field w-full">
            <option value="">Select...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      )
    }

    if (type === 'checkbox') {
      return (
        <label className="flex items-center gap-2 mt-6 cursor-pointer">
          <input type="checkbox" checked={value || false} onChange={onChange} className="w-4 h-4 text-brand rounded border-surface-300 focus:ring-brand" />
          <span className="text-sm font-medium text-surface-700">{label}</span>
        </label>
      )
    }

    return (
      <div>
        <label className="block text-xs font-semibold text-surface-600 mb-1">{label}</label>
        <input type={type} value={value} onChange={onChange} className="input-field w-full" required={['firstName', 'lastName'].includes(field)} />
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Client Profile" hideCloseButton={isSubmitting}>
      
      <div className="flex items-center mb-6">
        {[1, 2, 3].map((num) => (
          <React.Fragment key={num}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold cursor-pointer transition-colors ${step >= num ? 'bg-brand text-white' : 'bg-surface-100 text-surface-400 hover:bg-surface-200'}`} onClick={() => setStep(num)}>
              {num}
            </div>
            {num < 3 && (
              <div className={`h-1 flex-1 mx-2 rounded ${step > num ? 'bg-brand' : 'bg-surface-100'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
        
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-sm font-bold text-surface-900 border-b border-surface-200 pb-2 mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {renderInput('personal', 'firstName', 'First Name')}
              {renderInput('personal', 'lastName', 'Last Name')}
              {renderInput('personal', 'gender', 'Gender', 'text', ['Female', 'Male'])}
              {renderInput('personal', 'dob', 'Date of Birth', 'date')}
              {renderInput('personal', 'city', 'City')}
              {renderInput('personal', 'country', 'Country')}
              {renderInput('personal', 'heightCm', 'Height (cm)', 'number')}
              {renderInput('personal', 'religion', 'Religion', 'text', ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Other'])}
              {renderInput('personal', 'maritalStatus', 'Marital Status', 'text', ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'])}
              {renderInput('personal', 'dietaryPref', 'Diet', 'text', ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Jain', 'Vegan'])}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-sm font-bold text-surface-900 border-b border-surface-200 pb-2 mb-4">Professional Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {renderInput('professional', 'designation', 'Designation')}
              {renderInput('professional', 'company', 'Company')}
              {renderInput('professional', 'college', 'College')}
              {renderInput('professional', 'degree', 'Degree')}
              {renderInput('professional', 'annualIncomeLakh', 'Income (LPA)', 'number')}
              {renderInput('professional', 'nriStatus', 'Is NRI?', 'checkbox')}
            </div>

            <h3 className="text-sm font-bold text-surface-900 border-b border-surface-200 pb-2 mt-8 mb-4">Family Background</h3>
            <div className="grid grid-cols-2 gap-4">
              {renderInput('family', 'familyType', 'Family Type', 'text', ['Nuclear', 'Joint', 'Extended'])}
              {renderInput('family', 'familyValues', 'Family Values', 'text', ['Traditional', 'Moderate', 'Liberal'])}
              {renderInput('family', 'familyIncomeLakh', 'Family Income (LPA)', 'number')}
              <div className="grid grid-cols-2 gap-2">
                {renderInput('family', 'brothers', 'Brothers', 'number')}
                {renderInput('family', 'sisters', 'Sisters', 'number')}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-sm font-bold text-surface-900 border-b border-surface-200 pb-2 mb-4">Partner Preferences</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2">
                {renderInput('preferences', 'partnerAgeMin', 'Min Age', 'number')}
                {renderInput('preferences', 'partnerAgeMax', 'Max Age', 'number')}
              </div>
              {renderInput('preferences', 'partnerHeightMinCm', 'Min Height (cm)', 'number')}
              {renderInput('preferences', 'partnerIncomeMinLakh', 'Min Income (LPA)', 'number')}
              {renderInput('preferences', 'wantKids', 'Want Kids?', 'text', ['Yes', 'No', 'Maybe'])}
              {renderInput('preferences', 'openToRelocate', 'Open to Relocate?', 'text', ['Yes', 'No', 'Maybe'])}
              {renderInput('preferences', 'openToPets', 'Open to Pets?', 'text', ['Yes', 'No', 'Maybe'])}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-4 border-t border-surface-200">
          <button type="button" onClick={step === 1 ? onClose : handlePrev} disabled={isSubmitting} className="btn-secondary">
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center">
            {isSubmitting ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : null}
            {step === 3 ? 'Save Changes' : 'Continue'}
          </button>
        </div>

      </form>
    </Modal>
  )
}
