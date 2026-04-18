import type {
  ContractTemplate,
  Contract,
  ContractListItem,
  ContractDetails,
  TermsAndConditions,
  AcceptanceLog,
  AcceptanceLogListItem,
  PaginatedContracts,
  PaginatedTemplates,
  PaginatedTerms,
  ContractFilters,
  TemplateFilters,
  TermsFilters,
  CreateContractTemplateRequest,
  UpdateContractTemplateRequest,
  CreateContractRequest,
  CreateTermsRequest,
  ContractDashboardStats,
  ExpiringContract,
  RenewalQueueItem,
  ContractAmenity,
  ContractAsset,
  ContractService,
} from '../types/contract'

// ========== MOCK AMENITIES / ASSETS / SERVICES ==========

export const mockAmenities: ContractAmenity[] = [
  { id: 'am-01', name: 'WiFi tốc độ cao' },
  { id: 'am-02', name: 'Điều hòa' },
  { id: 'am-03', name: 'Hệ thống chiếu sáng' },
  { id: 'am-04', name: 'Bãi đỗ xe' },
  { id: 'am-05', name: 'Thang máy' },
  { id: 'am-06', name: 'An ninh 24/7' },
  { id: 'am-07', name: 'Phòng họp chung' },
  { id: 'am-08', name: 'Pantry / Bếp chung' },
  { id: 'am-09', name: 'Khu vực giải trí' },
  { id: 'am-10', name: 'Phòng tắm / WC riêng' },
]

export const mockAssets: ContractAsset[] = [
  { id: 'as-01', name: 'Bàn làm việc', quantity: 1 },
  { id: 'as-02', name: 'Ghế công thái học', quantity: 1 },
  { id: 'as-03', name: 'Tủ locker', quantity: 1 },
  { id: 'as-04', name: 'Màn hình phụ', quantity: 1 },
  { id: 'as-05', name: 'Bảng trắng', quantity: 1 },
  { id: 'as-06', name: 'Máy in chung', quantity: 1 },
  { id: 'as-07', name: 'Điện thoại bàn', quantity: 1 },
  { id: 'as-08', name: 'Đèn bàn', quantity: 1 },
]

export const mockServices: ContractService[] = [
  { id: 'sv-01', name: 'Dọn vệ sinh hàng ngày', monthlyFee: 500000 },
  { id: 'sv-02', name: 'Giặt ủi', monthlyFee: 300000 },
  { id: 'sv-03', name: 'Nước uống & cà phê', monthlyFee: 200000 },
  { id: 'sv-04', name: 'In ấn (100 trang/tháng)', monthlyFee: 150000 },
  { id: 'sv-05', name: 'Nhận thư / bưu phẩm', monthlyFee: 100000 },
  { id: 'sv-06', name: 'Hỗ trợ IT', monthlyFee: 500000 },
  { id: 'sv-07', name: 'Dịch vụ lễ tân', monthlyFee: 1000000 },
  { id: 'sv-08', name: 'Đăng ký địa chỉ kinh doanh', monthlyFee: 2000000 },
]

// ========== MOCK CONTRACT TEMPLATES ==========

