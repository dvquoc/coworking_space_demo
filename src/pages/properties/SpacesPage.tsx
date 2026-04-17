import { useState } from 'react'
import { LayoutGrid, Plus, Search, ChevronDown, ChevronRight, Building2, Layers, FileText } from 'lucide-react'
import Header from '../../components/layout/Header'
import { useSpaces, useBuildings, useFloors, useDeleteSpace } from '../../hooks/useProperties'
import { SpaceFormModal } from '../../components/properties/SpaceFormModal'
import type { Space, SpaceType, SpaceStatus } from '../../types/property'

const SPACE_TYPE_LABELS: Record<SpaceType, string> = {
  hot_desk: 'Hot Desk',
  dedicated_desk: 'Dedicated Desk',
  private_office: 'Private Office',
  open_space: 'Open Space',
  meeting_room: 'Meeting Room',
  conference_room: 'Conference Room',
  training_room: 'Training Room',
  event_space: 'Event Space',
}

const SPACE_TYPE_COLORS: Record<SpaceType, string> = {
  hot_desk: 'bg-sky-100 text-sky-800',
  dedicated_desk: 'bg-violet-100 text-violet-800',
  private_office: 'bg-indigo-100 text-indigo-800',
  open_space: 'bg-teal-100 text-teal-800',
  meeting_room: 'bg-orange-100 text-orange-800',
  conference_room: 'bg-rose-100 text-rose-800',
  training_room: 'bg-amber-100 text-amber-800',
  event_space: 'bg-pink-100 text-pink-800',
}

