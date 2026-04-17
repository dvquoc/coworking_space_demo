import { useState } from 'react'
import { Layers, Plus, Search, Building2 } from 'lucide-react'
import Header from '../../components/layout/Header'
import { useFloors, useBuildings, useDeleteFloor } from '../../hooks/useProperties'
import { FloorFormModal } from '../../components/properties/FloorFormModal'
import type { Floor } from '../../types/property'

export function FloorsPage() {
  const [search, setSearch] = useState('')
  const [buildingFilter, setBuildingFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null)
  
  const { data: floors, isLoading, error } = useFloors({
    buildingId: buildingFilter || undefined,
  })
  
  const { data: buildings } = useBuildings()
  const deleteMutation = useDeleteFloor()

  const filteredFloors = floors?.filter(floor => {
    const building = buildings?.find(b => b.id === floor.buildingId)
    const buildingName = building?.name || ''
    const floorName = floor.floorName || ''
    const floorNumber = floor.floorNumber < 0
      ? `B${Math.abs(floor.floorNumber)}`
      : `${floor.floorNumber}`

    const searchLower = search.toLowerCase()
    return (
      buildingName.toLowerCase().includes(searchLower) ||
      floorName.toLowerCase().includes(searchLower) ||
      floorNumber.includes(searchLower)
    )
  })

  // Group filtered floors by building
  const grouped = (() => {
    if (!filteredFloors || !buildings) return []

    const map = new Map<string, { building: typeof buildings[0]; floors: Floor[] }>()

    for (const floor of filteredFloors) {
      const building = buildings.find(b => b.id === floor.buildingId)
      if (!building) continue
      if (!map.has(building.id)) map.set(building.id, { building, floors: [] })
      map.get(building.id)!.floors.push(floor)
    }

    // Sort floors within each building by floorNumber
    for (const entry of map.values()) {
      entry.floors.sort((a, b) => a.floorNumber - b.floorNumber)
    }

    return Array.from(map.values())
  })()

  const formatFloorLabel = (floorNumber: number) =>
    floorNumber < 0 ? `B${Math.abs(floorNumber)}` : `Tầng ${floorNumber}`

  const handleEdit = (floor: Floor) => {
    setEditingFloor(floor)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this floor? This action cannot be undone.')) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete floor:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingFloor(null)
  }

  return (
    <>
      <Header 
        title="Floors Management" 
        subtitle="Quản lý các tầng trong tòa nhà"
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-600">Total Floors</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">
                {floors?.length || 0}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-600">Buildings</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">
                {buildings?.length || 0}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-600">Total Area</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">
                {floors?.reduce((sum, f) => sum + f.area, 0).toLocaleString() || 0} m²
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-600">Avg Floor Area</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">
                {floors && floors.length > 0
                  ? Math.round(floors.reduce((sum, f) => sum + f.area, 0) / floors.length).toLocaleString()
                  : 0} m²
              </p>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-semibold text-slate-900">All Floors</h2>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-[#b11e29] text-white rounded-xl hover:bg-[#8f1821] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Floor
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search floors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                  />
                </div>
                <select
                  value={buildingFilter}
                  onChange={(e) => setBuildingFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                >
                  <option value="">All Buildings</option>
                  {buildings?.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="p-12 text-center text-slate-500">
                <div className="w-8 h-8 border-4 border-[#b11e29] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                Loading floors...
              </div>
            ) : error ? (
              <div className="p-12 text-center text-rose-500">
                Error loading floors: {error.message}
              </div>
            ) : !filteredFloors || filteredFloors.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Layers className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium">No floors found</p>
                <p className="text-sm mt-1">Add floors to organize your building spaces</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {grouped.map(({ building, floors: buildingFloors }) => (
                  <div key={building.id}>
                    {/* Building header row */}
                    <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 border-b border-slate-100">
                      <div className="w-7 h-7 bg-[#b11e29]/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-[#b11e29]" />
                      </div>
                      <span className="font-semibold text-slate-800 text-sm">{building.name}</span>
                      <span className="text-xs text-slate-400 ml-1">
                        {building.address}
                      </span>
                      <span className="ml-auto text-xs text-slate-500">
                        {buildingFloors.length} tầng ·{' '}
                        {buildingFloors.reduce((sum, f) => sum + f.area, 0).toLocaleString()} m²
                      </span>
                    </div>

                    {/* Floors table for this building */}
                    <table className="w-full">
                      <thead className="border-b border-slate-100">
                        <tr>
                          <th className="pl-14 pr-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tầng</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tên</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Diện tích</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Spaces</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trạng thái</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {buildingFloors.map((floor) => (
                          <tr key={floor.id} className="hover:bg-slate-50 transition-colors">
                            <td className="pl-14 pr-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Layers className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-medium text-slate-900 text-sm">
                                  {formatFloorLabel(floor.floorNumber)}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              {floor.floorName || <span className="text-slate-300">—</span>}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-900">
                              {floor.area.toLocaleString()} m²
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                                {floor.spacesCount || 0} spaces
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                floor.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {floor.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEdit(floor)}
                                  className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(floor.id)}
                                  disabled={deleteMutation.isPending}
                                  className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <FloorFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        floor={editingFloor}
      />
    </>
  )
}