export const mockContractTemplates: ContractTemplate[] = [
  {
    id: 'tpl-001',
    templateCode: 'TPL-DEDICATED-DESK-001',
    name: 'Hợp đồng Dedicated Desk',
    version: '1.0',
    description: 'Mẫu hợp đồng thuê chỗ ngồi Dedicated Desk',
    headerTemplate: `
      <div class="contract-header">
        <h1>HỢP ĐỒNG THUÊ CHỖ NGỒI LÀM VIỆC</h1>
        <p>Số: <strong>{{contractCode}}</strong></p>
        <p>Ngày ký: <strong>{{signedDate}}</strong></p>
      </div>
    `,
    partyLessorTemplate: `
      <div class="party-lessor">
        <h2>BÊN CHO THUÊ (Bên A)</h2>
        <p><strong>{{companyName}}</strong></p>
        <p>Mã số thuế: {{companyTaxCode}}</p>
        <p>Địa chỉ: {{companyAddress}}</p>
        <p>Đại diện: {{companyRepName}} - {{companyRepTitle}}</p>
        <p>Điện thoại: {{companyPhone}}</p>
        <p>Email: {{companyEmail}}</p>
      </div>
    `,
    partyLesseeTemplate: `
      <div class="party-lessee">
        <h2>BÊN THUÊ (Bên B)</h2>
        <p><strong>{{customerName}}</strong></p>
        <p>Loại khách hàng: {{customerType}}</p>
        <p>CCCD/MST: {{customerId}}</p>
        <p>Địa chỉ: {{customerAddress}}</p>
        <p>Điện thoại: {{customerPhone}}</p>
        <p>Email: {{customerEmail}}</p>
      </div>
    `,
    serviceTemplate: `
      <div class="service-section">
        <h2>ĐIỀU 1: DỊCH VỤ</h2>
        <p>Bên A cung cấp cho Bên B dịch vụ <strong>{{packageName}}</strong> tại:</p>
        <ul>
          <li>Tòa nhà: {{buildingName}}</li>
          <li>Địa chỉ: {{buildingAddress}}</li>
          <li>Khu vực: {{spaceName}}</li>
          <li>Tầng: {{floorLabel}}</li>
        </ul>
        <p>Thời gian hoạt động: {{operatingHours}}</p>
      </div>
    `,
    pricingTemplate: `
      <div class="pricing-section">
        <h2>ĐIỀU 2: GIÁ TRỊ HỢP ĐỒNG</h2>
        <table>
          <tr><td>Phí hàng tháng:</td><td>{{monthlyFee}}</td></tr>
          <tr><td>Phí setup:</td><td>{{setupFee}}</td></tr>
          <tr><td>Tiền đặt cọc:</td><td>{{deposit}}</td></tr>
          <tr><td>Thời hạn:</td><td>{{duration}} tháng</td></tr>
          <tr><td>Từ ngày:</td><td>{{startDate}}</td></tr>
          <tr><td>Đến ngày:</td><td>{{endDate}}</td></tr>
        </table>
        <p><strong>Tổng giá trị hợp đồng: {{totalValue}} ({{totalValueText}})</strong></p>
      </div>
    `,
    usageRulesTemplate: `
      <div class="usage-rules">
        <h2>ĐIỀU 3: QUY ĐỊNH SỬ DỤNG</h2>
        <ol>
          <li>Bên B phải tuân thủ nội quy tòa nhà và không gian làm việc chung.</li>
          <li>Bên B không được gây ồn ào, ảnh hưởng đến các khách hàng khác.</li>
          <li>Bên B chịu trách nhiệm bảo quản tài sản cá nhân.</li>
          <li>Không được sử dụng không gian cho mục đích phi pháp.</li>
        </ol>
      </div>
    `,
    liabilityTemplate: `
      <div class="liability">
        <h2>ĐIỀU 4: TRÁCH NHIỆM CÁC BÊN</h2>
        <h3>4.1 Trách nhiệm của Bên A</h3>
        <ul>
          <li>Cung cấp không gian làm việc đúng như mô tả.</li>
          <li>Đảm bảo điện, nước, internet hoạt động ổn định.</li>
          <li>Hỗ trợ kỹ thuật trong giờ làm việc.</li>
        </ul>
        <h3>4.2 Trách nhiệm của Bên B</h3>
        <ul>
          <li>Thanh toán đúng hạn theo quy định.</li>
          <li>Tuân thủ nội quy sử dụng.</li>
          <li>Bồi thường nếu gây hư hại tài sản.</li>
        </ul>
      </div>
    `,
    terminationTemplate: `
      <div class="termination">
        <h2>ĐIỀU 5: CHẤM DỨT HỢP ĐỒNG</h2>
        <ol>
          <li>Hợp đồng tự động chấm dứt khi hết thời hạn.</li>
          <li>Chấm dứt trước hạn phải thông báo trước 30 ngày.</li>
          <li>Phí chấm dứt sớm: 1 tháng tiền thuê.</li>
          <li>Tiền cọc được hoàn trả sau khi trừ các khoản phí (nếu có).</li>
        </ol>
      </div>
    `,
    signatureTemplate: `
      <div class="signature">
        <h2>CHỮ KÝ CÁC BÊN</h2>
        <div class="signature-block">
          <div>
            <p><strong>ĐẠI DIỆN BÊN A</strong></p>
            <p>{{companyRepName}}</p>
            <p>{{companyRepTitle}}</p>
          </div>
          <div>
            <p><strong>ĐẠI DIỆN BÊN B</strong></p>
            <p>{{customerName}}</p>
          </div>
        </div>
      </div>
    `,
    isActive: true,
    isDefault: true,
    createdAt: '2026-01-01T09:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
    createdBy: 'admin-001',
    updatedBy: 'admin-001',
  },
  {
    id: 'tpl-002',
    templateCode: 'TPL-PRIVATE-OFFICE-001',
    name: 'Hợp đồng Private Office',
    version: '1.1',
    description: 'Mẫu hợp đồng thuê phòng riêng (Private Office)',
    headerTemplate: '<div class="contract-header"><h1>HỢP ĐỒNG THUÊ PHÒNG RIÊNG</h1><p>Số: <strong>{{contractCode}}</strong></p></div>',
    partyLessorTemplate: '<div class="party-lessor"><h2>BÊN CHO THUÊ (Bên A)</h2><p>{{companyName}}</p></div>',
    partyLesseeTemplate: '<div class="party-lessee"><h2>BÊN THUÊ (Bên B)</h2><p>{{customerName}}</p></div>',
    serviceTemplate: '<div class="service"><h2>DỊCH VỤ</h2><p>{{spaceName}} tại {{buildingName}}</p></div>',
    pricingTemplate: '<div class="pricing"><h2>GIÁ TRỊ</h2><p>{{monthlyFee}}/tháng</p></div>',
    usageRulesTemplate: '<div class="rules"><h2>QUY ĐỊNH</h2><p>Tuân thủ nội quy tòa nhà</p></div>',
    liabilityTemplate: '<div class="liability"><h2>TRÁCH NHIỆM</h2><p>Theo quy định chung</p></div>',
    terminationTemplate: '<div class="termination"><h2>CHẤM DỨT</h2><p>Thông báo trước 30 ngày</p></div>',
    signatureTemplate: '<div class="signature"><h2>CHỮ KÝ</h2></div>',
    isActive: true,
    isDefault: true,
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-02-20T10:00:00Z',
    createdBy: 'admin-001',
  },
]

