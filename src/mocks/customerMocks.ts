import type {
  CustomerListItem,
  CustomerDetails,
  Company,
  CompanyEmployee,
  Tag,
  CustomerBooking,
  CustomerContract,
  CustomerInvoice,
  PaginatedCustomers,
  EmployeesResponse,
  CustomerFilters,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CreateEmployeeRequest,
} from '../types/customer'

// ========== MOCK COMPANIES ==========

export const mockCompanies: Company[] = [
  {
    id: 'com-001',
    companyCode: 'COM-0001',
    companyName: 'ABC Technology Co., Ltd',
    legalName: 'Công ty TNHH Công nghệ ABC',
    taxCode: '0123456789',
    industry: 'IT',
    companySize: 'sme',
    foundedYear: 2018,
    registeredAddress: '456 Lê Lai, Quận 1, TP.HCM',
    officeAddress: '789 Nguyễn Huệ, Quận 1, TP.HCM',
    companyEmail: 'contact@abc-tech.vn',
    companyPhone: '02871234567',
    website: 'https://abc-tech.vn',
    status: 'active',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z',
    createdBy: 'staff-001',
  },
  {
    id: 'com-002',
    companyCode: 'COM-0002',
    companyName: 'XYZ Marketing Agency',
    taxCode: '0987654321',
    industry: 'Marketing',
    companySize: 'startup',
    foundedYear: 2022,
    registeredAddress: '123 Trần Hưng Đạo, Quận 1, TP.HCM',
    companyEmail: 'hello@xyz-marketing.vn',
    companyPhone: '02898765432',
    website: 'https://xyz-marketing.vn',
    status: 'active',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z',
    createdBy: 'staff-001',
  },
  {
    id: 'com-003',
    companyCode: 'COM-0003',
    companyName: 'Global Finance Corp',
    legalName: 'Công ty CP Tài chính Toàn cầu',
    taxCode: '0112233445',
    industry: 'Finance',
    companySize: 'enterprise',
    foundedYear: 2010,
    registeredAddress: '1000 Nguyễn Văn Linh, Quận 7, TP.HCM',
    officeAddress: '500 Tôn Đức Thắng, Quận 1, TP.HCM',
    companyEmail: 'info@globalfinance.vn',
    companyPhone: '02811223344',
    website: 'https://globalfinance.vn',
    status: 'active',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-01T08:00:00Z',
    createdBy: 'staff-002',
  },
]

// ========== MOCK CUSTOMERS ==========

