import type {
  Asset,
  MaintenanceLog,
  AssetMovement,
  CreateAssetRequest,
  UpdateAssetRequest,
  CreateMaintenanceLogRequest,
  CompleteMaintenanceRequest,
  AssetFilters,
  MaintenanceFilters,
} from '../types/inventory'

// ─── Helpers ─────────────────────────────────────────────────
const mockDelay = (ms = 400) => new Promise<void>(resolve => setTimeout(resolve, ms))

let assetCounter = 12
const genCode = () => `AST-${String(++assetCounter).padStart(3, '0')}`
let logCounter = 8

// ─── Mock Assets ─────────────────────────────────────────────
export let mockAssets: Asset[] = [
  {
    id: 'a1',
    assetCode: 'AST-001',
    name: 'Dell Monitor 24-inch U2422H',
    category: 'it_equipment',
    serialNumber: 'DELL-MNT-001',
    manufacturer: 'Dell',
    model: 'U2422H',
    buildingId: '1',
    buildingName: 'Cobi Building 1',
    spaceId: 's1',
    spaceName: 'Hot Desk Zone A',
    purchaseDate: '2024-01-10',
    purchaseCost: 5_200_000,
    warrantyExpiryDate: '2027-01-10',
    status: 'active',
    condition: 'excellent',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'a2',
    assetCode: 'AST-002',
    name: 'Daikin Điều hòa 18000 BTU',
    category: 'appliance',
    serialNumber: 'DAIKIN-AC-001',
    manufacturer: 'Daikin',
    model: 'FTKA50UAVMV',
    buildingId: '1',
    buildingName: 'Cobi Building 1',
    spaceId: 's3',
    spaceName: 'Private Office 102',
    purchaseDate: '2024-01-15',
    purchaseCost: 18_500_000,
    warrantyExpiryDate: '2026-01-15',
    status: 'maintenance',
    condition: 'fair',
    notes: 'Lạnh không đều, cần vệ sinh dàn lạnh',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2026-03-20T08:00:00Z',
  },
  {
    id: 'a3',
    assetCode: 'AST-003',
    name: 'Bàn làm việc đôi SMARTEN',
    category: 'furniture',
    manufacturer: 'SMARTEN',
    model: 'WD-180',
    buildingId: '1',
    buildingName: 'Cobi Building 1',
    spaceId: 's1',
    spaceName: 'Hot Desk Zone A',
    purchaseDate: '2024-01-15',
    purchaseCost: 3_200_000,
    status: 'active',
    condition: 'good',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'a4',
    assetCode: 'AST-004',
    name: 'Máy chiếu Epson EB-X51',
    category: 'office_equipment',
    serialNumber: 'EPSON-PRJ-007',
    manufacturer: 'Epson',
    model: 'EB-X51',
    buildingId: '2',
    buildingName: 'Cobi Building 2',
    spaceId: 's2',
    spaceName: 'Meeting Room 101',
    purchaseDate: '2024-02-01',
    purchaseCost: 12_000_000,
    warrantyExpiryDate: '2026-02-01',
    status: 'broken',
    condition: 'poor',
    notes: 'Bóng đèn bị cháy',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2026-04-10T14:00:00Z',
  },
  {
    id: 'a5',
    assetCode: 'AST-005',
    name: 'Tủ lạnh Samsung RT22',
    category: 'appliance',
    serialNumber: 'SAMSUNG-RF-003',
    manufacturer: 'Samsung',
    model: 'RT22HAR4DSA',
    buildingId: '1',
    buildingName: 'Cobi Building 1',
    purchaseCost: 7_500_000,
    status: 'available',
    condition: 'good',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'a6',
    assetCode: 'AST-006',
    name: 'Máy pha cà phê Delonghi',
    category: 'pantry',
    serialNumber: 'DL-CF-2024-01',
    manufacturer: 'Delonghi',
    model: 'ECAM22.110.B',
    buildingId: '2',
    buildingName: 'Cobi Building 2',
    spaceId: 's2',
    spaceName: 'Meeting Room 101',
    purchaseDate: '2024-02-15',
    purchaseCost: 9_800_000,
    status: 'active',
    condition: 'excellent',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
  },
  {
    id: 'a7',
    assetCode: 'AST-007',
    name: 'Whiteboard 120x90cm',
    category: 'office_equipment',
    buildingId: '1',
    buildingName: 'Cobi Building 1',
    spaceId: 's3',
    spaceName: 'Private Office 102',
    purchaseCost: 850_000,
    status: 'active',
    condition: 'good',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'a8',
    assetCode: 'AST-008',
    name: 'Ghế xoay Herman Miller',
    category: 'furniture',
    manufacturer: 'Herman Miller',
    model: 'Aeron Classic',
    buildingId: '2',
    buildingName: 'Cobi Building 2',
    purchaseCost: 22_000_000,
    status: 'retired',
    condition: 'broken',
    notes: 'Cơ chế ngả lưng bị hỏng, không sửa được',
    createdAt: '2023-06-01T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
  },
]

