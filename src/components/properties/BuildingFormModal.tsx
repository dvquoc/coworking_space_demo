import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useCreateBuilding, useUpdateBuilding } from '../../hooks/useProperties'
import type { Building, BuildingStatus } from '../../types/property'

interface BuildingFormModalProps {
  isOpen: boolean
  onClose: () => void
  building?: Building | null
}

export function BuildingFormModal({ isOpen, onClose, building }: BuildingFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalFloors: 1,
    totalArea: 0,
    status: 'active' as BuildingStatus,
    imageUrl: '',
    description: '',
  })

  const createMutation = useCreateBuilding()
  const updateMutation = useUpdateBuilding()

  // Pre-fill form when editing
  useEffect(() => {
    if (building) {
      setFormData({
        name: building.name,
        address: building.address,
        totalFloors: building.totalFloors,
        totalArea: building.totalArea,
        status: building.status,
        imageUrl: building.imageUrl || '',
        description: building.description || '',
      })
    } else {
      // Reset form when creating new
      setFormData({
        name: '',
        address: '',
        totalFloors: 1,
        totalArea: 0,
        status: 'active',
        imageUrl: '',
        description: '',
      })
    }
  }, [building])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (building) {
        // Update existing building
        await updateMutation.mutateAsync({
          id: building.id,
          ...formData,
        })
      } else {
        // Create new building
        await createMutation.mutateAsync(formData)
      }
      onClose()
    } catch (error) {
      console.error('Failed to save building:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {building ? 'Edit Building' : 'Add New Building'}
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
            {/* Building Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Building Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Cobi Building 1"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g., 123 Nguyen Trai, District 1, HCMC"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
              />
            </div>

            {/* Two columns: Floors & Area */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Total Floors <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={formData.totalFloors}
                  onChange={(e) => setFormData({ ...formData, totalFloors: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Total Area (m²) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.totalArea}
                  onChange={(e) => setFormData({ ...formData, totalArea: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as BuildingStatus })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/building-image.jpg"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
              />
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
                placeholder="Additional information about this building..."
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
                : building
                ? 'Update Building'
                : 'Create Building'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