export const mockCustomers: CustomerListItem[] = [
  // Individual customers
  {
    id: 'cus-001',
    customerCode: 'CUS-0001',
    customerType: 'individual',
    fullName: 'Nguyễn Văn An',
    email: 'an.nguyen@gmail.com',
    phone: '0901234567',
    status: 'active',
    tags: ['vip', 'long-term'],
    creditBalance: 15000,
    rewardBalance: 500,
    createdAt: '2026-01-05T09:00:00Z',
  },
  {
    id: 'cus-002',
    customerCode: 'CUS-0002',
    customerType: 'individual',
    fullName: 'Trần Thị Bình',
    email: 'binh.tran@yahoo.com',
    phone: '0912345678',
    status: 'active',
    tags: ['new'],
    creditBalance: 0,
    rewardBalance: 200,
    createdAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'cus-003',
    customerCode: 'CUS-0003',
    customerType: 'individual',
    fullName: 'Lê Văn Cường',
    email: 'cuong.le@outlook.com',
    phone: '0923456789',
    status: 'inactive',
    tags: ['at-risk'],
    creditBalance: 3000,
    rewardBalance: 0,
    createdAt: '2025-10-15T08:00:00Z',
  },
  {
    id: 'cus-004',
    customerCode: 'CUS-0004',
    customerType: 'individual',
    fullName: 'Phạm Thị Dung',
    email: 'dung.pham@gmail.com',
    phone: '0934567890',
    status: 'active',
    tags: ['referral'],
    creditBalance: 5000,
    rewardBalance: 150,
    createdAt: '2026-02-20T11:00:00Z',
  },
  {
    id: 'cus-005',
    customerCode: 'CUS-0005',
    customerType: 'individual',
    fullName: 'Hoàng Văn Em',
    email: 'em.hoang@gmail.com',
    phone: '0945678901',
    status: 'suspended',
    tags: [],
    creditBalance: 0,
    rewardBalance: 0,
    createdAt: '2025-08-10T09:00:00Z',
  },
  // Company customers
  {
    id: 'cus-006',
    customerCode: 'CUS-0006',
    customerType: 'company',
    fullName: 'ABC Technology Co., Ltd',
    email: 'contact@abc-tech.vn',
    phone: '02871234567',
    status: 'active',
    tags: ['vip', 'premium', 'long-term'],
    companyName: 'ABC Technology Co., Ltd',
    creditBalance: 50000,
    rewardBalance: 2000,
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'cus-007',
    customerCode: 'CUS-0007',
    customerType: 'company',
    fullName: 'XYZ Marketing Agency',
    email: 'hello@xyz-marketing.vn',
    phone: '02898765432',
    status: 'active',
    tags: ['new'],
    companyName: 'XYZ Marketing Agency',
    creditBalance: 10000,
    rewardBalance: 0,
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'cus-008',
    customerCode: 'CUS-0008',
    customerType: 'company',
    fullName: 'Global Finance Corp',
    email: 'info@globalfinance.vn',
    phone: '02811223344',
    status: 'active',
    tags: ['premium', 'long-term'],
    companyName: 'Global Finance Corp',
    creditBalance: 100000,
    rewardBalance: 5000,
    createdAt: '2026-03-01T08:00:00Z',
  },
  // More individual customers
  {
    id: 'cus-009',
    customerCode: 'CUS-0009',
    customerType: 'individual',
    fullName: 'Võ Văn Phúc',
    email: 'phuc.vo@gmail.com',
    phone: '0956789012',
    status: 'active',
    tags: ['premium'],
    creditBalance: 8000,
    rewardBalance: 300,
    createdAt: '2025-12-01T09:00:00Z',
  },
  {
    id: 'cus-010',
    customerCode: 'CUS-0010',
    customerType: 'individual',
    fullName: 'Đặng Thị Giang',
    email: 'giang.dang@yahoo.com',
    phone: '0967890123',
    status: 'active',
    tags: ['long-term'],
    creditBalance: 2000,
    rewardBalance: 100,
    createdAt: '2025-09-15T10:00:00Z',
  },
  {
    id: 'cus-011',
    customerCode: 'CUS-0011',
    customerType: 'individual',
    fullName: 'Bùi Văn Hải',
    email: 'hai.bui@outlook.com',
    phone: '0978901234',
    status: 'active',
    tags: [],
    creditBalance: 0,
    rewardBalance: 50,
    createdAt: '2026-03-20T08:00:00Z',
  },
  {
    id: 'cus-012',
    customerCode: 'CUS-0012',
    customerType: 'individual',
    fullName: 'Ngô Thị Inh',
    email: 'inh.ngo@gmail.com',
    phone: '0989012345',
    status: 'inactive',
    tags: [],
    creditBalance: 1000,
    rewardBalance: 0,
    createdAt: '2025-07-01T09:00:00Z',
  },
]

// ========== MOCK CUSTOMER DETAILS ==========

