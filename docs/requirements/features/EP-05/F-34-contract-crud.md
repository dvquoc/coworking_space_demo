# F-34 – Tạo và quản lý hợp đồng (Contract CRUD)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-34 |
| Epic | EP-05 - Contract Management |
| Độ ưu tiên | Must have ⭐ CRITICAL |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép **Manager/Sale** tạo và quản lý **Formal Contracts** (hợp đồng chính thức) cho các giao dịch thuê dài hạn. Hợp đồng được tạo từ **Contract Templates** (F-35) với placeholders được fill tự động.

**Business Rationale:**
- **Legal binding**: Hợp đồng chính thức là căn cứ pháp lý cho việc thuê dài hạn
- **Revenue tracking**: Theo dõi doanh thu từ contracts
- **Customer commitment**: Đảm bảo khách hàng cam kết thuê trong thời gian nhất định
- **Audit trail**: Lưu trữ đầy đủ thông tin hợp đồng cho kiểm toán

**Khi nào BẮT BUỘC có Formal Contract:**
- Dedicated Desk thuê ≥ 1 tháng
- Private Office (bất kỳ thời gian)

> **Note**: Hot Desk và Meeting Room không cần hợp đồng, chỉ cần chấp nhận Terms & Conditions (F-36).

**Business Rules:**
- Contract code tự động generate: `CTR-YYYYMMDD-XXX`
- Mỗi contract link đến 1 Customer, 1 Building, và 1 Space (bắt buộc)
- Contract phải chọn template từ danh sách active templates (F-35)
- Start date không được trong quá khứ
- Duration tối thiểu 1 tháng, tối đa 24 tháng
- Deposit thường = 1 tháng tiền thuê
- Không thể edit contract sau khi status = `active`
- Chỉ có thể terminate contract nếu đang active

**Out of Scope:**
- Contract amendments / addendum → Phase 2
- Multi-space contracts (1 contract cho nhiều spaces) → Phase 2
- Contract renewal chains tracking → Phase 2
- Integration với e-signature (DocuSign) → Phase 2

## User Story

> Là **Manager/Sale**, tôi muốn **tạo hợp đồng cho khách hàng thuê dài hạn** để **formalize quan hệ thuê và đảm bảo compliance pháp lý**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Access Control & Navigation

- [ ] **AC1**: Route `/contracts` accessible cho roles: `admin`, `manager`, `sale`, `accountant`
- [ ] **AC2**: Create/Edit permissions: `admin`, `manager`, `sale`
- [ ] **AC3**: View only: `accountant`
- [ ] **AC4**: Menu sidebar: "Contracts" → "Contract List"

### Contract List Page

- [ ] **AC5**: Hiển thị danh sách contracts với columns:
  | Column | Description |
  |--------|-------------|
  | Contract Code | Mã hợp đồng (CTR-YYYYMMDD-XXX) |
  | Customer | Tên khách hàng (link to customer) |
  | Building | Tòa nhà |
  | Space | Không gian thuê cụ thể |
  | Duration | Start - End date |
  | Monthly Fee | Giá thuê/tháng |
  | Status | Badge: draft/active/expiring/expired/terminated |
  | Actions | View, Edit, Terminate |

- [ ] **AC6**: Filters:
  - Status: All, Draft, Active, Expiring Soon, Expired, Terminated
  - Building: dropdown list buildings
  - Date Range: Contract signed date

- [ ] **AC7**: Search by: Contract code, Customer name, Customer code
- [ ] **AC8**: Sort by: Created date (default desc), Start date, End date, Monthly fee
- [ ] **AC9**: Pagination: 20 items/page

### Status Badges

- [ ] **AC10**: Status badges với màu sắc:
  | Status | Color | Description |
  |--------|-------|-------------|
  | `draft` | Gray | Đang soạn, chưa ký |
  | `active` | Green | Đã ký, đang hiệu lực |
  | `expiring_soon` | Orange | Sắp hết hạn (< 30 ngày) |
  | `expired` | Red | Đã hết hạn |
  | `terminated` | Dark Red | Chấm dứt sớm |
  | `renewed` | Blue | Đã gia hạn (old contract) |

### Create Contract

