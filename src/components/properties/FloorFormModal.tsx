import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useCreateFloor, useUpdateFloor, useBuildings } from '../../hooks/useProperties'
import type { Floor, FloorStatus } from '../../types/property'

interface FloorFormModalProps {
  isOpen: boolean
  onClose: () => void
  floor?: Floor | null
}

export function FloorFormModal({ isOpen, onClose, floor }: FloorFormModalProps) {
  const [formData, setFormData] = useState({
    buildingId: '',
    floorNumber: 1,
    floorName: '',
    area: 0,
    status: 'active' as FloorStatus,
  })

  const createMutation = useCreateFloor()
  const updateMutation = useUpdateFloor()
  const { data: buildings } = useBuildings()

  // Pre-fill form when editing
  useEffect(() => {
    if (floor) {
      setFormData({
        buildingId: floor.buildingId,
        floorNumber: floor.floorNumber,
        floorName: floor.floorName || '',
        area: floor.area,
        status: floor.status,
      })
    } else {
      // Reset form when creating new
      setFormData({
        buildingId: '',
        floorNumber: 1,
        floorName: '',
        area: 0,
        status: 'active',
      })
    }
  }, [floor])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (floor) {
        // Update existing floor
        await updateMutation.mutateAsync({
          id: floor.id,
          ...formData,
        })
      } else {
        // Create new floor
        await createMutation.mutateAsync(formData)
      }
      onClose()
    } catch (error) {
      console.error('Failed to save floor:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {floor ? 'Edit Floor' : 'Add New Floor'}
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
            {/* Building */}
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

            {/* Floor Number & Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Floor Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.floorNumber}
                  onChange={(e) => setFormData({ ...formData, floorNumber: parseInt(e.target.value) || 0 })}
                  placeholder="1, 2, 3... or -1 for B1"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Use negative numbers for basement (e.g., -1 = B1)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Floor Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.floorName}
                  onChange={(e) => setFormData({ ...formData, floorName: e.target.value })}
                  placeholder="e.g., Ground Floor, Mezzanine"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                />
              </div>
            </div>

            {/* Area */}
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

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as FloorStatus })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
                : floor
                ? 'Update Floor'
                : 'Create Floor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