// ========== MOCK CONTRACTS ==========

export const mockContracts: ContractListItem[] = [
  {
    id: 'ctr-001',
    contractCode: 'CTR-20260115-001',
    status: 'active',
    customerName: 'Nguyễn Văn An',
    customerType: 'individual',
    buildingName: 'Cobi Tower 1',
    spaceName: 'Dedicated Desk Zone A-01',
    startDate: '2026-01-15',
    endDate: '2026-07-14',
    monthlyFee: 5000000,
    daysRemaining: 89,
    autoRenewEnabled: true,
  },
  {
    id: 'ctr-002',
    contractCode: 'CTR-20260201-002',
    status: 'active',
    customerName: 'Công ty ABC Tech',
    customerType: 'company',
    buildingName: 'Cobi Tower 1',
    spaceName: 'Private Office 501',
    startDate: '2026-02-01',
    endDate: '2027-01-31',
    monthlyFee: 25000000,
    daysRemaining: 289,
    autoRenewEnabled: true,
  },
  {
    id: 'ctr-003',
    contractCode: 'CTR-20260301-003',
    status: 'expiring_soon',
    customerName: 'Trần Thị Bình',
    customerType: 'individual',
    buildingName: 'Cobi Tower 2',
    spaceName: 'Dedicated Desk Zone B-05',
    startDate: '2026-03-01',
    endDate: '2026-05-01',
    monthlyFee: 3000000,
    daysRemaining: 14,
    autoRenewEnabled: false,
  },
  {
    id: 'ctr-004',
    contractCode: 'CTR-20251015-004',
    status: 'expired',
    customerName: 'Công ty XYZ Marketing',
    customerType: 'company',
    buildingName: 'Cobi Tower 1',
    spaceName: 'Private Office 301',
    startDate: '2025-10-15',
    endDate: '2026-04-14',
    monthlyFee: 18000000,
    daysRemaining: 0,
    autoRenewEnabled: false,
  },
  {
    id: 'ctr-005',
    contractCode: 'CTR-20260101-005',
    status: 'active',
    customerName: 'Lê Văn Cường',
    customerType: 'individual',
    buildingName: 'Cobi Tower 2',
    spaceName: 'Dedicated Desk Zone C-10',
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    monthlyFee: 8000000,
    daysRemaining: 74,
    autoRenewEnabled: true,
  },
  {
    id: 'ctr-006',
    contractCode: 'CTR-20251201-006',
    status: 'renewed',
    customerName: 'Phạm Văn Dũng',
    customerType: 'individual',
    buildingName: 'Cobi Tower 1',
    spaceName: 'Dedicated Desk Zone A-08',
    startDate: '2025-12-01',
    endDate: '2026-03-01',
    monthlyFee: 4500000,
    daysRemaining: 0,
    autoRenewEnabled: true,
  },
  {
    id: 'ctr-007',
    contractCode: 'CTR-20260301-007',
    status: 'active',
    customerName: 'Phạm Văn Dũng',
    customerType: 'individual',
    buildingName: 'Cobi Tower 1',
    spaceName: 'Dedicated Desk Zone A-08',
    startDate: '2026-03-02',
    endDate: '2026-09-01',
    monthlyFee: 4500000,
    daysRemaining: 137,
    autoRenewEnabled: true,
  },
  {
    id: 'ctr-008',
    contractCode: 'CTR-20260115-008',
    status: 'terminated',
    customerName: 'Nguyễn Thị Hoa',
    customerType: 'individual',
    buildingName: 'Cobi Tower 2',
    spaceName: 'Dedicated Desk D-15',
    startDate: '2026-01-15',
    endDate: '2026-07-14',
    monthlyFee: 6000000,
    daysRemaining: 0,
    autoRenewEnabled: false,
  },
  {
    id: 'ctr-009',
    contractCode: 'CTR-20260401-009',
    status: 'draft',
    customerName: 'Hoàng Văn Nam',
    customerType: 'individual',
    buildingName: 'Cobi Tower 1',
    spaceName: 'Dedicated Desk Zone B-02',
    startDate: '2026-04-20',
    endDate: '2026-10-19',
    monthlyFee: 5000000,
    daysRemaining: 185,
    autoRenewEnabled: false,
  },
  {
    id: 'ctr-010',
    contractCode: 'CTR-20260320-010',
    status: 'expiring_soon',
    customerName: 'Công ty Global Finance',
    customerType: 'company',
    buildingName: 'Cobi Tower 1',
    spaceName: 'Private Office 801',
    startDate: '2025-04-20',
    endDate: '2026-04-30',
    monthlyFee: 45000000,
    daysRemaining: 13,
    autoRenewEnabled: true,
  },
]

