import type { Building, Floor, Space, PricingRule, SpaceType } from '../types/property'

// Mock delay helper
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

// ========== MOCK DATA ==========

export const mockBuildings: Building[] = [
  {
    id: '1',
    name: 'Cobi Building 1',
    address: '123 Nguyễn Trãi, Quận 1, TP. HCM',
    totalFloors: 5,
    totalArea: 2500,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    description: 'Tòa nhà chính với đầy đủ tiện ích hiện đại',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Cobi Building 2',
    address: '456 Lê Lợi, Quận 1, TP. HCM',
    totalFloors: 7,
    totalArea: 3500,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    description: 'Tòa nhà mở rộng với không gian rộng rãi',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
]

export const mockFloors: Floor[] = [
  // Building 1 floors
  { id: 'f1', buildingId: '1', floorNumber: 1, floorName: 'Ground Floor', area: 500, status: 'active', spacesCount: 3, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'f2', buildingId: '1', floorNumber: 2, area: 500, status: 'active', spacesCount: 4, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'f3', buildingId: '1', floorNumber: 3, area: 500, status: 'active', spacesCount: 2, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'f4', buildingId: '1', floorNumber: 4, area: 500, status: 'active', spacesCount: 2, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'f5', buildingId: '1', floorNumber: 5, area: 500, status: 'active', spacesCount: 1, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  
  // Building 2 floors
  { id: 'f6', buildingId: '2', floorNumber: 1, floorName: 'Lobby', area: 500, status: 'active', spacesCount: 2, createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: 'f7', buildingId: '2', floorNumber: 2, area: 500, status: 'active', spacesCount: 3, createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: 'f8', buildingId: '2', floorNumber: 3, area: 500, status: 'active', spacesCount: 3, createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
]

export const mockSpaces: Space[] = [
  // Building 1 - Floor 1
  {
    id: 's1',
    buildingId: '1',
    floorId: 'f1',
    name: 'Hot Desk Zone A',
    type: 'hot_desk' as SpaceType,
    capacity: 20,
    area: 150,
    amenities: ['WiFi', 'Power Outlets', 'Coffee'],
    status: 'available',
    contractRequired: false,    // T&C only
    imageUrls: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    description: 'Khu vực hot desk rộng rãi với view đẹp',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 's2',
    buildingId: '1',
    floorId: 'f1',
    name: 'Meeting Room 101',
    type: 'meeting_room' as SpaceType,
    capacity: 6,
    area: 25,
    amenities: ['WiFi', 'TV Screen', 'Whiteboard'],
    status: 'available',
    contractRequired: false,    // T&C only
    imageUrls: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 's3',
    buildingId: '1',
    floorId: 'f1',
    name: 'Private Office 102',
    type: 'private_office' as SpaceType,
    capacity: 4,
    area: 30,
    amenities: ['WiFi', 'Desk', 'Chairs', 'Locker'],
    status: 'occupied',
    contractRequired: true,     // Formal Contract
    imageUrls: [],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  
  // Building 1 - Floor 2
  {
    id: 's4',
    buildingId: '1',
    floorId: 'f2',
    name: 'Dedicated Desk Zone B',
    type: 'dedicated_desk' as SpaceType,
    capacity: 10,
    area: 100,
    amenities: ['WiFi', 'Locker', 'Desk Lamp'],
    status: 'available',
    contractRequired: true,     // Formal Contract
    imageUrls: [],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 's5',
    buildingId: '1',
    floorId: 'f2',
    name: 'Conference Room 201',
    type: 'conference_room' as SpaceType,
    capacity: 20,
    area: 80,
    amenities: ['WiFi', 'Projector', 'Whiteboard', 'Video Conference'],
    status: 'available',
    contractRequired: false,    // T&C only
    imageUrls: [],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  
  // Building 2 - Floor 1
  {
    id: 's6',
    buildingId: '2',
    floorId: 'f6',
    name: 'Open Space Area 1',
    type: 'open_space' as SpaceType,
    capacity: 50,
    area: 300,
    amenities: ['WiFi', 'Coffee', 'Printer', 'Phone Booth'],
    status: 'available',
    contractRequired: false,    // T&C only
    imageUrls: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
]

export const mockPricingRules: PricingRule[] = [
  {
    id: 'pr1',
    spaceType: 'hot_desk' as SpaceType,
    pricePerHour: 50000,
    pricePerDay: 300000,
    pricePerWeek: 1800000,
    pricePerMonth: 5000000,
    weekendDiscount: 10,
    effectiveFrom: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'pr2',
    spaceType: 'dedicated_desk' as SpaceType,
    pricePerDay: 400000,
    pricePerMonth: 7000000,
    longTermDiscount: [
      { months: 3, discountPercent: 5 },
      { months: 6, discountPercent: 10 },
      { months: 12, discountPercent: 15 },
    ],
    effectiveFrom: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'pr3',
    spaceType: 'private_office' as SpaceType,
    pricePerMonth: 15000000,
    longTermDiscount: [
      { months: 6, discountPercent: 10 },
      { months: 12, discountPercent: 20 },
    ],
    effectiveFrom: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'pr4',
    spaceType: 'meeting_room' as SpaceType,
    pricePerHour: 200000,
    pricePerDay: 1500000,
    weekendDiscount: 15,
    effectiveFrom: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'pr5',
    spaceType: 'conference_room' as SpaceType,
    pricePerHour: 500000,
    pricePerDay: 3500000,
    effectiveFrom: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
]

// ========== MOCK API FUNCTIONS ==========

export const mockPropertyAPI = {
  // Buildings
  getBuildings: async (filters?: any) => {
    await mockDelay()
    let result = [...mockBuildings]
    if (filters?.status) {
      result = result.filter(b => b.status === filters.status)
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(b => 
        b.name.toLowerCase().includes(search) || 
        b.address.toLowerCase().includes(search)
      )
    }
    return result
  },

  getBuilding: async (id: string) => {
    await mockDelay()
    const building = mockBuildings.find(b => b.id === id)
    if (!building) throw new Error('Building not found')
    return building
  },

  createBuilding: async (data: any) => {
    await mockDelay()
    const newBuilding: Building = {
      id: `mock-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockBuildings.push(newBuilding)
    return newBuilding
  },

  updateBuilding: async ({ id, ...data }: any) => {
    await mockDelay()
    const index = mockBuildings.findIndex(b => b.id === id)
    if (index === -1) throw new Error('Building not found')
    mockBuildings[index] = {
      ...mockBuildings[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return mockBuildings[index]
  },

  deleteBuilding: async (id: string) => {
    await mockDelay()
    const hasFloors = mockFloors.some(f => f.buildingId === id)
    if (hasFloors) {
      throw new Error('Cannot delete building with existing floors')
    }
    const index = mockBuildings.findIndex(b => b.id === id)
    if (index === -1) throw new Error('Building not found')
    mockBuildings.splice(index, 1)
  },

  // Floors
  getFloors: async (filters?: any) => {
    await mockDelay()
    let result = [...mockFloors]
    if (filters?.buildingId) {
      result = result.filter(f => f.buildingId === filters.buildingId)
    }
    if (filters?.status) {
      result = result.filter(f => f.status === filters.status)
    }
    return result.sort((a, b) => a.floorNumber - b.floorNumber)
  },

  getFloor: async (id: string) => {
    await mockDelay()
    const floor = mockFloors.find(f => f.id === id)
    if (!floor) throw new Error('Floor not found')
    return floor
  },

  createFloor: async (data: any) => {
    await mockDelay()
    const newFloor: Floor = {
      id: `mock-floor-${Date.now()}`,
      ...data,
      spacesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockFloors.push(newFloor)
    return newFloor
  },

  updateFloor: async ({ id, ...data }: any) => {
    await mockDelay()
    const index = mockFloors.findIndex(f => f.id === id)
    if (index === -1) throw new Error('Floor not found')
    mockFloors[index] = {
      ...mockFloors[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return mockFloors[index]
  },

  deleteFloor: async (id: string) => {
    await mockDelay()
    const hasSpaces = mockSpaces.some(s => s.floorId === id)
    if (hasSpaces) {
      throw new Error('Cannot delete floor with existing spaces')
    }
    const index = mockFloors.findIndex(f => f.id === id)
    if (index === -1) throw new Error('Floor not found')
    mockFloors.splice(index, 1)
  },

  // Spaces
  getSpaces: async (filters?: any) => {
    await mockDelay()
    let result = [...mockSpaces]
    if (filters?.buildingId) {
      result = result.filter(s => s.buildingId === filters.buildingId)
    }
    if (filters?.floorId) {
      result = result.filter(s => s.floorId === filters.floorId)
    }
    if (filters?.type) {
      result = result.filter(s => s.type === filters.type)
    }
    if (filters?.status) {
      result = result.filter(s => s.status === filters.status)
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(s => s.name.toLowerCase().includes(search))
    }
    return result
  },

  getSpace: async (id: string) => {
    await mockDelay()
    const space = mockSpaces.find(s => s.id === id)
    if (!space) throw new Error('Space not found')
    return space
  },

  createSpace: async (data: any) => {
    await mockDelay()
    const newSpace: Space = {
      id: `mock-space-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockSpaces.push(newSpace)
    // Update floor spaces count
    const floor = mockFloors.find(f => f.id === data.floorId)
    if (floor) {
      floor.spacesCount = (floor.spacesCount || 0) + 1
    }
    return newSpace
  },

  updateSpace: async ({ id, ...data }: any) => {
    await mockDelay()
    const index = mockSpaces.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Space not found')
    mockSpaces[index] = {
      ...mockSpaces[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return mockSpaces[index]
  },

  deleteSpace: async (id: string) => {
    await mockDelay()
    const space = mockSpaces.find(s => s.id === id)
    if (!space) throw new Error('Space not found')
    
    const index = mockSpaces.findIndex(s => s.id === id)
    mockSpaces.splice(index, 1)
    
    // Update floor spaces count
    const floor = mockFloors.find(f => f.id === space.floorId)
    if (floor && floor.spacesCount) {
      floor.spacesCount = floor.spacesCount - 1
    }
  },

  // Pricing
  getPricingRules: async (filters?: any) => {
    await mockDelay()
    let result = [...mockPricingRules]
    if (filters?.spaceId) {
      result = result.filter(pr => pr.spaceId === filters.spaceId)
    }
    if (filters?.spaceType) {
      result = result.filter(pr => pr.spaceType === filters.spaceType)
    }
    if (filters?.buildingId) {
      result = result.filter(pr => pr.buildingId === filters.buildingId)
    }
    if (filters?.isActive) {
      const now = new Date().toISOString()
      result = result.filter(pr => {
        const isAfterStart = pr.effectiveFrom <= now
        const isBeforeEnd = !pr.effectiveTo || pr.effectiveTo >= now
        return isAfterStart && isBeforeEnd
      })
    }
    return result
  },

  getPricingRule: async (id: string) => {
    await mockDelay()
    const rule = mockPricingRules.find(pr => pr.id === id)
    if (!rule) throw new Error('Pricing rule not found')
    return rule
  },

  createPricingRule: async (data: any) => {
    await mockDelay()
    const newRule: PricingRule = {
      id: `mock-pr-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockPricingRules.push(newRule)
    return newRule
  },

  updatePricingRule: async ({ id, ...data }: any) => {
    await mockDelay()
    const index = mockPricingRules.findIndex(pr => pr.id === id)
    if (index === -1) throw new Error('Pricing rule not found')
    mockPricingRules[index] = {
      ...mockPricingRules[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return mockPricingRules[index]
  },

  deletePricingRule: async (id: string) => {
    await mockDelay()
    const index = mockPricingRules.findIndex(pr => pr.id === id)
    if (index === -1) throw new Error('Pricing rule not found')
    mockPricingRules.splice(index, 1)
  },
}