- [ ] **AC11**: Button "Create Contract" → navigate to `/contracts/create`
- [ ] **AC12**: Create form - Step 1: Select Customer & Template
  | Field | Label | Type | Required |
  |-------|-------|------|----------|
  | customerId | Khách hàng | SearchSelect | ✅ |
  | templateId | Mẫu hợp đồng | Select | ✅ |

- [ ] **AC13**: Customer search: search by name, code, email, phone
- [ ] **AC14**: Template dropdown chỉ hiển thị active templates
- [ ] **AC15**: Sau khi chọn customer → auto-fill customer info preview

### Create Contract - Step 2: Contract Details

- [ ] **AC16**: Contract details form:
  | Field | Label | Type | Required | Validation |
  |-------|-------|------|----------|------------|
  | buildingId | Tòa nhà | Select | ✅ | List buildings |
  | spaceId | Space cụ thể | Select | ✅ | Spaces in building (Dedicated Desk/Private Office) |
  | startDate | Ngày bắt đầu | Date | ✅ | >= today |
  | durationMonths | Thời hạn (tháng) | Number | ✅ | 1-24 |
  | endDate | Ngày kết thúc | Date | Auto | Calculated |
  | monthlyFee | Giá thuê/tháng | Currency | ✅ | > 0 |
  | setupFee | Phí setup | Currency | ❌ | >= 0 |
  | depositAmount | Tiền đặt cọc | Currency | ❌ | >= 0 |
  | totalValue | Tổng giá trị | Currency | Auto | Calculated |
  | autoRenewal | Tự động gia hạn | Toggle | ✅ | Default: false |
  | renewalNoticeDays | Thông báo trước | Number | ✅ if auto | Default: 30 |

- [ ] **AC17**: `endDate` = `startDate` + `durationMonths` (tự động tính)
- [ ] **AC18**: `totalValue` = `monthlyFee × durationMonths + setupFee` (tự động tính)
- [ ] **AC19**: Suggest `depositAmount` = `monthlyFee` (có thể edit)

### Create Contract - Step 3: Preview & Custom Notes

- [ ] **AC20**: Hiển thị generated contract content (placeholders đã được fill)
- [ ] **AC21**: Show side-by-side: Template sections | Generated content
- [ ] **AC22**: Field `customNotes` để thêm ghi chú riêng cho contract này
- [ ] **AC23**: Button "Generate PDF Preview" → mở PDF viewer modal

### Save Contract

- [ ] **AC24**: Button "Save as Draft" → status = `draft`, redirect to detail
- [ ] **AC25**: Button "Save & Activate" → confirm dialog → status = `active`
- [ ] **AC26**: Khi activate:
  - Validate all required fields
  - Check customer không có contract active khác cho cùng building/space
  - Set `signedAt` = current timestamp
- [ ] **AC27**: Success toast: "Hợp đồng đã được tạo"

### Edit Contract

- [ ] **AC28**: Contract status = `draft` → có thể edit tất cả fields
- [ ] **AC29**: Contract status = `active` → chỉ edit: customNotes, autoRenewal settings
- [ ] **AC30**: Không thể edit contracts đã `expired` hoặc `terminated`
- [ ] **AC31**: Edit form pre-fill dữ liệu hiện tại

### View Contract Detail

- [ ] **AC32**: Route `/contracts/:id` → hiển thị contract detail page
- [ ] **AC33**: Sections:
  - **Header**: Contract code, status badge, action buttons
  - **Customer Info**: Customer details (link to customer)
  - **Contract Terms**: Space name, duration, dates, pricing
  - **Generated Content**: Full contract content (collapsible)
  - **Documents**: Uploaded files (PDF, signed copy)
  - **Timeline**: Status changes history
  - **Related**: Link to invoices generated from this contract

- [ ] **AC34**: Action buttons based on status:
  | Status | Available Actions |
  |--------|-------------------|
  | draft | Edit, Activate, Delete |
  | active | Edit (limited), Terminate, Download PDF |
  | expiring_soon | Renew, Terminate, Download PDF |
  | expired | View only, Renew |
  | terminated | View only |

### Terminate Contract