// ========== MOCK CONTRACT DETAILS ==========

export const mockContractDetails: Record<string, ContractDetails> = {
  'ctr-001': {
    id: 'ctr-001',
    contractCode: 'CTR-20260115-001',
    status: 'active',
    customerId: 'cus-001',
    customerName: 'Nguyễn Văn An',
    customerType: 'individual',
    buildingId: 'bld-001',
    buildingName: 'Cobi Tower 1',
    spaceId: 'space-001',
    spaceName: 'Dedicated Desk Zone A-01',
    floorLabel: 'Tầng 3',
    startDate: '2026-01-15',
    endDate: '2026-07-14',
    durationMonths: 6,
    signedDate: '2026-01-14',
    monthlyFee: 5000000,
    setupFee: 500000,
    depositAmount: 5000000,
    totalValue: 35500000,
    templateId: 'tpl-001',
    templateVersion: '1.0',
    autoRenewalSettings: {
      enabled: true,
      renewalDuration: 6,
      renewalPricing: 'same',
      notifyDaysBefore: 30,
    },
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
    createdBy: 'admin-001',
    activatedAt: '2026-01-15T10:00:00Z',
    activatedBy: 'admin-001',
    customer: {
      id: 'cus-001',
      customerCode: 'CUS-0001',
      fullName: 'Nguyễn Văn An',
      email: 'an.nguyen@gmail.com',
      phone: '0901234567',
    },
    building: {
      id: 'bld-001',
      name: 'Cobi Tower 1',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    },
    space: {
      id: 'space-001',
      name: 'Dedicated Desk Zone A-01',
      floorLabel: 'Tầng 3',
    },
    template: {
      id: 'tpl-001',
      templateCode: 'TPL-DEDICATED-DESK-001',
      name: 'Hợp đồng Dedicated Desk',
      version: '1.0',
      isActive: true,
      isDefault: true,
      updatedAt: '2026-03-15T10:00:00Z',
    },
    statusHistory: [
      {
        id: 'sh-001',
        contractId: 'ctr-001',
        fromStatus: null,
        toStatus: 'draft',
        changedAt: '2026-01-10T09:00:00Z',
        changedBy: 'admin-001',
        notes: 'Contract created',
      },
      {
        id: 'sh-002',
        contractId: 'ctr-001',
        fromStatus: 'draft',
        toStatus: 'active',
        changedAt: '2026-01-15T10:00:00Z',
        changedBy: 'admin-001',
        notes: 'Contract activated',
      },
    ],
    createdByInfo: {
      id: 'admin-001',
      name: 'Admin Hương',
    },
  },
}

// ========== MOCK TERMS AND CONDITIONS ==========