export const mockCustomerDetails: Record<string, CustomerDetails> = {
  'cus-001': {
    id: 'cus-001',
    customerCode: 'CUS-0001',
    customerType: 'individual',
    firstName: 'Nguyễn Văn',
    lastName: 'An',
    fullName: 'Nguyễn Văn An',
    dateOfBirth: '1990-05-15',
    nationalId: '001090012345',
    email: 'an.nguyen@gmail.com',
    phone: '0901234567',
    alternativePhone: '0281234567',
    address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
    tags: ['vip', 'long-term'],
    status: 'active',
    accountManager: 'staff-001',
    accountManagerInfo: { id: 'staff-001', name: 'Lê Thị Hương' },
    notes: 'Khách hàng VIP, ưu tiên chỗ ngồi cạnh cửa sổ.',
    createdAt: '2026-01-05T09:00:00Z',
    updatedAt: '2026-04-10T14:00:00Z',
    createdBy: 'staff-002',
    createdByInfo: { id: 'staff-002', name: 'Trần Văn Minh' },
    stats: {
      totalBookings: 45,
      activeContracts: 1,
      totalSpent: 125000000,
      outstandingBalance: 5000000,
    },
    // Credit Wallet (Cobi: 1 Cobi = 1.000 VND)
    creditBalance: 15000,
    rewardBalance: 500,
    creditSummary: {
      creditBalance: 15000,
      rewardBalance: 500,
      totalBalance: 15500,
      expiringWithin7Days: 200,
      activeRewardsCount: 2,
    },
    activeRewards: [
      {
        id: 'reward-001',
        customerId: 'cus-001',
        amount: 300,
        remainingAmount: 300,
        issuedAt: '2026-04-01T00:00:00Z',
        expiresAt: '2026-04-20T23:59:59Z',
        source: 'promotion',
        description: 'Khuyến mãi tháng 4/2026',
        status: 'active',
        createdAt: '2026-04-01T00:00:00Z',
        createdBy: 'system',
      },
      {
        id: 'reward-002',
        customerId: 'cus-001',
        amount: 200,
        remainingAmount: 200,
        issuedAt: '2026-04-10T00:00:00Z',
        expiresAt: '2026-05-10T23:59:59Z',
        source: 'referral',
        sourceId: 'cus-004',
        description: 'Thưởng giới thiệu khách hàng mới',
        status: 'active',
        createdAt: '2026-04-10T00:00:00Z',
        createdBy: 'system',
      },
    ],
  },
  'cus-006': {
    id: 'cus-006',
    customerCode: 'CUS-0006',
    customerType: 'company',
    fullName: 'ABC Technology Co., Ltd',
    contactPersonName: 'Trần Văn Bảo',
    contactPersonTitle: 'Office Manager',
    email: 'bao.tran@abc-tech.vn',
    phone: '0907654321',
    alternativePhone: '02871234567',
    address: '789 Nguyễn Huệ, Quận 1, TP.HCM',
    companyId: 'com-001',
    company: mockCompanies[0],
    tags: ['vip', 'premium', 'long-term'],
    status: 'active',
    accountManager: 'staff-001',
    accountManagerInfo: { id: 'staff-001', name: 'Lê Thị Hương' },
    notes: 'Khách hàng enterprise, có 15 nhân viên đang sử dụng.',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-04-15T11:00:00Z',
    createdBy: 'staff-001',
    createdByInfo: { id: 'staff-001', name: 'Lê Thị Hương' },
    stats: {
      totalBookings: 120,
      activeContracts: 2,
      totalSpent: 450000000,
      outstandingBalance: 15000000,
    },
    // Credit Wallet (Cobi: 1 Cobi = 1.000 VND)
    creditBalance: 50000,
    rewardBalance: 2000,
    creditSummary: {
      creditBalance: 50000,
      rewardBalance: 2000,
      totalBalance: 52000,
      expiringWithin7Days: 0,
      activeRewardsCount: 1,
    },
    activeRewards: [
      {
        id: 'reward-003',
        customerId: 'cus-006',
        amount: 2000,
        remainingAmount: 2000,
        issuedAt: '2026-03-01T00:00:00Z',
        expiresAt: '2026-06-01T23:59:59Z',
        source: 'loyalty',
        description: 'Thưởng khách hàng thân thiết Q1/2026',
        status: 'active',
        createdAt: '2026-03-01T00:00:00Z',
        createdBy: 'system',
      },
    ],
  },
}

// ========== MOCK COMPANY EMPLOYEES ==========