// ─── Mock Maintenance Logs ────────────────────────────────────
export let mockMaintenanceLogs: MaintenanceLog[] = [
  {
    id: 'ml1',
    assetId: 'a2',
    assetCode: 'AST-002',
    assetName: 'Daikin Điều hòa 18000 BTU',
    type: 'repair',
    description: 'Vệ sinh dàn lạnh, kiểm tra gas',
    scheduledDate: '2026-04-20',
    cost: 500_000,
    vendor: 'Daikin Service Center',
    status: 'scheduled',
    performedBy: 'Nguyễn Bảo Trì',
    createdAt: '2026-04-10T08:00:00Z',
  },
  {
    id: 'ml2',
    assetId: 'a4',
    assetCode: 'AST-004',
    assetName: 'Máy chiếu Epson EB-X51',
    type: 'repair',
    description: 'Thay bóng đèn máy chiếu bị cháy',
    scheduledDate: '2026-04-18',
    cost: 2_500_000,
    vendor: 'Epson Vietnam',
    status: 'in_progress',
    performedBy: 'Trần Kỹ Thuật',
    createdAt: '2026-04-12T14:00:00Z',
  },
  {
    id: 'ml3',
    assetId: 'a1',
    assetCode: 'AST-001',
    assetName: 'Dell Monitor 24-inch U2422H',
    type: 'inspection',
    description: 'Kiểm tra định kỳ 6 tháng',
    scheduledDate: '2026-03-01',
    completedDate: '2026-03-01',
    cost: 0,
    status: 'completed',
    resultNotes: 'Monitor hoạt động tốt, không có vấn đề',
    performedBy: 'Lê IT Support',
    createdAt: '2026-02-25T10:00:00Z',
  },
  {
    id: 'ml4',
    assetId: 'a3',
    assetCode: 'AST-003',
    assetName: 'Bàn làm việc đôi SMARTEN',
    type: 'routine',
    description: 'Kiểm tra, siết ốc cố định',
    scheduledDate: '2026-01-15',
    completedDate: '2026-01-15',
    cost: 0,
    status: 'completed',
    resultNotes: 'Siết lại các bu-lông, bàn vững chắc',
    performedBy: 'Nguyễn Bảo Trì',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'ml5',
    assetId: 'a8',
    assetCode: 'AST-008',
    assetName: 'Ghế xoay Herman Miller',
    type: 'repair',
    description: 'Sửa cơ chế ngả lưng',
    scheduledDate: '2026-01-20',
    completedDate: '2026-01-25',
    cost: 1_500_000,
    vendor: 'Nội thất Hòa Phát',
    status: 'cancelled',
    resultNotes: 'Không có phụ kiện thay thế, quyết định thanh lý',
    performedBy: 'Trần Kỹ Thuật',
    createdAt: '2026-01-18T10:00:00Z',
  },
]

// ─── Mock Movements ───────────────────────────────────────────
export let mockMovements: AssetMovement[] = [
  {
    id: 'mv1',
    assetId: 'a1',
    toSpaceId: 's1',
    toSpaceName: 'Hot Desk Zone A',
    assignedDate: '2024-01-20T10:00:00Z',
    assignedBy: 'Admin',
    notes: 'Phân bổ ban đầu',
  },
  {
    id: 'mv2',
    assetId: 'a5',
    fromSpaceId: 's4',
    fromSpaceName: 'Meeting Room 201',
    assignedDate: '2026-03-01T10:00:00Z',
    assignedBy: 'Manager',
    notes: 'Thu hồi về kho để kiểm tra',
  },
]

