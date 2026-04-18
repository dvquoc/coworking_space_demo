import { useState, useEffect } from 'react'
import { X, FileText, FileCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCreateSpace, useUpdateSpace, useBuildings, useFloors } from '../../hooks/useProperties'
import type { Space, SpaceType, SpaceStatus } from '../../types/property'
import { requiresContract } from '../../types/property'

interface SpaceFormModalProps {
  isOpen: boolean
  onClose: () => void
  space?: Space | null
}

const SPACE_TYPES: { value: string; labelKey: string }[] = [
  { value: 'hot_desk', labelKey: 'space_type_hot_desk' },
  { value: 'dedicated_desk', labelKey: 'space_type_dedicated_desk' },
  { value: 'private_office', labelKey: 'space_type_private_office' },
  { value: 'open_space', labelKey: 'space_type_open_space' },
  { value: 'meeting_room', labelKey: 'space_type_meeting_room' },
  { value: 'conference_room', labelKey: 'space_type_conference_room' },
  { value: 'training_room', labelKey: 'space_type_training_room' },
  { value: 'event_space', labelKey: 'space_type_event_space' },
]

const COMMON_AMENITIES: { value: string; labelKey: string }[] = [
  { value: 'WiFi', labelKey: 'amenity_wifi' },
  { value: 'Air Conditioning', labelKey: 'amenity_ac' },
  { value: 'Whiteboard', labelKey: 'amenity_whiteboard' },
  { value: 'Projector', labelKey: 'amenity_projector' },
  { value: 'TV Screen', labelKey: 'amenity_tv' },
  { value: 'Video Conference', labelKey: 'amenity_video_conf' },
  { value: 'Coffee/Tea', labelKey: 'amenity_coffee' },
  { value: 'Printer', labelKey: 'amenity_printer' },
  { value: 'Phone Booth', labelKey: 'amenity_phone_booth' },
  { value: 'Standing Desk', labelKey: 'amenity_standing_desk' },
  { value: 'Monitor', labelKey: 'amenity_monitor' },
  { value: 'Kitchen Access', labelKey: 'amenity_kitchen' },
]

export function SpaceFormModal({ isOpen, onClose, space }: SpaceFormModalProps) {
  const { t } = useTranslation('properties')
  const [formData, setFormData] = useState({
    name: '',
    buildingId: '',
    floorId: '',
    type: 'hot_desk' as SpaceType,
    capacity: 1,
    area: 0,
    amenities: [] as string[],
    status: 'available' as SpaceStatus,
    contractRequired: false,    // Default: T&C only
    imageUrls: [] as string[],
    description: '',
  })

  const createMutation = useCreateSpace()
  const updateMutation = useUpdateSpace()
  const { data: buildings } = useBuildings()
  const { data: floors } = useFloors(
    formData.buildingId ? { buildingId: formData.buildingId } : undefined
  )

  // Pre-fill form when editing
  useEffect(() => {
    if (space) {
      setFormData({
        name: space.name,
        buildingId: space.buildingId,
        floorId: space.floorId,
        type: space.type,
        capacity: space.capacity,
        area: space.area,
        amenities: space.amenities,
        status: space.status,
        contractRequired: space.contractRequired ?? requiresContract(space.type),
        imageUrls: space.imageUrls,
        description: space.description || '',
      })
    } else {
      // Reset form when creating new
      setFormData({
        name: '',
        buildingId: '',
        floorId: '',
        type: 'hot_desk' as SpaceType,
        capacity: 1,
        area: 0,
        amenities: [],
        status: 'available',
        contractRequired: false,
        imageUrls: [],
        description: '',
      })
    }
  }, [space])

  // Auto-set contractRequired when type changes (only for new spaces)
  useEffect(() => {
    if (!space) {
      setFormData(prev => ({
        ...prev,
        contractRequired: requiresContract(prev.type),
      }))
    }
  }, [formData.type, space])

  // Reset floor when building changes
  useEffect(() => {
    if (!space) {
      setFormData(prev => ({ ...prev, floorId: '' }))
    }
  }, [formData.buildingId, space])

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (space) {
        // Update existing space
        await updateMutation.mutateAsync({
          id: space.id,
          ...formData,
        })
      } else {
        // Create new space
        await createMutation.mutateAsync(formData)
      }
      onClose()
    } catch (error) {
      console.error('Failed to save space:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {space ? t('modal_edit_space') : t('modal_add_space')}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-5">
            {/* Space Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('label_space_name')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('placeholder_space_name')}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('label_space_type')} <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as SpaceType })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
              >
                {SPACE_TYPES.map(({ value, labelKey }) => (
                  <option key={value} value={value}>{t(labelKey)}</option>
                ))}
              </select>
            </div>

            {/* Contract Requirement */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                {t('label_contract_required')} <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-4">
                <label 
                  className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    formData.contractRequired 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="contractRequired"
                    checked={formData.contractRequired}
                    onChange={() => setFormData({ ...formData, contractRequired: true })}
                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{t('contract_formal')}</p>
                      <p className="text-xs text-slate-500">{t('contract_formal_desc')}</p>
                    </div>
                  </div>
                </label>

                <label 
                  className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    !formData.contractRequired 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="contractRequired"
                    checked={!formData.contractRequired}
                    onChange={() => setFormData({ ...formData, contractRequired: false })}
                    className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
                  />
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{t('contract_tc')}</p>
                      <p className="text-xs text-slate-500">{t('contract_tc_desc')}</p>
                    </div>
                  </div>
                </label>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {requiresContract(formData.type) 
                  ? t('hint_contract_required', { type: t(SPACE_TYPES.find(st => st.value === formData.type)?.labelKey ?? '') })
                  : t('hint_contract_not_required', { type: t(SPACE_TYPES.find(st => st.value === formData.type)?.labelKey ?? '') })
                }
              </p>
            </div>

            {/* Building & Floor (cascading) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('label_building')} <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.buildingId}
                  onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                >
                  <option value="">{t('placeholder_select_building')}</option>
                  {buildings?.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('label_floor')} <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.floorId}
                  onChange={(e) => setFormData({ ...formData, floorId: e.target.value })}
                  disabled={!formData.buildingId}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">{t('placeholder_select_floor')}</option>
                  {floors?.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.floorNumber < 0 ? t('basement_label', { number: Math.abs(f.floorNumber) }) : t('floor_label', { number: f.floorNumber })}
                      {f.floorName ? ` - ${f.floorName}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Capacity & Area */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('label_capacity')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('label_area')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.1"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                {t('label_amenities')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {COMMON_AMENITIES.map(({ value, labelKey }) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(value)}
                      onChange={() => handleAmenityToggle(value)}
                      className="w-4 h-4 text-[#b11e29] rounded border-slate-300 focus:ring-2 focus:ring-[#b11e29]"
                    />
                    <span className="text-sm text-slate-700">{t(labelKey)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('label_status')} <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as SpaceStatus })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
              >
                <option value="available">{t('status_available')}</option>
                <option value="occupied">{t('status_occupied')}</option>
                <option value="reserved">{t('status_reserved')}</option>
                <option value="maintenance">{t('status_maintenance')}</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('label_description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder={t('placeholder_space_desc')}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors font-medium"
            >
              {t('btn_cancel')}
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-5 py-2.5 bg-[#b11e29] text-white rounded-xl hover:bg-[#8f1821] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending || updateMutation.isPending
                ? t('btn_saving')
                : space
                ? t('btn_update_space')
                : t('btn_create_space')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
