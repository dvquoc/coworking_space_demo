import { useState } from 'react'
import { Building2, Plus, Search } from 'lucide-react'
import Header from '../../components/layout/Header'
import { useBuildings, useDeleteBuilding } from '../../hooks/useProperties'
import { BuildingFormModal } from '../../components/properties/BuildingFormModal'
import type { Building, BuildingStatus } from '../../types/property'

export function BuildingsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<BuildingStatus | ''>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null)
  
  const { data: buildings, isLoading, error } = useBuildings({
    search: search || undefined,
    status: statusFilter || undefined,
  })
  
  const deleteMutation = useDeleteBuilding()

  const handleEdit = (building: Building) => {
    setEditingBuilding(building)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this building? This action cannot be undone.')) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete building:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBuilding(null)
  }

  return (
    <>
      <Header 
        title="Buildings Management" 
        subtitle="Quản lý tòa nhà Coworking Space"
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Buildings</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {buildings?.length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#b11e29]/10 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#b11e29]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Buildings</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {buildings?.filter(b => b.status === 'active').length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Area</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {buildings?.reduce((sum, b) => sum + b.totalArea, 0).toLocaleString() || 0} m²
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-semibold text-slate-900">All Buildings</h2>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-[#b11e29] text-white rounded-xl hover:bg-[#8f1821] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Building
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search buildings..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as BuildingStatus | '')}
                  className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-12 text-center text-slate-500">
                  <div className="w-8 h-8 border-4 border-[#b11e29] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  Loading buildings...
                </div>
              ) : error ? (
                <div className="p-12 text-center text-rose-500">
                  Error loading buildings: {error.message}
                </div>
              ) : !buildings || buildings.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-medium">No buildings found</p>
                  <p className="text-sm mt-1">Get started by adding your first building</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Building
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Floors
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Area
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {buildings.map((building) => (
                      <tr key={building.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {building.imageUrl ? (
                              <img
                                src={building.imageUrl}
                                alt={building.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-slate-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-slate-900">{building.name}</p>
                              {building.description && (
                                <p className="text-sm text-slate-500 truncate max-w-xs">
                                  {building.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {building.address}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {building.totalFloors}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {building.totalArea.toLocaleString()} m²
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            building.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-800'
                              : building.status === 'maintenance'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {building.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(building)}
                              className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(building.id)}
                              disabled={deleteMutation.isPending}
                              className="px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
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
          </div>
        </div>
      </main>

      {/* Modal */}
      <BuildingFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        building={editingBuilding}
      />
    </>
  )
}