- [ ] **AC35**: Button "Terminate Contract" (chỉ khi status = `active` hoặc `expiring_soon`)
- [ ] **AC36**: Terminate form:
  | Field | Label | Type | Required |
  |-------|-------|------|----------|
  | terminationDate | Ngày chấm dứt | Date | ✅ |
  | reason | Lý do | Textarea | ✅ |
  | refundAmount | Số tiền hoàn | Currency | ❌ |
  | refundNotes | Ghi chú hoàn tiền | Textarea | ❌ |

- [ ] **AC37**: Confirm dialog với summary
- [ ] **AC38**: Sau khi terminate:
  - Status → `terminated`
  - `terminatedAt` = current timestamp
  - Notify accounting team for refund processing

### Delete Contract

- [ ] **AC39**: Chỉ có thể delete contract status = `draft`
- [ ] **AC40**: Confirm dialog: "Bạn có chắc muốn xóa hợp đồng này?"
- [ ] **AC41**: Hard delete, không soft delete

### Document Management

- [ ] **AC42**: Upload contract PDF (unsigned)
- [ ] **AC43**: Upload signed contract (PDF with signatures)
- [ ] **AC44**: Download contract as PDF
- [ ] **AC45**: File size limit: 10MB per file
- [ ] **AC46**: Accepted formats: PDF, JPG, PNG (for scanned docs)

## Dữ liệu / Fields

### Contract Entity

```typescript
interface Contract {
  id: string
  contractCode: string              // "CTR-20260417-001"
  
  // Parties
  customerId: string                // FK to Customer
  buildingId: string                // FK to Building
  spaceId?: string                  // FK to Space (optional)
  
  // Format & Type
  contractFormat: 'paper' | 'pdf' | 'e-contract'
  contractType: 'membership' | 'dedicated_space' | 'meeting_room_package'
  packageName?: string              // "Gold Membership", "Private Office 6M"
  
  // Template Reference
  templateId: string                // FK to ContractTemplate
  templateVersion: string           // "1.0"
  
  // Duration
  startDate: string                 // ISO date
  endDate: string                   // ISO date
  durationMonths: number
  
  // Pricing
  monthlyFee: number
  setupFee: number
  depositAmount: number
  totalValue: number
  
  // Generated Content
  generatedContent: string          // HTML/Markdown after placeholder replacement
  customNotes?: string              // Additional notes
  
  // Terms & Renewal
  termsVersion: string
  autoRenewal: boolean
  renewalNoticeDays: number
  
  // Status
  status: ContractStatus
  
  // Documents
  contractFileUrl?: string          // Unsigned PDF
  signedFileUrl?: string            // Signed PDF
  signatureType?: 'manual' | 'digital'
  
  // E-Contract (if applicable)
  acceptedAt?: string
  acceptedByIp?: string
  acceptedByUser?: string
  
  // Audit
  createdBy: string
  createdAt: string
  updatedAt: string
  signedAt?: string
  terminatedAt?: string
  terminationReason?: string
}

type ContractStatus = 
  | 'draft'           // Đang soạn
  | 'active'          // Đã ký, đang hiệu lực  
  | 'expiring_soon'   // Sắp hết hạn (< 30 ngày)
  | 'expired'         // Đã hết hạn
  | 'terminated'      // Chấm dứt sớm
  | 'renewed'         // Đã gia hạn (link to new contract)

interface ContractWithRelations extends Contract {
  customer: Customer
  building: Building
  space?: Space
  template: ContractTemplate
  invoices: Invoice[]
}
```

### Contract Code Generation

```typescript
function generateContractCode(): string {
  const date = format(new Date(), 'yyyyMMdd');
  const sequence = await getNextSequence('contract', date);
  return `CTR-${date}-${String(sequence).padStart(3, '0')}`;
  // Example: CTR-20260417-001, CTR-20260417-002
}
```

## UI/UX Guidelines

### Contract List Page
```
┌─────────────────────────────────────────────────────────────────┐
│ Contracts                                    [Create Contract]  │
├─────────────────────────────────────────────────────────────────┤
│ [Status ▼] [Type ▼] [Building ▼] [Date Range] Search:[______]  │
├─────────────────────────────────────────────────────────────────┤
│ Contract     │ Customer       │ Type       │ Duration    │Status│
│──────────────┼────────────────┼────────────┼─────────────┼──────│
│CTR-0417-001  │ Nguyễn Văn A   │ Membership │ 01/05-31/10 │🟢 Act│
│CTR-0415-003  │ ABC Tech Co.   │ Dedicated  │ 01/04-31/03 │🟠 Exp│
│CTR-0410-002  │ Trần Thị B     │ Meeting    │ 01/04-30/06 │⬜ Draft│
└─────────────────────────────────────────────────────────────────┘
```