export const mockTermsAndConditions: TermsAndConditions[] = [
  {
    id: 'tc-001',
    termsCode: 'TC-HOT-DESK-001',
    title: 'Điều khoản sử dụng Hot Desk',
    version: '2.1',
    usageRulesContent: `
      <h3>1. QUY ĐỊNH SỬ DỤNG</h3>
      <ul>
        <li>Khách hàng phải tuân thủ nội quy tòa nhà và không gian làm việc chung.</li>
        <li>Giữ gìn vệ sinh chung, không để đồ cá nhân tại bàn sau khi sử dụng.</li>
        <li>Không gây ồn ào ảnh hưởng đến người khác.</li>
        <li>Sử dụng thiết bị điện an toàn, tiết kiệm năng lượng.</li>
      </ul>
    `,
    liabilityContent: `
      <h3>2. TRÁCH NHIỆM</h3>
      <ul>
        <li>Khách hàng tự chịu trách nhiệm về tài sản cá nhân.</li>
        <li>Cobi không chịu trách nhiệm cho các vật dụng bị mất hoặc hư hỏng.</li>
        <li>Khách hàng phải bồi thường nếu làm hư hại tài sản của Cobi.</li>
      </ul>
    `,
    privacyContent: `
      <h3>3. CHÍNH SÁCH BẢO MẬT</h3>
      <ul>
        <li>Thông tin cá nhân được bảo mật theo quy định pháp luật.</li>
        <li>Cobi có thể liên hệ qua email/SMS về dịch vụ và khuyến mãi.</li>
        <li>Khách hàng có quyền yêu cầu xóa dữ liệu cá nhân.</li>
      </ul>
    `,
    cancellationContent: `
      <h3>4. CHÍNH SÁCH HỦY</h3>
      <ul>
        <li>Hủy trước 24 giờ: Hoàn 100% phí.</li>
        <li>Hủy trong vòng 24 giờ: Không hoàn phí.</li>
        <li>Không đến (No-show): Không hoàn phí.</li>
      </ul>
    `,
    fullContent: '',
    applicableSpaceTypes: ['hot_desk'],
    isActive: true,
    effectiveFrom: '2026-04-01',
    createdAt: '2026-03-15T09:00:00Z',
    updatedAt: '2026-03-15T09:00:00Z',
    createdBy: 'admin-001',
  },
  {
    id: 'tc-002',
    termsCode: 'TC-MEETING-001',
    title: 'Điều khoản sử dụng Meeting Room',
    version: '1.3',
    usageRulesContent: `
      <h3>1. QUY ĐỊNH SỬ DỤNG</h3>
      <ul>
        <li>Check-in đúng giờ. Trễ quá 15 phút có thể bị hủy booking.</li>
        <li>Sử dụng phòng đúng thời gian đã đặt.</li>
        <li>Không mang thức ăn có mùi mạnh vào phòng.</li>
        <li>Dọn dẹp phòng sau khi sử dụng.</li>
      </ul>
    `,
    liabilityContent: `
      <h3>2. TRÁCH NHIỆM</h3>
      <ul>
        <li>Bảo quản thiết bị trong Meeting Room.</li>
        <li>Báo cáo ngay nếu thiết bị hư hỏng.</li>
        <li>Bồi thường thiệt hại do lỗi của khách hàng.</li>
      </ul>
    `,
    privacyContent: `
      <h3>3. CHÍNH SÁCH BẢO MẬT</h3>
      <ul>
        <li>Nội dung cuộc họp được bảo mật.</li>
        <li>Camera an ninh chỉ giám sát khu vực chung.</li>
      </ul>
    `,
    cancellationContent: `
      <h3>4. CHÍNH SÁCH HỦY</h3>
      <ul>
        <li>Hủy trước 4 giờ: Hoàn 100%.</li>
        <li>Hủy trong vòng 4 giờ: Tính 50% phí.</li>
        <li>Không đến: Tính 100% phí.</li>
      </ul>
    `,
    fullContent: '',
    applicableSpaceTypes: ['meeting_room'],
    isActive: true,
    effectiveFrom: '2026-03-01',
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-02-28T10:00:00Z',
    createdBy: 'admin-001',
  },
  {
    id: 'tc-003',
    termsCode: 'TC-EVENT-001',
    title: 'Điều khoản sử dụng Event Space',
    version: '1.0',
    usageRulesContent: '<h3>QUY ĐỊNH SỬ DỤNG EVENT SPACE</h3><p>Tuân thủ quy định tổ chức sự kiện</p>',
    liabilityContent: '<h3>TRÁCH NHIỆM</h3><p>Bảo đảm an toàn trong sự kiện</p>',
    privacyContent: '<h3>BẢO MẬT</h3><p>Theo quy định chung</p>',
    cancellationContent: '<h3>HỦY SỰ KIỆN</h3><p>Hủy trước 7 ngày hoàn 100%</p>',
    fullContent: '',
    applicableSpaceTypes: ['event_space'],
    isActive: true,
    effectiveFrom: '2026-01-01',
    createdAt: '2025-12-15T09:00:00Z',
    updatedAt: '2025-12-15T09:00:00Z',
    createdBy: 'admin-001',
  },
]