export const mockEmployees: Record<string, CompanyEmployee[]> = {
  'cus-006': [
    {
      id: 'emp-001',
      employeeCode: 'EMP-COM-0001-001',
      companyId: 'com-001',
      customerId: 'cus-006',
      firstName: 'Trần Văn',
      lastName: 'Bảo',
      fullName: 'Trần Văn Bảo',
      email: 'bao.tran@abc-tech.vn',
      phone: '0907654321',
      employeeId: 'ABC-001',
      title: 'Office Manager',
      department: 'Administration',
      canBookSpaces: true,
      canViewInvoices: true,
      canManageEmployees: true,
      hasAccessCard: true,
      accessCardNumber: 'AC-00100',
      accessCardIssuedAt: '2026-01-15T09:00:00Z',
      status: 'active',
      startDate: '2026-01-10',
      createdAt: '2026-01-10T09:00:00Z',
      updatedAt: '2026-01-10T09:00:00Z',
      createdBy: 'staff-001',
    },
    {
      id: 'emp-002',
      employeeCode: 'EMP-COM-0001-002',
      companyId: 'com-001',
      customerId: 'cus-006',
      firstName: 'Lê Thị',
      lastName: 'Cúc',
      fullName: 'Lê Thị Cúc',
      email: 'cuc.le@abc-tech.vn',
      phone: '0918765432',
      employeeId: 'ABC-002',
      title: 'Senior Developer',
      department: 'Engineering',
      canBookSpaces: true,
      canViewInvoices: false,
      canManageEmployees: false,
      hasAccessCard: true,
      accessCardNumber: 'AC-00101',
      accessCardIssuedAt: '2026-01-20T10:00:00Z',
      status: 'active',
      startDate: '2026-01-15',
      createdAt: '2026-01-15T09:00:00Z',
      updatedAt: '2026-01-15T09:00:00Z',
      createdBy: 'staff-001',
    },
    {
      id: 'emp-003',
      employeeCode: 'EMP-COM-0001-003',
      companyId: 'com-001',
      customerId: 'cus-006',
      firstName: 'Nguyễn Văn',
      lastName: 'Đức',
      fullName: 'Nguyễn Văn Đức',
      email: 'duc.nguyen@abc-tech.vn',
      phone: '0929876543',
      employeeId: 'ABC-003',
      title: 'Designer',
      department: 'Design',
      canBookSpaces: false,
      canViewInvoices: false,
      canManageEmployees: false,
      hasAccessCard: false,
      status: 'active',
      startDate: '2026-02-01',
      createdAt: '2026-02-01T09:00:00Z',
      updatedAt: '2026-02-01T09:00:00Z',
      createdBy: 'staff-001',
    },
    {
      id: 'emp-004',
      employeeCode: 'EMP-COM-0001-004',
      companyId: 'com-001',
      customerId: 'cus-006',
      firstName: 'Phạm Thị',
      lastName: 'Hoa',
      fullName: 'Phạm Thị Hoa',
      email: 'hoa.pham@abc-tech.vn',
      employeeId: 'ABC-004',
      title: 'Marketing Executive',
      department: 'Marketing',
      canBookSpaces: true,
      canViewInvoices: false,
      canManageEmployees: false,
      hasAccessCard: true,
      accessCardNumber: 'AC-00102',
      accessCardIssuedAt: '2026-02-15T10:00:00Z',
      status: 'inactive',
      startDate: '2026-02-10',
      endDate: '2026-04-01',
      createdAt: '2026-02-10T09:00:00Z',
      updatedAt: '2026-04-01T11:00:00Z',
      createdBy: 'staff-001',
      deactivatedAt: '2026-04-01T11:00:00Z',
      deactivatedBy: 'staff-001',
    },
  ],
}

// ========== MOCK BOOKINGS ==========