// ─── Mock API ─────────────────────────────────────────────────
export const mockInventoryAPI = {
  // Assets
  getAssets: async (filters?: AssetFilters): Promise<Asset[]> => {
    await mockDelay()
    let result = [...mockAssets]
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        a =>
          a.name.toLowerCase().includes(q) ||
          a.assetCode.toLowerCase().includes(q) ||
          a.serialNumber?.toLowerCase().includes(q)
      )
    }
    if (filters?.category) result = result.filter(a => a.category === filters.category)
    if (filters?.status) result = result.filter(a => a.status === filters.status)
    if (filters?.buildingId) result = result.filter(a => a.buildingId === filters.buildingId)
    return result
  },

  getAsset: async (id: string): Promise<Asset> => {
    await mockDelay()
    const asset = mockAssets.find(a => a.id === id)
    if (!asset) throw new Error('Asset not found')
    return asset
  },

  createAsset: async (data: CreateAssetRequest): Promise<Asset> => {
    await mockDelay(600)
    const newAsset: Asset = {
      ...data,
      id: `a${Date.now()}`,
      assetCode: genCode(),
      status: data.spaceId ? 'active' : 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockAssets = [newAsset, ...mockAssets]
    return newAsset
  },

  updateAsset: async (data: UpdateAssetRequest): Promise<Asset> => {
    await mockDelay(500)
    mockAssets = mockAssets.map(a =>
      a.id === data.id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
    )
    return mockAssets.find(a => a.id === data.id)!
  },

  deleteAsset: async (id: string): Promise<void> => {
    await mockDelay(400)
    const hasActiveLog = mockMaintenanceLogs.some(
      l => l.assetId === id && l.status === 'in_progress'
    )
    if (hasActiveLog) throw new Error('Không thể xóa asset đang có maintenance log đang chạy')
    mockAssets = mockAssets.filter(a => a.id !== id)
  },

  // Maintenance Logs
  getMaintenanceLogs: async (filters?: MaintenanceFilters): Promise<MaintenanceLog[]> => {
    await mockDelay()
    let result = [...mockMaintenanceLogs].sort(
      (a, b) => b.createdAt.localeCompare(a.createdAt)
    )
    if (filters?.assetId) result = result.filter(l => l.assetId === filters.assetId)
    if (filters?.type) result = result.filter(l => l.type === filters.type)
    if (filters?.status) result = result.filter(l => l.status === filters.status)
    return result
  },

  createMaintenanceLog: async (data: CreateMaintenanceLogRequest): Promise<MaintenanceLog> => {
    await mockDelay(600)
    const asset = mockAssets.find(a => a.id === data.assetId)
    const newLog: MaintenanceLog = {
      ...data,
      id: `ml${++logCounter}`,
      assetCode: asset?.assetCode,
      assetName: asset?.name,
      status: data.status ?? (data.scheduledDate ? 'scheduled' : 'in_progress'),
      createdAt: new Date().toISOString(),
    }
    // If repair → asset goes to maintenance
    if (data.type === 'repair' && asset && ['active', 'available', 'broken'].includes(asset.status)) {
      mockAssets = mockAssets.map(a =>
        a.id === data.assetId ? { ...a, status: 'maintenance', updatedAt: new Date().toISOString() } : a
      )
    }
    mockMaintenanceLogs = [newLog, ...mockMaintenanceLogs]
    return newLog
  },

  completeMaintenanceLog: async (data: CompleteMaintenanceRequest): Promise<MaintenanceLog> => {
    await mockDelay(500)
    let completed: MaintenanceLog | undefined
    mockMaintenanceLogs = mockMaintenanceLogs.map(l => {
      if (l.id === data.id) {
        completed = { ...l, status: 'completed', completedDate: data.completedDate, resultNotes: data.resultNotes }
        return completed
      }
      return l
    })
    // Return asset to active
    if (completed) {
      mockAssets = mockAssets.map(a => {
        if (a.id === completed!.assetId) {
          return {
            ...a,
            status: 'active',
            condition: data.newCondition ?? a.condition,
            updatedAt: new Date().toISOString(),
          }
        }
        return a
      })
    }
    return completed!
  },

  cancelMaintenanceLog: async (id: string): Promise<void> => {
    await mockDelay(400)
    const log = mockMaintenanceLogs.find(l => l.id === id)
    if (!log) return
    mockMaintenanceLogs = mockMaintenanceLogs.map(l =>
      l.id === id ? { ...l, status: 'cancelled' } : l
    )
    // Rollback asset if it was set to maintenance by this log
    mockAssets = mockAssets.map(a =>
      a.id === log.assetId && a.status === 'maintenance'
        ? { ...a, status: a.spaceId ? 'active' : 'available', updatedAt: new Date().toISOString() }
        : a
    )
  },

  // Movements
  getMovements: async (assetId: string): Promise<AssetMovement[]> => {
    await mockDelay(300)
    return mockMovements.filter(m => m.assetId === assetId)
      .sort((a, b) => b.assignedDate.localeCompare(a.assignedDate))
  },
}