### Create Contract - Step by Step
```
┌─────────────────────────────────────────────────────────────────┐
│ Create Contract                                                 │
│ Step: [1. Customer ●]──[2. Details ○]──[3. Preview ○]          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ SELECT CUSTOMER                                                 │
│ [🔍 Search customer by name, code, email...              ]     │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────┐    │
│ │ Selected: Nguyễn Văn A (CUS-0001)                       │    │
│ │ Email: an.nguyen@gmail.com | Phone: 0901234567         │    │
│ │ Type: Individual | Status: Active                       │    │
│ └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│ CONTRACT TYPE                                                   │
│ ○ Membership        ○ Dedicated Space        ○ Meeting Package │
│                                                                 │
│ SELECT TEMPLATE                                                 │
│ [TPL-MEMBERSHIP-GOLD - Hợp đồng Membership Gold v1.0       ▼]  │
│                                                                 │
│                                              [Cancel] [Next →] │
└─────────────────────────────────────────────────────────────────┘
```

### Contract Detail Page
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to List                                                  │
│                                                                 │
│ CTR-20260417-001                              🟢 Active         │
│ Hợp đồng Membership Gold                                        │
├─────────────────────────────────────────────────────────────────┤
│ [Edit] [Download PDF] [Terminate]      Created: 17/04/2026     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ CUSTOMER INFO                     │ CONTRACT TERMS              │
│ ┌───────────────────────────────┐ │ Type: Membership           │
│ │ Nguyễn Văn A (CUS-0001)       │ │ Package: Gold              │
│ │ 📧 an.nguyen@gmail.com        │ │ Building: Cobi Tower 1     │
│ │ 📱 0901234567                 │ │                            │
│ └───────────────────────────────┘ │ Start: 01/05/2026          │
│                                   │ End: 31/10/2026            │
│ PRICING                           │ Duration: 6 months         │
│ Monthly Fee: 8,000,000 VND        │                            │
│ Setup Fee: 1,000,000 VND          │ Auto Renewal: Yes          │
│ Deposit: 8,000,000 VND            │ Notice: 30 days            │
│ ─────────────────────────────     │                            │
│ Total Value: 49,000,000 VND       │                            │
│                                                                 │
├───────────────────────────── TABS ──────────────────────────────┤
│ [Content] [Documents] [Timeline] [Invoices]                     │
│                                                                 │
│ ▼ Contract Content (Generated from template)                    │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ HỢP ĐỒNG MEMBERSHIP                                         ││
│ │ Số: CTR-20260417-001                                        ││
│ │ Ngày ký: 17/04/2026                                         ││
│ │                                                             ││
│ │ BÊN CHO THUÊ (Bên A):                                       ││
│ │ Công ty TNHH Cobi, MST: 0123456789...                       ││
│ │                                                             ││
│ │ BÊN THUÊ (Bên B):                                           ││
│ │ Ông/Bà: Nguyễn Văn A, CCCD: 001234567890...                 ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Scenarios

### Scenario 1: Tạo contract mới
```
Given Manager đăng nhập
When Navigate to "Contracts" → "Create Contract"
And Step 1: Search customer "Nguyễn Văn A" → Select
And Chọn type "membership" → Select template "TPL-MEMBERSHIP-GOLD v1.0"
And Click "Next"
And Step 2: Nhập:
  - Building: "Cobi Tower 1"
  - Package: "Gold Membership"
  - Start Date: "01/05/2026"
  - Duration: 6 months → End Date auto = "31/10/2026"
  - Monthly Fee: 8,000,000
  - Setup Fee: 1,000,000
  - Deposit: 8,000,000 (suggested = monthly)
  - Total Value auto = 49,000,000
  - Auto Renewal: Yes, 30 days notice
And Click "Next"
And Step 3: Preview generated content
  - Verify {{customerName}} = "Nguyễn Văn A"
  - Verify {{monthlyFee}} = "8,000,000"
  - Verify all placeholders filled correctly
And Click "Save as Draft"
Then Contract created với code "CTR-20260417-001", status = "draft"
And Redirect to contract detail page
```