export function SpacesPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<SpaceType | ''>('')
  const [statusFilter, setStatusFilter] = useState<SpaceStatus | ''>('')
  const [buildingFilter, setBuildingFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSpace, setEditingSpace] = useState<Space | null>(null)
  // Track collapsed floors: key = floorId, value = boolean
  const [collapsedFloors, setCollapsedFloors] = useState<Record<string, boolean>>({})
  
  const { data: spaces, isLoading, error } = useSpaces({
    search: search || undefined,
    type: typeFilter || undefined,
    status: statusFilter || undefined,
    buildingId: buildingFilter || undefined,
  })

  const { data: buildings } = useBuildings()
  const { data: floors } = useFloors()
  const deleteMutation = useDeleteSpace()

  const handleEdit = (space: Space) => {
    setEditingSpace(space)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this space? This action cannot be undone.')) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete space:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingSpace(null)
  }

  const toggleFloor = (floorId: string) => {
    setCollapsedFloors(prev => ({ ...prev, [floorId]: !prev[floorId] }))
  }

  // Group spaces: building → floor → spaces[]
  const grouped = (() => {
    if (!spaces || !buildings || !floors) return []

    // Filter floors to those that have at least one space
    const floorsWithSpaces = floors.filter(floor =>
      spaces.some(s => s.floorId === floor.id)
    )

    // Group by building
    const buildingMap = new Map<string, {
      building: typeof buildings[0],
      floors: {
        floor: typeof floors[0],
        spaces: typeof spaces,
      }[],
    }>()

    for (const floor of floorsWithSpaces) {
      const building = buildings.find(b => b.id === floor.buildingId)
      if (!building) continue

      if (!buildingMap.has(building.id)) {
        buildingMap.set(building.id, { building, floors: [] })
      }

      const floorSpaces = spaces.filter(s => s.floorId === floor.id)
      buildingMap.get(building.id)!.floors.push({ floor, spaces: floorSpaces })
    }

    // Sort floors by floorNumber within each building
    for (const entry of buildingMap.values()) {
      entry.floors.sort((a, b) => a.floor.floorNumber - b.floor.floorNumber)
    }

    return Array.from(buildingMap.values())
  })()

  const formatFloorLabel = (floorNumber: number, floorName?: string) => {
    const num = floorNumber < 0 ? `B${Math.abs(floorNumber)}` : `Tầng ${floorNumber}`
    return floorName ? `${num} – ${floorName}` : num
  }

  return (
    <>
      <Header 
        title="Spaces Management" 
        subtitle="Quản lý không gian làm việc và phòng họp"
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-600">Total Spaces</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">
                {spaces?.length || 0}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-600">Available</p>
              <p className="text-2xl font-semibold text-emerald-600 mt-1">
                {spaces?.filter(s => s.status === 'available').length || 0}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-600">Occupied</p>
              <p className="text-2xl font-semibold text-amber-600 mt-1">
                {spaces?.filter(s => s.status === 'occupied').length || 0}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-600">Requires Contract</p>
              <p className="text-2xl font-semibold text-indigo-600 mt-1">
                {spaces?.filter(s => s.contractRequired).length || 0}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-600">Total Capacity</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">
                {spaces?.reduce((sum, s) => sum + s.capacity, 0) || 0}
              </p>
            </div>
          </div>

          {/* Header + Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-semibold text-slate-900">All Spaces</h2>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-[#b11e29] text-white rounded-xl hover:bg-[#8f1821] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Space
                </button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search spaces..."
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

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as SpaceType | '')}
                  className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {Object.entries(SPACE_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as SpaceStatus | '')}
                  className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            {/* Grouped content */}
            {isLoading ? (
              <div className="p-12 text-center text-slate-500">
                <div className="w-8 h-8 border-4 border-[#b11e29] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                Loading spaces...
              </div>
            ) : error ? (
              <div className="p-12 text-center text-rose-500">
                Error loading spaces: {error.message}
              </div>
            ) : !spaces || spaces.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <LayoutGrid className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium">No spaces found</p>
                <p className="text-sm mt-1">Add spaces to start managing your properties</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {grouped.map(({ building, floors: buildingFloors }) => (
                  <div key={building.id}>
                    {/* Building header */}
                    <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 border-b border-slate-100">
                      <div className="w-7 h-7 bg-[#b11e29]/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-[#b11e29]" />
                      </div>
                      <span className="font-semibold text-slate-800 text-sm">{building.name}</span>
                      <span className="ml-auto text-xs text-slate-500">
                        {buildingFloors.reduce((sum, f) => sum + f.spaces.length, 0)} spaces
                      </span>
                    </div>

                    {/* Floors */}
                    {buildingFloors.map(({ floor, spaces: floorSpaces }) => {
                      const isCollapsed = !!collapsedFloors[floor.id]

                      return (
                        <div key={floor.id}>
                          {/* Floor header – clickable to collapse */}
                          <button
                            onClick={() => toggleFloor(floor.id)}
                            className="w-full flex items-center gap-3 px-6 py-2.5 bg-slate-50/50 hover:bg-slate-100/70 transition-colors border-b border-slate-100 text-left"
                          >
                            <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                              <Layers className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              {formatFloorLabel(floor.floorNumber, floor.floorName)}
                            </span>
                            <span className="text-xs text-slate-400 ml-1">
                              ({floorSpaces.length} spaces)
                            </span>
                            <span className="ml-auto text-slate-400">
                              {isCollapsed
                                ? <ChevronRight className="w-4 h-4" />
                                : <ChevronDown className="w-4 h-4" />
                              }
                            </span>
                          </button>

                          {/* Spaces table for this floor */}
                          {!isCollapsed && (
                            <table className="w-full">
                              <thead className="border-b border-slate-100">
                                <tr>
                                  <th className="pl-14 pr-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Space</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Capacity</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Area</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {floorSpaces.map((space) => (
                                  <tr key={space.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="pl-14 pr-4 py-3">
                                      <div className="flex items-center gap-3">
                                        {space.imageUrls[0] ? (
                                          <img
                                            src={space.imageUrls[0]}
                                            alt={space.name}
                                            className="w-9 h-9 rounded-lg object-cover"
                                          />
                                        ) : (
                                          <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <LayoutGrid className="w-4 h-4 text-slate-400" />
                                          </div>
                                        )}
                                        <div>
                                          <p className="font-medium text-slate-900 text-sm">{space.name}</p>
                                          {space.amenities.length > 0 && (
                                            <p className="text-xs text-slate-400 mt-0.5">
                                              {space.amenities.slice(0, 3).join(' · ')}
                                              {space.amenities.length > 3 && ` +${space.amenities.length - 3}`}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-1.5">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SPACE_TYPE_COLORS[space.type]}`}>
                                          {SPACE_TYPE_LABELS[space.type]}
                                        </span>
                                        {space.contractRequired && (
                                          <span 
                                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700"
                                            title="Yêu cầu hợp đồng chính thức"
                                          >
                                            <FileText className="w-3 h-3" />
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{space.capacity} người</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{space.area} m²</td>
                                    <td className="px-4 py-3">
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        space.status === 'available'
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : space.status === 'occupied'
                                          ? 'bg-amber-100 text-amber-800'
                                          : space.status === 'reserved'
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-slate-100 text-slate-800'
                                      }`}>
                                        {space.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          onClick={() => handleEdit(space)}
                                          className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDelete(space.id)}
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
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      <SpaceFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        space={editingSpace}
      />
    </>
  )
}
