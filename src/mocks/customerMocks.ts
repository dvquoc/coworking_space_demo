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
  // Company member customers
  {
    id: 'cus-013',
    customerCode: 'CUS-0013',
    customerType: 'company_member',
    fullName: 'Lê Văn Khoa',
    email: 'khoa.le@abc-tech.vn',
    phone: '0912233445',
    status: 'active',
    tags: [],
    companyName: 'ABC Technology Co., Ltd',
    creditBalance: 500,
    rewardBalance: 0,
    createdAt: '2026-03-10T09:00:00Z',
  },
  {
    id: 'cus-014',
    customerCode: 'CUS-0014',
    customerType: 'company_member',
    fullName: 'Trần Minh Tuấn',
    email: 'tuan.tm@xyz-marketing.vn',
    phone: '0923344556',
    status: 'active',
    tags: ['new'],
    companyName: 'XYZ Marketing Agency',
    creditBalance: 200,
    rewardBalance: 100,
    createdAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'cus-015',
    customerCode: 'CUS-0015',
    customerType: 'company_member',
    fullName: 'Phạm Thị Lan',
    email: 'lan.pt@globalfinance.vn',
    phone: '0934455667',
    status: 'active',
    tags: ['premium'],
    companyName: 'Global Finance Corp',
    creditBalance: 3000,
    rewardBalance: 500,
    createdAt: '2026-03-15T08:00:00Z',
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
    // Credit Wallet (Credit: 1 Credit = 1.000 VND)
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
    // Credit Wallet (Credit: 1 Credit = 1.000 VND)
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
  'cus-013': {
    id: 'cus-013',
    customerCode: 'CUS-0013',
    customerType: 'company_member',
    firstName: 'Lê Văn',
    lastName: 'Khoa',
    fullName: 'Lê Văn Khoa',
    email: 'khoa.le@abc-tech.vn',
    phone: '0912233445',
    address: '456 Lê Lai, Quận 1, TP.HCM',
    companyId: 'com-001',
    company: mockCompanies[0],
    tags: [],
    status: 'active',
    accountManager: 'staff-001',
    accountManagerInfo: { id: 'staff-001', name: 'Lê Thị Hương' },
    notes: 'Thành viên công ty ABC Technology, developer.',
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-04-10T09:00:00Z',
    createdBy: 'staff-001',
    createdByInfo: { id: 'staff-001', name: 'Lê Thị Hương' },
    stats: {
      totalBookings: 8,
      activeContracts: 0,
      totalSpent: 5000000,
      outstandingBalance: 0,
    },
    creditBalance: 500,
    rewardBalance: 0,
    creditSummary: {
      creditBalance: 500,
      rewardBalance: 0,
      totalBalance: 500,
      expiringWithin7Days: 0,
      activeRewardsCount: 0,
    },
    activeRewards: [],
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
  'cus-002': [
    {
      id: 'bk-020',
      bookingCode: 'BK-00200',
      spaceName: 'Hot Desk Zone A',
      buildingName: 'Cobi Tower A',
      floorLabel: '2F',
      date: '2026-04-18',
      startTime: '08:00',
      endTime: '12:00',
      status: 'confirmed',
      totalAmount: 200000,
    },
    {
      id: 'bk-021',
      bookingCode: 'BK-00201',
      spaceName: 'Meeting Room C',
      buildingName: 'Cobi Tower B',
      floorLabel: '3F',
      date: '2026-04-15',
      startTime: '14:00',
      endTime: '16:00',
      status: 'completed',
      totalAmount: 400000,
    },
  ],
  'cus-004': [
    {
      id: 'bk-030',
      bookingCode: 'BK-00210',
      spaceName: 'Hot Desk Zone B',
      buildingName: 'Cobi Tower A',
      floorLabel: '3F',
      date: '2026-04-19',
      startTime: '09:00',
      endTime: '17:00',
      status: 'confirmed',
      totalAmount: 350000,
    },
    {
      id: 'bk-031',
      bookingCode: 'BK-00180',
      spaceName: 'Meeting Room A',
      buildingName: 'Cobi Tower A',
      floorLabel: '2F',
      date: '2026-04-12',
      startTime: '10:00',
      endTime: '12:00',
      status: 'completed',
      totalAmount: 500000,
    },
    {
      id: 'bk-032',
      bookingCode: 'BK-00160',
      spaceName: 'Conference Room',
      buildingName: 'Cobi Tower B',
      floorLabel: '4F',
      date: '2026-03-25',
      startTime: '13:00',
      endTime: '15:00',
      status: 'completed',
      totalAmount: 800000,
    },
  ],
  'cus-006': [
    {
      id: 'bk-060',
      bookingCode: 'BK-00300',
      spaceName: 'Conference Room',
      buildingName: 'Cobi Tower A',
      floorLabel: '5F',
      date: '2026-04-21',
      startTime: '09:00',
      endTime: '12:00',
      status: 'confirmed',
      totalAmount: 1200000,
    },
    {
      id: 'bk-061',
      bookingCode: 'BK-00295',
      spaceName: 'Meeting Room A',
      buildingName: 'Cobi Tower A',
      floorLabel: '2F',
      date: '2026-04-18',
      startTime: '14:00',
      endTime: '17:00',
      status: 'confirmed',
      totalAmount: 750000,
    },
    {
      id: 'bk-062',
      bookingCode: 'BK-00280',
      spaceName: 'Event Space',
      buildingName: 'Cobi Tower B',
      floorLabel: '1F',
      date: '2026-04-15',
      startTime: '08:00',
      endTime: '18:00',
      status: 'completed',
      totalAmount: 5000000,
    },
    {
      id: 'bk-063',
      bookingCode: 'BK-00260',
      spaceName: 'Meeting Room B',
      buildingName: 'Cobi Tower A',
      floorLabel: '3F',
      date: '2026-04-10',
      startTime: '10:00',
      endTime: '12:00',
      status: 'completed',
      totalAmount: 500000,
    },
    {
      id: 'bk-064',
      bookingCode: 'BK-00240',
      spaceName: 'Conference Room',
      buildingName: 'Cobi Tower A',
      floorLabel: '5F',
      date: '2026-04-05',
      startTime: '13:00',
      endTime: '16:00',
      status: 'completed',
      totalAmount: 1200000,
    },
    {
      id: 'bk-065',
      bookingCode: 'BK-00220',
      spaceName: 'Hot Desk Zone A',
      buildingName: 'Cobi Tower A',
      floorLabel: '2F',
      date: '2026-03-28',
      startTime: '09:00',
      endTime: '18:00',
      status: 'completed',
      totalAmount: 400000,
    },
    {
      id: 'bk-066',
      bookingCode: 'BK-00190',
      spaceName: 'Meeting Room C',
      buildingName: 'Cobi Tower B',
      floorLabel: '3F',
      date: '2026-03-20',
      startTime: '14:00',
      endTime: '16:00',
      status: 'cancelled',
      totalAmount: 400000,
    },
    {
      id: 'bk-067',
      bookingCode: 'BK-00170',
      spaceName: 'Meeting Room A',
      buildingName: 'Cobi Tower A',
      floorLabel: '2F',
      date: '2026-03-15',
      startTime: '09:00',
      endTime: '11:00',
      status: 'completed',
      totalAmount: 500000,
    },
  ],
  'cus-009': [
    {
      id: 'bk-090',
      bookingCode: 'BK-00310',
      spaceName: 'Dedicated Desk D20',
      buildingName: 'Cobi Tower A',
      floorLabel: '4F',
      date: '2026-04-20',
      startTime: '08:00',
      endTime: '18:00',
      status: 'checked_in',
      totalAmount: 300000,
    },
    {
      id: 'bk-091',
      bookingCode: 'BK-00285',
      spaceName: 'Meeting Room B',
      buildingName: 'Cobi Tower A',
      floorLabel: '3F',
      date: '2026-04-14',
      startTime: '15:00',
      endTime: '17:00',
      status: 'completed',
      totalAmount: 500000,
    },
    {
      id: 'bk-092',
      bookingCode: 'BK-00250',
      spaceName: 'Hot Desk Zone B',
      buildingName: 'Cobi Tower A',
      floorLabel: '3F',
      date: '2026-04-08',
      startTime: '09:00',
      endTime: '13:00',
      status: 'completed',
      totalAmount: 200000,
    },
    {
      id: 'bk-093',
      bookingCode: 'BK-00230',
      spaceName: 'Conference Room',
      buildingName: 'Cobi Tower B',
      floorLabel: '4F',
      date: '2026-03-30',
      startTime: '10:00',
      endTime: '12:00',
      status: 'completed',
      totalAmount: 800000,
    },
  ],
  'cus-013': [
    {
      id: 'bk-130',
      bookingCode: 'BK-00320',
      spaceName: 'Hot Desk Zone A',
      buildingName: 'Cobi Tower A',
      floorLabel: '2F',
      date: '2026-04-21',
      startTime: '08:00',
      endTime: '18:00',
      status: 'pending',
      totalAmount: 400000,
    },
    {
      id: 'bk-131',
      bookingCode: 'BK-00305',
      spaceName: 'Meeting Room A',
      buildingName: 'Cobi Tower A',
      floorLabel: '2F',
      date: '2026-04-17',
      startTime: '10:00',
      endTime: '11:30',
      status: 'completed',
      totalAmount: 375000,
    },
    {
      id: 'bk-132',
      bookingCode: 'BK-00270',
      spaceName: 'Hot Desk Zone B',
      buildingName: 'Cobi Tower A',
      floorLabel: '3F',
      date: '2026-04-08',
      startTime: '09:00',
      endTime: '17:00',
      status: 'completed',
      totalAmount: 350000,
    },
    {
      id: 'bk-133',
      bookingCode: 'BK-00255',
      spaceName: 'Meeting Room B',
      buildingName: 'Cobi Tower A',
      floorLabel: '3F',
      date: '2026-04-02',
      startTime: '14:00',
      endTime: '16:00',
      status: 'completed',
      totalAmount: 500000,
    },
    {
      id: 'bk-134',
      bookingCode: 'BK-00215',
      spaceName: 'Hot Desk Zone A',
      buildingName: 'Cobi Tower A',
      floorLabel: '2F',
      date: '2026-03-22',
      startTime: '08:00',
      endTime: '18:00',
      status: 'completed',
      totalAmount: 400000,
    },
    {
      id: 'bk-135',
      bookingCode: 'BK-00195',
      spaceName: 'Meeting Room C',
      buildingName: 'Cobi Tower B',
      floorLabel: '3F',
      date: '2026-03-15',
      startTime: '09:00',
      endTime: '11:00',
      status: 'cancelled',
      totalAmount: 400000,
    },
    {
      id: 'bk-136',
      bookingCode: 'BK-00175',
      spaceName: 'Hot Desk Zone B',
      buildingName: 'Cobi Tower A',
      floorLabel: '3F',
      date: '2026-03-10',
      startTime: '09:00',
      endTime: '13:00',
      status: 'completed',
      totalAmount: 200000,
    },
    {
      id: 'bk-137',
      bookingCode: 'BK-00140',
      spaceName: 'Conference Room',
      buildingName: 'Cobi Tower B',
      floorLabel: '4F',
      date: '2026-02-28',
      startTime: '14:00',
      endTime: '17:00',
      status: 'completed',
      totalAmount: 1200000,
    },
  ],
  'cus-010': [
    {
      id: 'bk-100',
      bookingCode: 'BK-00330',
      spaceName: 'Hot Desk Zone A',
      buildingName: 'Cobi Tower A',
      floorLabel: '2F',
      date: '2026-04-19',
      startTime: '08:00',
      endTime: '12:00',
      status: 'confirmed',
      totalAmount: 200000,
    },
    {
      id: 'bk-101',
      bookingCode: 'BK-00290',
      spaceName: 'Meeting Room A',
      buildingName: 'Cobi Tower A',
      floorLabel: '2F',
      date: '2026-04-11',
      startTime: '09:00',
      endTime: '11:00',
      status: 'completed',
      totalAmount: 500000,
    },
  ],
  'cus-014': [
    {
      id: 'bk-140',
      bookingCode: 'BK-00335',
      spaceName: 'Hot Desk Zone B',
      buildingName: 'Cobi Tower A',
      floorLabel: '3F',
      date: '2026-04-20',
      startTime: '09:00',
      endTime: '17:00',
      status: 'checked_in',
      totalAmount: 350000,
    },
    {
      id: 'bk-141',
      bookingCode: 'BK-00315',
      spaceName: 'Meeting Room B',
      buildingName: 'Cobi Tower A',
      floorLabel: '3F',
      date: '2026-04-16',
      startTime: '13:00',
      endTime: '15:00',
      status: 'completed',
      totalAmount: 500000,
    },
    {
      id: 'bk-142',
      bookingCode: 'BK-00275',
      spaceName: 'Hot Desk Zone A',
      buildingName: 'Cobi Tower A',
      floorLabel: '2F',
      date: '2026-04-07',
      startTime: '08:00',
      endTime: '18:00',
      status: 'completed',
      totalAmount: 400000,
    },
  ],
  'cus-015': [
    {
      id: 'bk-150',
      bookingCode: 'BK-00340',
      spaceName: 'Dedicated Desk D30',
      buildingName: 'Cobi Tower A',
      floorLabel: '4F',
      date: '2026-04-21',
      startTime: '08:00',
      endTime: '18:00',
      status: 'pending',
      totalAmount: 300000,
    },
    {
      id: 'bk-151',
      bookingCode: 'BK-00325',
      spaceName: 'Meeting Room A',
      buildingName: 'Cobi Tower A',
      floorLabel: '2F',
      date: '2026-04-18',
      startTime: '10:00',
      endTime: '12:00',
      status: 'completed',
      totalAmount: 500000,
    },
    {
      id: 'bk-152',
      bookingCode: 'BK-00298',
      spaceName: 'Conference Room',
      buildingName: 'Cobi Tower B',
      floorLabel: '4F',
      date: '2026-04-12',
      startTime: '09:00',
      endTime: '12:00',
      status: 'completed',
      totalAmount: 1200000,
    },
    {
      id: 'bk-153',
      bookingCode: 'BK-00265',
      spaceName: 'Hot Desk Zone B',
      buildingName: 'Cobi Tower A',
      floorLabel: '3F',
      date: '2026-04-03',
      startTime: '08:00',
      endTime: '17:00',
      status: 'completed',
      totalAmount: 350000,
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
  'cus-002': [
    {
      id: 'ct-020',
      contractCode: 'CT-00065',
      spaceName: 'Hot Desk Zone A - Flexi Pass',
      startDate: '2026-04-01',
      endDate: '2026-06-30',
      status: 'active',
      monthlyValue: 2000000,
      daysRemaining: 71,
    },
  ],
  'cus-004': [
    {
      id: 'ct-030',
      contractCode: 'CT-00058',
      spaceName: 'Dedicated Desk D22',
      startDate: '2026-02-01',
      endDate: '2026-07-31',
      status: 'active',
      monthlyValue: 4500000,
      daysRemaining: 102,
    },
    {
      id: 'ct-031',
      contractCode: 'CT-00035',
      spaceName: 'Hot Desk Zone B - Monthly',
      startDate: '2025-10-01',
      endDate: '2026-01-31',
      status: 'expired',
      monthlyValue: 2500000,
      daysRemaining: 0,
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
      daysRemaining: 71,
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
    {
      id: 'ct-060',
      contractCode: 'CT-00030',
      spaceName: 'Meeting Room Package (20h/month)',
      startDate: '2025-07-01',
      endDate: '2025-12-31',
      status: 'expired',
      monthlyValue: 8000000,
      daysRemaining: 0,
    },
  ],
  'cus-008': [
    {
      id: 'ct-080',
      contractCode: 'CT-00055',
      spaceName: 'Private Office 201',
      startDate: '2026-03-01',
      endDate: '2027-02-28',
      status: 'active',
      monthlyValue: 35000000,
      daysRemaining: 314,
    },
    {
      id: 'ct-081',
      contractCode: 'CT-00056',
      spaceName: 'Private Office 202',
      startDate: '2026-03-01',
      endDate: '2027-02-28',
      status: 'active',
      monthlyValue: 30000000,
      daysRemaining: 314,
    },
  ],
  'cus-009': [
    {
      id: 'ct-090',
      contractCode: 'CT-00060',
      spaceName: 'Dedicated Desk D20',
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      status: 'active',
      monthlyValue: 5000000,
      daysRemaining: 71,
    },
    {
      id: 'ct-091',
      contractCode: 'CT-00028',
      spaceName: 'Hot Desk Zone A - Monthly',
      startDate: '2025-07-01',
      endDate: '2025-12-31',
      status: 'expired',
      monthlyValue: 2500000,
      daysRemaining: 0,
    },
  ],
  'cus-010': [
    {
      id: 'ct-100',
      contractCode: 'CT-00042',
      spaceName: 'Dedicated Desk D08',
      startDate: '2025-09-01',
      endDate: '2026-08-31',
      status: 'active',
      monthlyValue: 4500000,
      daysRemaining: 133,
    },
  ],
  'cus-013': [
    {
      id: 'ct-130',
      contractCode: 'CT-00062',
      spaceName: 'Hot Desk Zone A - Flexi Pass',
      startDate: '2026-03-01',
      endDate: '2026-05-31',
      status: 'active',
      monthlyValue: 2000000,
      daysRemaining: 41,
    },
  ],
  'cus-015': [
    {
      id: 'ct-150',
      contractCode: 'CT-00068',
      spaceName: 'Dedicated Desk D30',
      startDate: '2026-03-15',
      endDate: '2026-09-14',
      status: 'active',
      monthlyValue: 5500000,
      daysRemaining: 147,
    },
    {
      id: 'ct-151',
      contractCode: 'CT-00069',
      spaceName: 'Meeting Room Package (10h/month)',
      startDate: '2026-03-15',
      endDate: '2026-09-14',
      status: 'active',
      monthlyValue: 4000000,
      daysRemaining: 147,
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
    {
      id: 'inv-010',
      invoiceCode: 'INV-2026-0090',
      description: 'Dedicated Desk D15 - Tháng 02/2026',
      issueDate: '2026-02-01',
      dueDate: '2026-02-15',
      amount: 5000000,
      status: 'paid',
      paidAmount: 5000000,
    },
    {
      id: 'inv-011',
      invoiceCode: 'INV-2026-0060',
      description: 'Dedicated Desk D15 - Tháng 01/2026',
      issueDate: '2026-01-01',
      dueDate: '2026-01-15',
      amount: 5000000,
      status: 'paid',
      paidAmount: 5000000,
    },
    {
      id: 'inv-012',
      invoiceCode: 'INV-2026-0185',
      description: 'Booking Conference Room - 10/04/2026',
      issueDate: '2026-04-10',
      dueDate: '2026-04-20',
      amount: 800000,
      status: 'overdue',
      paidAmount: 0,
    },
  ],
  'cus-002': [
    {
      id: 'inv-020',
      invoiceCode: 'INV-2026-0170',
      description: 'Hot Desk Zone A - Flexi Pass Tháng 04/2026',
      issueDate: '2026-04-01',
      dueDate: '2026-04-10',
      amount: 2000000,
      status: 'paid',
      paidAmount: 2000000,
    },
    {
      id: 'inv-021',
      invoiceCode: 'INV-2026-0175',
      description: 'Booking Meeting Room C - 15/04/2026',
      issueDate: '2026-04-15',
      dueDate: '2026-04-25',
      amount: 400000,
      status: 'sent',
      paidAmount: 0,
    },
  ],
  'cus-004': [
    {
      id: 'inv-030',
      invoiceCode: 'INV-2026-0155',
      description: 'Dedicated Desk D22 - Tháng 04/2026',
      issueDate: '2026-04-01',
      dueDate: '2026-04-15',
      amount: 4500000,
      status: 'paid',
      paidAmount: 4500000,
    },
    {
      id: 'inv-031',
      invoiceCode: 'INV-2026-0125',
      description: 'Dedicated Desk D22 - Tháng 03/2026',
      issueDate: '2026-03-01',
      dueDate: '2026-03-15',
      amount: 4500000,
      status: 'paid',
      paidAmount: 4500000,
    },
    {
      id: 'inv-032',
      invoiceCode: 'INV-2026-0165',
      description: 'Booking Meeting Room A - 12/04/2026',
      issueDate: '2026-04-12',
      dueDate: '2026-04-22',
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
    {
      id: 'inv-060',
      invoiceCode: 'INV-2026-0080',
      description: 'Private Office 101 & 102 - Tháng 02/2026',
      issueDate: '2026-02-01',
      dueDate: '2026-02-15',
      amount: 45000000,
      status: 'paid',
      paidAmount: 45000000,
    },
    {
      id: 'inv-061',
      invoiceCode: 'INV-2026-0050',
      description: 'Private Office 101 & 102 - Tháng 01/2026',
      issueDate: '2026-01-01',
      dueDate: '2026-01-15',
      amount: 45000000,
      status: 'paid',
      paidAmount: 45000000,
    },
    {
      id: 'inv-062',
      invoiceCode: 'INV-2026-0190',
      description: 'Booking Event Space - 15/04/2026',
      issueDate: '2026-04-15',
      dueDate: '2026-04-25',
      amount: 5000000,
      status: 'sent',
      paidAmount: 0,
    },
    {
      id: 'inv-063',
      invoiceCode: 'INV-2026-0160',
      description: 'Booking Conference Room - 05/04/2026',
      issueDate: '2026-04-05',
      dueDate: '2026-04-15',
      amount: 1200000,
      status: 'paid',
      paidAmount: 1200000,
    },
  ],
  'cus-008': [
    {
      id: 'inv-080',
      invoiceCode: 'INV-2026-0145',
      description: 'Private Office 201 & 202 - Tháng 04/2026',
      issueDate: '2026-04-01',
      dueDate: '2026-04-15',
      amount: 65000000,
      status: 'paid',
      paidAmount: 65000000,
    },
    {
      id: 'inv-081',
      invoiceCode: 'INV-2026-0115',
      description: 'Private Office 201 & 202 - Tháng 03/2026',
      issueDate: '2026-03-01',
      dueDate: '2026-03-15',
      amount: 65000000,
      status: 'paid',
      paidAmount: 65000000,
    },
  ],
  'cus-009': [
    {
      id: 'inv-090',
      invoiceCode: 'INV-2026-0152',
      description: 'Dedicated Desk D20 - Tháng 04/2026',
      issueDate: '2026-04-01',
      dueDate: '2026-04-15',
      amount: 5000000,
      status: 'paid',
      paidAmount: 5000000,
    },
    {
      id: 'inv-091',
      invoiceCode: 'INV-2026-0122',
      description: 'Dedicated Desk D20 - Tháng 03/2026',
      issueDate: '2026-03-01',
      dueDate: '2026-03-15',
      amount: 5000000,
      status: 'paid',
      paidAmount: 5000000,
    },
    {
      id: 'inv-092',
      invoiceCode: 'INV-2026-0188',
      description: 'Booking Conference Room - 30/03/2026',
      issueDate: '2026-03-30',
      dueDate: '2026-04-09',
      amount: 800000,
      status: 'paid',
      paidAmount: 800000,
    },
    {
      id: 'inv-093',
      invoiceCode: 'INV-2026-0192',
      description: 'Booking Meeting Room B - 14/04/2026',
      issueDate: '2026-04-14',
      dueDate: '2026-04-24',
      amount: 500000,
      status: 'sent',
      paidAmount: 0,
    },
  ],
  'cus-010': [
    {
      id: 'inv-100',
      invoiceCode: 'INV-2026-0148',
      description: 'Dedicated Desk D08 - Tháng 04/2026',
      issueDate: '2026-04-01',
      dueDate: '2026-04-15',
      amount: 4500000,
      status: 'paid',
      paidAmount: 4500000,
    },
    {
      id: 'inv-101',
      invoiceCode: 'INV-2026-0118',
      description: 'Dedicated Desk D08 - Tháng 03/2026',
      issueDate: '2026-03-01',
      dueDate: '2026-03-15',
      amount: 4500000,
      status: 'paid',
      paidAmount: 4500000,
    },
  ],
  'cus-013': [
    {
      id: 'inv-130',
      invoiceCode: 'INV-2026-0168',
      description: 'Hot Desk Zone A - Flexi Pass Tháng 04/2026',
      issueDate: '2026-04-01',
      dueDate: '2026-04-10',
      amount: 2000000,
      status: 'paid',
      paidAmount: 2000000,
    },
    {
      id: 'inv-131',
      invoiceCode: 'INV-2026-0138',
      description: 'Hot Desk Zone A - Flexi Pass Tháng 03/2026',
      issueDate: '2026-03-01',
      dueDate: '2026-03-10',
      amount: 2000000,
      status: 'paid',
      paidAmount: 2000000,
    },
    {
      id: 'inv-132',
      invoiceCode: 'INV-2026-0195',
      description: 'Booking Meeting Room A - 17/04/2026',
      issueDate: '2026-04-17',
      dueDate: '2026-04-27',
      amount: 375000,
      status: 'sent',
      paidAmount: 0,
    },
    {
      id: 'inv-133',
      invoiceCode: 'INV-2026-0182',
      description: 'Booking Meeting Room B - 02/04/2026',
      issueDate: '2026-04-02',
      dueDate: '2026-04-12',
      amount: 500000,
      status: 'overdue',
      paidAmount: 0,
    },
    {
      id: 'inv-134',
      invoiceCode: 'INV-2026-0130',
      description: 'Booking Conference Room - 28/02/2026',
      issueDate: '2026-02-28',
      dueDate: '2026-03-10',
      amount: 1200000,
      status: 'paid',
      paidAmount: 1200000,
    },
  ],
  'cus-014': [
    {
      id: 'inv-140',
      invoiceCode: 'INV-2026-0172',
      description: 'Booking Hot Desk Zone B - 20/04/2026',
      issueDate: '2026-04-20',
      dueDate: '2026-04-30',
      amount: 350000,
      status: 'draft',
      paidAmount: 0,
    },
    {
      id: 'inv-141',
      invoiceCode: 'INV-2026-0178',
      description: 'Booking Meeting Room B - 16/04/2026',
      issueDate: '2026-04-16',
      dueDate: '2026-04-26',
      amount: 500000,
      status: 'sent',
      paidAmount: 0,
    },
    {
      id: 'inv-142',
      invoiceCode: 'INV-2026-0162',
      description: 'Booking Hot Desk Zone A - 07/04/2026',
      issueDate: '2026-04-07',
      dueDate: '2026-04-17',
      amount: 400000,
      status: 'paid',
      paidAmount: 400000,
    },
  ],
  'cus-015': [
    {
      id: 'inv-150',
      invoiceCode: 'INV-2026-0158',
      description: 'Dedicated Desk D30 + Meeting Room Package - Tháng 04/2026',
      issueDate: '2026-04-01',
      dueDate: '2026-04-15',
      amount: 9500000,
      status: 'paid',
      paidAmount: 9500000,
    },
    {
      id: 'inv-151',
      invoiceCode: 'INV-2026-0128',
      description: 'Dedicated Desk D30 + Meeting Room Package - Tháng 03/2026 (prorated)',
      issueDate: '2026-03-15',
      dueDate: '2026-03-25',
      amount: 5066000,
      status: 'paid',
      paidAmount: 5066000,
    },
    {
      id: 'inv-152',
      invoiceCode: 'INV-2026-0197',
      description: 'Booking Meeting Room A - 18/04/2026',
      issueDate: '2026-04-18',
      dueDate: '2026-04-28',
      amount: 500000,
      status: 'sent',
      paidAmount: 0,
    },
    {
      id: 'inv-153',
      invoiceCode: 'INV-2026-0193',
      description: 'Booking Conference Room - 12/04/2026',
      issueDate: '2026-04-12',
      dueDate: '2026-04-22',
      amount: 1200000,
      status: 'overdue',
      paidAmount: 0,
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
    
    const fullName = data.customerType === 'company'
      ? data.companyName || ''
      : `${data.firstName || ''} ${data.lastName || ''}`.trim()
    
    // For company_member, find the linked company
    const linkedCompany = data.companyId
      ? mockCompanies.find(c => c.id === data.companyId)
      : undefined
    
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
      companyId: data.companyId,
      company: linkedCompany,
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
      companyName: data.customerType === 'company' ? data.companyName
        : data.customerType === 'company_member' && linkedCompany ? linkedCompany.companyName
        : undefined,
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