export const mockCustomerBookings: Record<string, CustomerBooking[]> = {
  'cus-001': [
    {
      id: 'bk-001',
      bookingCode: 'BK-00125',
      spaceName: 'Meeting Room A',
      buildingName: 'Cobi Tower A',
      floorLabel: '2F',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '11:00',
      status: 'confirmed',
      totalAmount: 500000,
    },
    {
      id: 'bk-002',
      bookingCode: 'BK-00126',
      spaceName: 'Hot Desk Zone B',
      buildingName: 'Cobi Tower A',
      floorLabel: '3F',
      date: '2026-04-22',
      startTime: '08:00',
      endTime: '17:00',
      status: 'pending',
      totalAmount: 350000,
    },
    {
      id: 'bk-003',
      bookingCode: 'BK-00100',
      spaceName: 'Conference Room',
      buildingName: 'Cobi Tower B',
      floorLabel: '4F',
      date: '2026-04-10',
      startTime: '14:00',
      endTime: '16:00',
      status: 'completed',
      totalAmount: 800000,
    },
    {
      id: 'bk-004',
      bookingCode: 'BK-00080',
      spaceName: 'Hot Desk Zone A',
      buildingName: 'Cobi Tower A',
      floorLabel: '2F',
      date: '2026-04-05',
      startTime: '09:00',
      endTime: '18:00',
      status: 'completed',
      totalAmount: 400000,
    },
    {
      id: 'bk-005',
      bookingCode: 'BK-00050',
      spaceName: 'Meeting Room B',
      buildingName: 'Cobi Tower A',
      floorLabel: '3F',
      date: '2026-03-28',
      startTime: '10:00',
      endTime: '12:00',
      status: 'cancelled',
      totalAmount: 500000,
    },
  ],
}

// ========== MOCK CONTRACTS ==========

export const mockCustomerContracts: Record<string, CustomerContract[]> = {
  'cus-001': [
    {
      id: 'ct-001',
      contractCode: 'CT-00050',
      spaceName: 'Dedicated Desk D15',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      status: 'active',
      monthlyValue: 5000000,
      daysRemaining: 258,
    },
  ],
  'cus-006': [
    {
      id: 'ct-002',
      contractCode: 'CT-00045',
      spaceName: 'Private Office 101',
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      status: 'active',
      monthlyValue: 25000000,
      daysRemaining: 74,
    },
    {
      id: 'ct-003',
      contractCode: 'CT-00046',
      spaceName: 'Private Office 102',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      status: 'active',
      monthlyValue: 20000000,
      daysRemaining: 258,
    },
  ],
}

// ========== MOCK INVOICES ==========

export const mockCustomerInvoices: Record<string, CustomerInvoice[]> = {
  'cus-001': [
    {
      id: 'inv-001',
      invoiceCode: 'INV-2026-0150',
      description: 'Dedicated Desk D15 - Tháng 04/2026',
      issueDate: '2026-04-01',
      dueDate: '2026-04-15',
      amount: 5000000,
      status: 'paid',
      paidAmount: 5000000,
    },
    {
      id: 'inv-002',
      invoiceCode: 'INV-2026-0120',
      description: 'Dedicated Desk D15 - Tháng 03/2026',
      issueDate: '2026-03-01',
      dueDate: '2026-03-15',
      amount: 5000000,
      status: 'paid',
      paidAmount: 5000000,
    },
    {
      id: 'inv-003',
      invoiceCode: 'INV-2026-0180',
      description: 'Booking Meeting Room - 20/04/2026',
      issueDate: '2026-04-15',
      dueDate: '2026-04-25',
      amount: 500000,
      status: 'sent',
      paidAmount: 0,
    },
  ],
  'cus-006': [
    {
      id: 'inv-004',
      invoiceCode: 'INV-2026-0140',
      description: 'Private Office 101 & 102 - Tháng 04/2026',
      issueDate: '2026-04-01',
      dueDate: '2026-04-15',
      amount: 45000000,
      status: 'overdue',
      paidAmount: 30000000,
    },
    {
      id: 'inv-005',
      invoiceCode: 'INV-2026-0110',
      description: 'Private Office 101 & 102 - Tháng 03/2026',
      issueDate: '2026-03-01',
      dueDate: '2026-03-15',
      amount: 45000000,
      status: 'paid',
      paidAmount: 45000000,
    },
  ],
}