// ========== MOCK ACCEPTANCE LOGS ==========

export const mockAcceptanceLogs: AcceptanceLog[] = [
  {
    id: 'al-001',
    customerId: 'cus-001',
    customerName: 'Nguyễn Văn An',
    termsId: 'tc-001',
    termsVersion: '2.1',
    termsTitle: 'Điều khoản sử dụng Hot Desk',
    termsContent: '...snapshot of terms...',
    acceptedAt: '2026-04-17T08:30:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    acceptedVia: 'online',
    bookingId: 'bk-001',
    metadata: {
      browserName: 'Chrome',
      browserVersion: '120',
      osName: 'macOS',
      osVersion: '14.2',
      deviceType: 'desktop',
    },
  },
  {
    id: 'al-002',
    customerId: 'cus-002',
    customerName: 'Trần Thị Bình',
    termsId: 'tc-002',
    termsVersion: '1.3',
    termsTitle: 'Điều khoản sử dụng Meeting Room',
    termsContent: '...snapshot...',
    acceptedAt: '2026-04-16T14:00:00Z',
    ipAddress: '10.0.0.50',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)',
    acceptedVia: 'online',
    bookingId: 'bk-002',
    metadata: {
      browserName: 'Safari',
      browserVersion: '17',
      osName: 'iOS',
      osVersion: '17.0',
      deviceType: 'mobile',
    },
  },
  {
    id: 'al-003',
    customerId: 'cus-003',
    customerName: 'Lê Văn Cường',
    termsId: 'tc-001',
    termsVersion: '2.0',
    termsTitle: 'Điều khoản sử dụng Hot Desk',
    termsContent: '...snapshot...',
    acceptedAt: '2026-04-10T10:15:00Z',
    ipAddress: '192.168.1.50',
    userAgent: 'Walk-in customer',
    acceptedVia: 'in_person',
    acceptedBy: 'admin-002',
    bookingId: 'bk-003',
  },
]

// ========== DASHBOARD STATS ==========

export const mockContractDashboardStats: ContractDashboardStats = {
  total: 10,
  active: 4,
  expiringSoon: 2,
  expired: 1,
  draft: 1,
  terminated: 1,
  totalMonthlyRevenue: 95500000,
  renewalRate: 75.5,
}

export const mockExpiringContracts: ExpiringContract[] = [
  {
    id: 'ctr-003',
    contractCode: 'CTR-20260301-003',
    customerName: 'Trần Thị Bình',
    endDate: '2026-05-01',
    daysRemaining: 14,
    monthlyFee: 3000000,
    autoRenewEnabled: false,
  },
  {
    id: 'ctr-010',
    contractCode: 'CTR-20260320-010',
    customerName: 'Công ty Global Finance',
    endDate: '2026-04-30',
    daysRemaining: 13,
    monthlyFee: 45000000,
    autoRenewEnabled: true,
  },
]

export const mockRenewalQueue: RenewalQueueItem[] = [
  {
    id: 'ctr-010',
    contractCode: 'CTR-20260320-010',
    customerName: 'Công ty Global Finance',
    expiryDate: '2026-04-30',
    status: 'pending',
    newFee: 45000000,
  },
  {
    id: 'ctr-001',
    contractCode: 'CTR-20260115-001',
    customerName: 'Nguyễn Văn An',
    expiryDate: '2026-07-14',
    status: 'pending',
    newFee: 5000000,
  },
]

// ========== SERVICE FUNCTIONS ==========

let templates = [...mockContractTemplates]
let contracts = [...mockContracts]
let termsAndConditions = [...mockTermsAndConditions]

// Generate contract code
function generateContractCode(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const seq = String(contracts.length + 1).padStart(3, '0')
  return `CTR-${dateStr}-${seq}`
}

// Generate template code
function generateTemplateCode(): string {
  const seq = String(templates.length + 1).padStart(3, '0')
  return `TPL-${seq}`
}

// Generate terms code
function generateTermsCode(spaceTypes: string[]): string {
  const typePrefix = spaceTypes[0]?.toUpperCase().replace('_', '-') || 'GENERAL'
  const seq = String(termsAndConditions.filter(t => t.applicableSpaceTypes.some(s => spaceTypes.includes(s))).length + 1).padStart(3, '0')
  return `TC-${typePrefix}-${seq}`
}