### Scenario 2: Activate contract
```
Given Contract "CTR-20260417-001" status = "draft"
When Manager view contract detail → Click "Activate"
Then Confirm dialog: "Xác nhận kích hoạt hợp đồng?"
And Manager confirm
Then Status → "active"
And signedAt = current timestamp
And Toast: "Hợp đồng đã được kích hoạt"
```

### Scenario 3: Terminate contract sớm
```
Given Contract "CTR-20260417-001" status = "active", end date = "31/10/2026"
When Manager click "Terminate Contract" (current date = 01/07/2026)
And Fill form:
  - Termination Date: "15/07/2026"
  - Reason: "Khách hàng chuyển văn phòng ra nước ngoài"
  - Refund Amount: 24,000,000 (3 tháng còn lại)
  - Refund Notes: "Hoàn tiền 3 tháng unused + deposit"
And Click "Confirm Terminate"
Then Status → "terminated"
And terminatedAt = "15/07/2026"
And Notification sent to Accounting team
And Toast: "Hợp đồng đã được chấm dứt"
```

### Scenario 4: Duplicate customer space check
```
Given Customer "CUS-0001" đã có contract active cho "Cobi Tower 1 - Zone A"
When Manager tạo contract mới cho cùng Customer + Building + Space
And Click "Save as Draft"
Then Validation error: "Khách hàng đã có hợp đồng đang hiệu lực cho space này"
And Suggest: "Xem hợp đồng hiện tại" (link)
```

## Phụ thuộc

**Phụ thuộc vào:**
- EP-01: Auth (role-based access)
- EP-02: Property Management (buildings, spaces)
- EP-03: Customer Management (customers)
- F-35: Contract Templates (template selection)

**Được sử dụng bởi:**
- F-35A: Apply Template (generate content)
- F-36: Contract Lifecycle (status tracking)
- F-37: Auto-renewal (renew contracts)
- EP-06: Payment & Invoicing (generate invoices from contracts)

## Technical Notes

### API Endpoints

```
GET    /api/contracts                   # List contracts
GET    /api/contracts/:id               # Get contract detail
POST   /api/contracts                   # Create contract
PUT    /api/contracts/:id               # Update contract
DELETE /api/contracts/:id               # Delete contract (draft only)
POST   /api/contracts/:id/activate      # Activate contract
POST   /api/contracts/:id/terminate     # Terminate contract
GET    /api/contracts/:id/pdf           # Generate/Download PDF
POST   /api/contracts/:id/documents     # Upload document
```

### Contract Validation

```typescript
function validateContractCreate(data: CreateContractRequest): ValidationResult {
  const errors: string[] = [];
  
  // Required fields
  if (!data.customerId) errors.push('Customer is required');
  if (!data.templateId) errors.push('Template is required');
  if (!data.buildingId) errors.push('Building is required');
  if (!data.startDate) errors.push('Start date is required');
  if (!data.durationMonths) errors.push('Duration is required');
  if (!data.monthlyFee) errors.push('Monthly fee is required');
  
  // Business rules
  if (data.startDate < today()) {
    errors.push('Start date cannot be in the past');
  }
  if (data.durationMonths < 1 || data.durationMonths > 24) {
    errors.push('Duration must be between 1-24 months');
  }
  
  // Check duplicate active contract
  const existingContract = await findActiveContract(
    data.customerId, 
    data.buildingId, 
    data.spaceId
  );
  if (existingContract) {
    errors.push('Customer already has an active contract for this space');
  }
  
  return { valid: errors.length === 0, errors };
}
```

### Status Auto-Update (Cronjob)

```typescript
// Run daily at 00:00
async function updateContractStatuses() {
  const today = new Date();
  const in30Days = addDays(today, 30);
  
  // Active → Expiring Soon (< 30 days to end)
  await Contract.updateMany(
    { status: 'active', endDate: { $lte: in30Days, $gt: today } },
    { status: 'expiring_soon', updatedAt: today }
  );
  
  // Active/Expiring Soon → Expired (past end date)
  await Contract.updateMany(
    { status: { $in: ['active', 'expiring_soon'] }, endDate: { $lt: today } },
    { status: 'expired', updatedAt: today }
  );
}
```