// ========== MOCK TAGS ==========

export const mockTags: Tag[] = [
  {
    id: 'tag-vip',
    name: 'vip',
    displayName: 'VIP',
    color: '#eab308',
    description: 'Khách hàng VIP, cần ưu tiên chăm sóc đặc biệt',
    type: 'system',
    autoAssign: false,
    customerCount: 2,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tag-long-term',
    name: 'long-term',
    displayName: 'Long-term',
    color: '#22c55e',
    description: 'Khách hàng có hợp đồng dài hạn (> 6 tháng)',
    type: 'system',
    autoAssign: true,
    customerCount: 4,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tag-referral',
    name: 'referral',
    displayName: 'Referral',
    color: '#3b82f6',
    description: 'Khách hàng đã giới thiệu khách mới',
    type: 'system',
    autoAssign: true,
    customerCount: 1,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tag-new',
    name: 'new',
    displayName: 'New',
    color: '#06b6d4',
    description: 'Khách hàng mới (< 30 ngày)',
    type: 'system',
    autoAssign: true,
    customerCount: 2,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tag-premium',
    name: 'premium',
    displayName: 'Premium',
    color: '#8b5cf6',
    description: 'Khách hàng chi tiêu cao (> 100M)',
    type: 'system',
    autoAssign: true,
    customerCount: 2,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tag-at-risk',
    name: 'at-risk',
    displayName: 'At-risk',
    color: '#ef4444',
    description: 'Khách hàng không hoạt động > 90 ngày',
    type: 'system',
    autoAssign: true,
    customerCount: 1,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tag-partner',
    name: 'partner',
    displayName: 'Partner',
    color: '#14b8a6',
    description: 'Đối tác chiến lược',
    type: 'custom',
    autoAssign: false,
    customerCount: 0,
    createdAt: '2026-03-01T10:00:00Z',
    createdBy: 'staff-001',
  },
]