// ========== TEMPLATE FUNCTIONS ==========

export function getTemplates(filters?: TemplateFilters): PaginatedTemplates {
  let filtered = [...templates]

  if (filters?.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(search) ||
      t.templateCode.toLowerCase().includes(search)
    )
  }

  if (filters?.isActive !== undefined) {
    filtered = filtered.filter(t => t.isActive === filters.isActive)
  }

  const page = filters?.page || 1
  const limit = filters?.limit || 10
  const start = (page - 1) * limit
  const paginatedData = filtered.slice(start, start + limit)

  return {
    data: paginatedData.map(t => ({
      id: t.id,
      templateCode: t.templateCode,
      name: t.name,
      version: t.version,
      isActive: t.isActive,
      isDefault: t.isDefault,
      updatedAt: t.updatedAt,
    })),
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
  }
}

export function getTemplateById(id: string): ContractTemplate | undefined {
  return templates.find(t => t.id === id)
}

export function createTemplate(data: CreateContractTemplateRequest): ContractTemplate {
  const newTemplate: ContractTemplate = {
    id: `tpl-${Date.now()}`,
    templateCode: generateTemplateCode(),
    version: '1.0',
    isActive: true,
    isDefault: data.isDefault ?? false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user',
    ...data,
  }
  templates.push(newTemplate)
  return newTemplate
}

export function updateTemplate(data: UpdateContractTemplateRequest): ContractTemplate {
  const index = templates.findIndex(t => t.id === data.id)
  if (index === -1) throw new Error('Template not found')

  const existing = templates[index]
  const updated: ContractTemplate = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
    updatedBy: 'current-user',
  }
  templates[index] = updated
  return updated
}

export function deleteTemplate(id: string): void {
  const index = templates.findIndex(t => t.id === id)
  if (index === -1) throw new Error('Template not found')
  templates.splice(index, 1)
}

// ========== CONTRACT FUNCTIONS ==========

export function getContracts(filters?: ContractFilters): PaginatedContracts {
  let filtered = [...contracts]

  if (filters?.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(c =>
      c.contractCode.toLowerCase().includes(search) ||
      c.customerName.toLowerCase().includes(search)
    )
  }

  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter(c => c.status === filters.status)
  }

  if (filters?.customerId) {
    // This would need contract details to filter properly
    // For mock, we skip this
  }

  const page = filters?.page || 1
  const limit = filters?.limit || 10
  const start = (page - 1) * limit
  const paginatedData = filtered.slice(start, start + limit)

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
  }
}

export function getContractById(id: string): ContractDetails | undefined {
  // First check if we have detailed mock data
  if (mockContractDetails[id]) {
    return mockContractDetails[id]
  }

  // Otherwise, generate from list item
  const listItem = contracts.find(c => c.id === id)
  if (!listItem) return undefined

  // Generate a basic detail view from list item
  return {
    id: listItem.id,
    contractCode: listItem.contractCode,
    status: listItem.status,
    customerId: 'cus-001',
    customerName: listItem.customerName,
    customerType: listItem.customerType,
    buildingId: 'bld-001',
    buildingName: listItem.buildingName,
    spaceId: 'space-001',
    spaceName: listItem.spaceName,
    startDate: listItem.startDate,
    endDate: listItem.endDate,
    durationMonths: 6,
    monthlyFee: listItem.monthlyFee,
    depositAmount: listItem.monthlyFee,
    totalValue: listItem.monthlyFee * 6,
    templateId: 'tpl-001',
    templateVersion: '1.0',
    autoRenewalSettings: {
      enabled: listItem.autoRenewEnabled,
      renewalDuration: 6,
      renewalPricing: 'same',
      notifyDaysBefore: 30,
    },
    createdAt: '2026-01-01T09:00:00Z',
    updatedAt: '2026-01-01T09:00:00Z',
    createdBy: 'admin-001',
    statusHistory: [
      {
        id: 'sh-001',
        contractId: listItem.id,
        fromStatus: null,
        toStatus: 'draft',
        changedAt: '2026-01-01T09:00:00Z',
        changedBy: 'admin-001',
      },
    ],
  }
}

