import { useState, useEffect } from 'react'
import { X, FileText, FileCheck } from 'lucide-react'
import { useCreateSpace, useUpdateSpace, useBuildings, useFloors } from '../../hooks/useProperties'
import type { Space, SpaceType, SpaceStatus } from '../../types/property'
import { requiresContract } from '../../types/property'

interface SpaceFormModalProps {
  isOpen: boolean
  onClose: () => void
  space?: Space | null
}

const SPACE_TYPES: { value: string; label: string }[] = [
  { value: 'hot_desk', label: 'Hot Desk' },
  { value: 'dedicated_desk', label: 'Dedicated Desk' },
  { value: 'private_office', label: 'Private Office' },
  { value: 'open_space', label: 'Open Space' },
  { value: 'meeting_room', label: 'Meeting Room' },
  { value: 'conference_room', label: 'Conference Room' },
  { value: 'training_room', label: 'Training Room' },
  { value: 'event_space', label: 'Event Space' },
]

const COMMON_AMENITIES = [
  'WiFi',
  'Air Conditioning',
  'Whiteboard',
  'Projector',
  'TV Screen',
  'Video Conference',
  'Coffee/Tea',
  'Printer',
  'Phone Booth',
  'Standing Desk',
  'Monitor',
  'Kitchen Access',
]

export function SpaceFormModal({ isOpen, onClose, space }: SpaceFormModalProps) {
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
            {space ? 'Edit Space' : 'Add New Space'}
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
                Space Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Hot Desk Zone A, Meeting Room 301"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Space Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as SpaceType })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
              >
                {SPACE_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Contract Requirement */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Yêu cầu hợp đồng <span className="text-rose-500">*</span>
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
                      <p className="font-medium text-slate-900 text-sm">Hợp đồng chính thức</p>
                      <p className="text-xs text-slate-500">Formal Contract (EP-05)</p>
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
                      <p className="font-medium text-slate-900 text-sm">Điều khoản & Điều kiện</p>
                      <p className="text-xs text-slate-500">Terms & Conditions (F-36)</p>
                    </div>
                  </div>
                </label>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {requiresContract(formData.type) 
                  ? `💡 Loại "${SPACE_TYPES.find(t => t.value === formData.type)?.label}" thường yêu cầu hợp đồng chính thức`
                  : `💡 Loại "${SPACE_TYPES.find(t => t.value === formData.type)?.label}" thường chỉ cần T&C`
                }
              </p>
            </div>

            {/* Building & Floor (cascading) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Building <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.buildingId}
                  onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                >
                  <option value="">Select Building</option>
                  {buildings?.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Floor <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.floorId}
                  onChange={(e) => setFormData({ ...formData, floorId: e.target.value })}
                  disabled={!formData.buildingId}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Floor</option>
                  {floors?.map(f => (
                    <option key={f.id} value={f.id}>
                      Floor {f.floorNumber < 0 ? `B${Math.abs(f.floorNumber)}` : f.floorNumber}
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
                  Capacity (người) <span className="text-rose-500">*</span>
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
                  Area (m²) <span className="text-rose-500">*</span>
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
                Amenities
              </label>
              <div className="grid grid-cols-3 gap-2">
                {COMMON_AMENITIES.map(amenity => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="w-4 h-4 text-[#b11e29] rounded border-slate-300 focus:ring-2 focus:ring-[#b11e29]"
                    />
                    <span className="text-sm text-slate-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as SpaceStatus })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Additional information about this space..."
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-5 py-2.5 bg-[#b11e29] text-white rounded-xl hover:bg-[#8f1821] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : space
                ? 'Update Space'
                : 'Create Space'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