// ========== MOCK API FUNCTIONS ==========

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockCustomerAPI = {
  // Get paginated customers
  getCustomers: async (filters?: CustomerFilters): Promise<PaginatedCustomers> => {
    await delay(300)
    
    let items = [...mockCustomers]
    
    // Apply search
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      items = items.filter(c => 
        c.fullName.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.phone.includes(search) ||
        c.customerCode.toLowerCase().includes(search) ||
        c.companyName?.toLowerCase().includes(search)
      )
    }
    
    // Apply status filter
    if (filters?.status) {
      items = items.filter(c => c.status === filters.status)
    }
    
    // Apply type filter
    if (filters?.type) {
      items = items.filter(c => c.customerType === filters.type)
    }
    
    // Apply tags filter
    if (filters?.tags && filters.tags.length > 0) {
      items = items.filter(c => 
        filters.tags!.every(tag => c.tags.includes(tag))
      )
    }
    
    // Apply sorting
    const sortBy = filters?.sortBy || 'createdAt'
    const sortOrder = filters?.sortOrder || 'desc'
    items.sort((a, b) => {
      let valueA: string | number
      let valueB: string | number
      
      if (sortBy === 'createdAt') {
        valueA = new Date(a.createdAt).getTime()
        valueB = new Date(b.createdAt).getTime()
      } else if (sortBy === 'fullName') {
        valueA = a.fullName.toLowerCase()
        valueB = b.fullName.toLowerCase()
      } else {
        valueA = a.customerCode
        valueB = b.customerCode
      }
      
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1
      }
      return valueA < valueB ? 1 : -1
    })
    
    // Apply pagination
    const page = filters?.page || 1
    const pageSize = filters?.pageSize || 10
    const startIndex = (page - 1) * pageSize
    const paginatedItems = items.slice(startIndex, startIndex + pageSize)
    
    return {
      items: paginatedItems,
      pagination: {
        page,
        pageSize,
        totalItems: items.length,
        totalPages: Math.ceil(items.length / pageSize),
      },
    }
  },
  
  // Get customer by ID
  getCustomer: async (id: string): Promise<CustomerDetails | null> => {
    await delay(200)
    
    // Check if full details exist
    if (mockCustomerDetails[id]) {
      return mockCustomerDetails[id]
    }
    
    // If not, try to build from customer list
    const basicCustomer = mockCustomers.find(c => c.id === id)
    if (!basicCustomer) {
      return null
    }
    
    // Build CustomerDetails from CustomerListItem
    const details: CustomerDetails = {
      id: basicCustomer.id,
      customerCode: basicCustomer.customerCode,
      customerType: basicCustomer.customerType,
      fullName: basicCustomer.fullName,
      email: basicCustomer.email,
      phone: basicCustomer.phone,
      tags: basicCustomer.tags,
      status: basicCustomer.status,
      createdAt: basicCustomer.createdAt,
      updatedAt: basicCustomer.createdAt,
      createdBy: 'staff-001',
      createdByInfo: { id: 'staff-001', name: 'Lê Thị Hương' },
      stats: {
        totalBookings: Math.floor(Math.random() * 20),
        activeContracts: basicCustomer.status === 'active' ? Math.floor(Math.random() * 3) : 0,
        totalSpent: Math.floor(Math.random() * 50000000),
        outstandingBalance: Math.floor(Math.random() * 5000000),
      },
      // Credit Wallet
      creditBalance: basicCustomer.creditBalance,
      rewardBalance: basicCustomer.rewardBalance,
      creditSummary: {
        creditBalance: basicCustomer.creditBalance,
        rewardBalance: basicCustomer.rewardBalance,
        totalBalance: basicCustomer.creditBalance + basicCustomer.rewardBalance,
        expiringWithin7Days: 0,
        activeRewardsCount: basicCustomer.rewardBalance > 0 ? 1 : 0,
      },
      activeRewards: [],
    }
    
    // Add individual-specific fields
    if (basicCustomer.customerType === 'individual') {
      const nameParts = basicCustomer.fullName.split(' ')
      details.lastName = nameParts.pop() || ''
      details.firstName = nameParts.join(' ')
    }
    
    // Add company-specific fields
    if (basicCustomer.customerType === 'company') {
      const company = mockCompanies.find(c => c.companyName === basicCustomer.companyName)
      if (company) {
        details.companyId = company.id
        details.company = company
      }
      details.contactPersonName = 'Người liên hệ'
      details.contactPersonTitle = 'Admin'
    }
    
    return details
  },
  
  // Create customer
  createCustomer: async (data: CreateCustomerRequest): Promise<CustomerDetails> => {
    await delay(400)
    const newId = `cus-${String(mockCustomers.length + 1).padStart(3, '0')}`
    const newCode = `CUS-${String(mockCustomers.length + 1).padStart(4, '0')}`
    
    const fullName = data.customerType === 'individual'
      ? `${data.firstName || ''} ${data.lastName || ''}`.trim()
      : data.companyName || ''
    
    const newCustomer: CustomerDetails = {
      id: newId,
      customerCode: newCode,
      customerType: data.customerType,
      fullName,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      alternativePhone: data.alternativePhone,
      address: data.address,
      tags: data.tags || [],
      status: 'active',
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
      stats: {
        totalBookings: 0,
        activeContracts: 0,
        totalSpent: 0,
        outstandingBalance: 0,
      },
      // Credit Wallet - new customers start with 0 balance
      creditBalance: 0,
      rewardBalance: 0,
      creditSummary: {
        creditBalance: 0,
        rewardBalance: 0,
        totalBalance: 0,
        expiringWithin7Days: 0,
        activeRewardsCount: 0,
      },
      activeRewards: [],
    }
    
    mockCustomerDetails[newId] = newCustomer
    mockCustomers.push({
      id: newId,
      customerCode: newCode,
      customerType: data.customerType,
      fullName,
      email: data.email,
      phone: data.phone,
      status: 'active',
      tags: data.tags || [],
      companyName: data.customerType === 'company' ? data.companyName : undefined,
      creditBalance: 0,
      rewardBalance: 0,
      createdAt: new Date().toISOString(),
    })
    
    return newCustomer
  },
  
  // Update customer
  updateCustomer: async (data: UpdateCustomerRequest): Promise<CustomerDetails> => {
    await delay(300)
    const customer = mockCustomerDetails[data.id]
    if (!customer) throw new Error('Customer not found')
    
    const updated = {
      ...customer,
      ...data,
      updatedAt: new Date().toISOString(),
    }
    mockCustomerDetails[data.id] = updated
    
    return updated
  },
  
  // Get customer bookings
  getCustomerBookings: async (customerId: string): Promise<CustomerBooking[]> => {
    await delay(200)
    return mockCustomerBookings[customerId] || []
  },
  
  // Get customer contracts
  getCustomerContracts: async (customerId: string): Promise<CustomerContract[]> => {
    await delay(200)
    return mockCustomerContracts[customerId] || []
  },
  
  // Get customer invoices
  getCustomerInvoices: async (customerId: string): Promise<CustomerInvoice[]> => {
    await delay(200)
    return mockCustomerInvoices[customerId] || []
  },
  
  // Get employees
  getEmployees: async (customerId: string): Promise<EmployeesResponse> => {
    await delay(200)
    const employees = mockEmployees[customerId] || []
    
    return {
      items: employees,
      summary: {
        total: employees.length,
        active: employees.filter(e => e.status === 'active').length,
        inactive: employees.filter(e => e.status === 'inactive').length,
        withAccessCard: employees.filter(e => e.hasAccessCard && e.status === 'active').length,
      },
    }
  },
  
  // Create employee
  createEmployee: async (customerId: string, data: CreateEmployeeRequest): Promise<CompanyEmployee> => {
    await delay(300)
    const employees = mockEmployees[customerId] || []
    const newId = `emp-${String(employees.length + 1).padStart(3, '0')}`
    const companyCode = 'COM-0001' // Mock
    const newCode = `EMP-${companyCode}-${String(employees.length + 1).padStart(3, '0')}`
    
    const newEmployee: CompanyEmployee = {
      id: newId,
      employeeCode: newCode,
      companyId: 'com-001',
      customerId,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      employeeId: data.employeeId,
      title: data.title,
      department: data.department,
      canBookSpaces: data.canBookSpaces ?? false,
      canViewInvoices: data.canViewInvoices ?? false,
      canManageEmployees: data.canManageEmployees ?? false,
      hasAccessCard: data.hasAccessCard ?? false,
      accessCardNumber: data.accessCardNumber,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
    }
    
    if (!mockEmployees[customerId]) {
      mockEmployees[customerId] = []
    }
    mockEmployees[customerId].push(newEmployee)
    
    return newEmployee
  },
  
  // Get tags
  getTags: async (): Promise<Tag[]> => {
    await delay(150)
    return mockTags
  },
  
  // Suspend customer
  suspendCustomer: async (id: string, reason: string): Promise<CustomerDetails> => {
    await delay(300)
    const customer = mockCustomerDetails[id]
    if (!customer) throw new Error('Customer not found')
    
    customer.status = 'suspended'
    customer.updatedAt = new Date().toISOString()
    // Store suspension reason (logged for audit purposes)
    console.log(`Customer ${id} suspended: ${reason}`)
    
    // Update list item too
    const listItem = mockCustomers.find(c => c.id === id)
    if (listItem) listItem.status = 'suspended'
    
    return customer
  },
  
  // Reactivate customer
  reactivateCustomer: async (id: string): Promise<CustomerDetails> => {
    await delay(300)
    const customer = mockCustomerDetails[id]
    if (!customer) throw new Error('Customer not found')
    
    customer.status = 'active'
    customer.updatedAt = new Date().toISOString()
    
    // Update list item too
    const listItem = mockCustomers.find(c => c.id === id)
    if (listItem) listItem.status = 'active'
    
    return customer
  },
}