export function createContract(data: CreateContractRequest): Contract {
  const endDate = new Date(data.startDate)
  endDate.setMonth(endDate.getMonth() + data.durationMonths)

  const newContract: Contract = {
    id: `ctr-${Date.now()}`,
    contractCode: generateContractCode(),
    status: 'draft',
    customerId: data.customerId,
    customerName: 'New Customer',
    customerType: 'individual',
    buildingId: data.buildingId,
    buildingName: 'Selected Building',
    spaceId: data.spaceId,
    spaceName: 'Selected Space',
    startDate: data.startDate,
    endDate: endDate.toISOString().slice(0, 10),
    durationMonths: data.durationMonths,
    monthlyFee: data.monthlyFee,
    setupFee: data.setupFee,
    depositAmount: data.depositAmount,
    totalValue: data.monthlyFee * data.durationMonths + (data.setupFee || 0),
    templateId: data.templateId,
    templateVersion: '1.0',
    customNotes: data.customNotes,
    autoRenewalSettings: data.autoRenewalSettings ? {
      enabled: data.autoRenewalSettings.enabled,
      renewalDuration: data.autoRenewalSettings.renewalDuration || data.durationMonths,
      renewalPricing: data.autoRenewalSettings.renewalPricing || 'same',
      customMonthlyFee: data.autoRenewalSettings.customMonthlyFee,
      notifyDaysBefore: 30,
    } : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user',
  }

  // Add to list
  contracts.push({
    id: newContract.id,
    contractCode: newContract.contractCode,
    status: newContract.status,
    customerName: newContract.customerName,
    customerType: newContract.customerType,
    buildingName: newContract.buildingName,
    spaceName: newContract.spaceName,
    startDate: newContract.startDate,
    endDate: newContract.endDate,
    monthlyFee: newContract.monthlyFee,
    daysRemaining: Math.ceil((new Date(newContract.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    autoRenewEnabled: newContract.autoRenewalSettings?.enabled || false,
  })

  return newContract
}

export function activateContract(id: string): Contract {
  const contract = contracts.find(c => c.id === id)
  if (!contract) throw new Error('Contract not found')
  
  contract.status = 'active'
  return getContractById(id) as Contract
}

export function terminateContract(id: string, reason: string): Contract {
  const contract = contracts.find(c => c.id === id)
  if (!contract) throw new Error('Contract not found')
  
  contract.status = 'terminated'
  contract.daysRemaining = 0
  // Store termination reason (logged for audit purposes)
  console.log(`Contract ${id} terminated: ${reason}`)
  return getContractById(id) as Contract
}

// ========== TERMS FUNCTIONS ==========

export function getTerms(filters?: TermsFilters): PaginatedTerms {
  let filtered = [...termsAndConditions]

  if (filters?.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(search) ||
      t.termsCode.toLowerCase().includes(search)
    )
  }

  if (filters?.spaceType && filters.spaceType !== 'all') {
    filtered = filtered.filter(t => t.applicableSpaceTypes.includes(filters.spaceType as any))
  }

  if (filters?.isActive !== undefined) {
    filtered = filtered.filter(t => t.isActive === filters.isActive)
  }

  const page = filters?.page || 1
  const limit = filters?.limit || 10
  const start = (page - 1) * limit
  const paginatedData = filtered.slice(start, start + limit)

  return {
    data: paginatedData.map(t => ({
      id: t.id,
      termsCode: t.termsCode,
      title: t.title,
      version: t.version,
      applicableSpaceTypes: t.applicableSpaceTypes,
      isActive: t.isActive,
      effectiveFrom: t.effectiveFrom,
      updatedAt: t.updatedAt,
    })),
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
  }
}

export function getTermsById(id: string): TermsAndConditions | undefined {
  return termsAndConditions.find(t => t.id === id)
}

export function createTerms(data: CreateTermsRequest): TermsAndConditions {
  const newTerms: TermsAndConditions = {
    id: `tc-${Date.now()}`,
    termsCode: generateTermsCode(data.applicableSpaceTypes),
    version: '1.0',
    fullContent: `${data.usageRulesContent}\n${data.liabilityContent}\n${data.privacyContent}\n${data.cancellationContent}`,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user',
    ...data,
  }
  termsAndConditions.push(newTerms)
  return newTerms
}

// ========== ACCEPTANCE LOG FUNCTIONS ==========

export function getAcceptanceLogs(customerId: string): AcceptanceLogListItem[] {
  return mockAcceptanceLogs
    .filter(log => log.customerId === customerId)
    .map(log => ({
      id: log.id,
      termsTitle: log.termsTitle,
      termsVersion: log.termsVersion,
      acceptedAt: log.acceptedAt,
      ipAddress: log.ipAddress,
      acceptedVia: log.acceptedVia,
      bookingCode: log.bookingId ? `BK-${log.bookingId.slice(-3)}` : undefined,
    }))
}

export function getAcceptanceLogById(id: string): AcceptanceLog | undefined {
  return mockAcceptanceLogs.find(log => log.id === id)
}
