# EP-05 – Contract Management

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-05 |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |
| Độ ưu tiên | Must have |

## Mô tả

Quản lý hợp đồng thuê coworking space giữa Cobi và khách hàng. Hỗ trợ **2 dạng hợp đồng**:

1. **Hợp đồng chính thức (Formal Contract)**: Hợp đồng giấy/PDF cho thuê dài hạn (≥1 tháng), có chữ ký, đóng dấu
2. **Hợp đồng điện tử (E-Contract)**: Khách tick "đồng ý điều khoản" khi booking, lưu log + timestamp

**Best Practice**:
- **Thuê dài hạn** (Dedicated Desk, Private Office ≥1 tháng) → **BẮT BUỘC** có formal contract
- **Thuê ngắn hạn** (Hot Desk giờ/ngày) → Terms & Conditions + log acceptance

**Nội dung hợp đồng**: Thông tin bên thuê/cho thuê, dịch vụ thuê (loại chỗ, thời gian, quyền lợi), Giá trị hợp đồng, quy định sử dụng, trách nhiệm bồi thường, điều khoản chấm dứt.

**Cơ sở pháp lý**: Theo Bộ luật Dân sự 2015, không bắt buộc hợp đồng giấy mọi trường hợp, nhưng thỏa thuận rõ ràng là bằng chứng pháp lý quan trọng.

## Features thuộc Epic này

### Phase 1 - Basic Features

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|----------|
| F-34 | Tạo hợp đồng (Create Contract) | CRUD formal contracts cho long-term rentals | Draft |
| F-35 | Contract template management | CRUD mẫu hợp đồng (templates) với placeholders | Draft |
| F-35A | Apply template to contract | Chọn template, fill placeholders, generate contract | Draft |
| F-36 | Contract lifecycle | Track status: draft/active/expired/terminated | Draft |
| F-37 | Auto-renewal management | Cấu hình tự động gia hạn | Draft |
| F-37A | E-Contract & Terms acceptance | Hợp đồng điện tử: Customer tick "đồng ý", log acceptance | Draft |
| F-37B | Terms & Conditions template management | CRUD mẫu Terms & Conditions với version control | Draft |

### Phase 2 - Advanced Features
- F-38: Digital signature integration
- F-39: Contract versioning & amendments
- F-40: Contract analytics & expiry alerts
- F-41: Bulk contract operations

## Data Models

### ContractTemplate (Mẫu hợp đồng)
```typescript
interface ContractTemplate {
  id: string;
  code: string;                 // "TPL-DEDICATED-DESK", "TPL-PRIVATE-OFFICE"
  name: string;                 // "Hợp đồng Dedicated Desk", "Hợp đồng Private Office"
  description?: string;         // Short description
  
  // Template Content (with placeholders)
  headerTemplate: string;       // Header section với placeholders: {{contractCode}}, {{signedDate}}
  partyLessorTemplate: string;  // Bên cho thuê: "Công ty {{companyName}}, địa chỉ {{companyAddress}}..."
  partyLesseeTemplate: string;  // Bên thuê: "{{customerType}} {{customerName}}, CCCD {{customerId}}..."
  serviceTemplate: string;      // "Thuê {{spaceType}} tại {{buildingName}}, thời gian {{duration}} tháng..."
  pricingTemplate: string;      // "Giá thuê: {{monthlyFee}} VND/tháng, đặt cọc {{deposit}} VND..."
  usageRulesTemplate: string;   // Quy định sử dụng standard
  liabilityTemplate: string;    // Trách nhiệm & bồi thường
  terminationTemplate: string;  // Điều khoản chấm dứt
  signatureTemplate: string;    // Footer với chữ ký
  
  // Placeholders List (for reference)
  placeholders: string[];       // ["{{contractCode}}", "{{customerName}}", "{{monthlyFee}}"...]
  
  // Version & Status
  version: string;              // "1.0", "1.1", "2.0"
  isActive: boolean;            // Template hiện tại có đang dùng?
  effectiveDate: Date;          // Ngày có hiệu lực
  
  // Meta
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Contract (Formal Contract - Long-term)
```typescript
interface Contract {
  id: string;
  contractCode: string;         // "CTR-20260416-001"
  
  // Parties
  customerId: string;           // FK to Customer
  buildingId: string;           // Contract specific to which building
  
  // Space (thuê Dedicated Desk / Private Office cụ thể)
  spaceId: string;              // FK to Space - chỗ ngồi/phòng cụ thể
  spaceName: string;            // Denormalized: "Private Office 201", "Dedicated Desk B-05"
  
  // Format
  contractFormat: 'paper' | 'pdf' | 'e-contract';  // Paper/PDF (formal) vs E-Contract
  
  // Template Reference (NEW - thay vì hardcode content)
  templateId: string;           // FK to ContractTemplate
  templateVersion: string;      // Version of template used (e.g., "1.0")
  
  // Duration
  startDate: Date;
  endDate: Date;
  durationMonths: number;
  
  // Pricing
  monthlyFee: number;
  setupFee?: number;            // One-time fee khi ký
  depositAmount?: number;
  totalValue: number;           // Total contract value
  
  // Generated Content (from template + data)
  generatedContent: string;     // Full contract content sau khi fill placeholders (HTML/Markdown)
  customNotes?: string;         // Custom modifications cho contract này (optional)
  
  // Terms Version (for reference)
  termsVersion: string;         // Version of T&C embedded in template
  autoRenewal: boolean;
  renewalNoticeDays: number;    // Số ngày thông báo trước khi gia hạn
  
  // Status
  status: ContractStatus;
  
  // Documents & Signature
  contractFileUrl?: string;     // PDF url (unsigned)
  signedFileUrl?: string;       // Signed PDF (có chữ ký, đóng dấu)
  signatureType?: 'manual' | 'digital';  // Chữ ký tay vs chữ ký số (Phase 2)
  
  // E-Contract Acceptance (if contractFormat = 'e-contract')
  acceptedAt?: Date;            // Thời gian khách tick "đồng ý"
  acceptedByIp?: string;        // IP address of customer
  acceptedByUser?: string;      // User agent / device info
  
  // Meta
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  signedAt?: Date;
  terminatedAt?: Date;
  terminationReason?: string;
}

enum ContractStatus {
  DRAFT = 'draft',              // Đang soạn, chưa ký
  ACTIVE = 'active',           // Đã ký, đang hiệu lực
  EXPIRING_SOON = 'expiring_soon', // Sắp hết hạn (< 30 ngày)
  EXPIRED = 'expired',          // Đã hết hạn
  TERMINATED = 'terminated',    // Chấm dứt sớm
  RENEWED = 'renewed'           // Đã gia hạn (old contract)
}
```

### TermsAndConditions (for Short-term Bookings)
```typescript
interface TermsAndConditions {
  id: string;
  code: string;                 // "TC-HOTDESK", "TC-MEETINGROOM"
  version: string;              // "1.0", "1.1", "2.0"
  title: string;                // "Cobi Coworking Space - Terms & Conditions (Hot Desk)"
  
  // Template Content (với placeholders cho dynamic values)
  headerTemplate: string;       // "Điều khoản sử dụng {{spaceType}} tại {{buildingName}}"
  contentTemplate: string;      // Full T&C content template (HTML/Markdown)
  
  // Sections (structured templates)
  usageRulesTemplate: string;   // "Khách hàng được sử dụng {{spaceType}} trong giờ {{operatingHours}}..."
  liabilityTemplate: string;    // Trách nhiệm
  privacyPolicyTemplate: string;    // Chính sách bảo mật
  cancellationPolicyTemplate: string; // "Hủy trước {{cancelHours}} giờ: hoàn {{refundPercent}}%"
  
  // Placeholders
  placeholders: string[];       // ["{{spaceType}}", "{{buildingName}}", "{{operatingHours}}"...]
  
  // Validity
  effectiveDate: Date;          // Ngày có hiệu lực
  expiryDate?: Date;            // Ngày hết hiệu lực (optional)
  isActive: boolean;            // T&C hiện tại đang dùng
  
  // Applicable To
  applicableSpaceTypes: string[];  // ["hot_desk", "meeting_room"] - áp dụng cho space nào
  
  // Meta
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### AcceptanceLog (Tracking E-Contract & T&C Acceptance)
```typescript
interface AcceptanceLog {
  id: string;
  
  // What was accepted
  acceptanceType: 'contract' | 'terms_and_conditions';
  contractId?: string;          // FK to Contract (if type = 'contract')
  termsId?: string;             // FK to TermsAndConditions
  termsVersion: string;         // Version accepted
  bookingId?: string;           // FK to Booking (for T&C acceptance)
  
  // Who accepted
  customerId: string;           // FK to Customer
  
  // When & Where
  acceptedAt: Date;             // Timestamp
  acceptedByIp: string;         // IP address
  userAgent: string;            // Browser/device info
  
  // Evidence
  checkboxText: string;         // Text customer saw (e.g., "I agree to Terms & Conditions")
  acceptanceMethod: 'web_portal' | 'mobile_app' | 'api';  // Where it happened
  
  // Meta
  createdAt: Date;
}
```

### ContractItem (Optional - if need detailed breakdown)
```typescript
interface ContractItem {
  id: string;
  contractId: string;
  itemType: 'space_rental' | 'service_package' | 'addon';
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
```

## User Stories

### US-34: Tạo hợp đồng
> Là **Manager**, tôi muốn **tạo hợp đồng cho customer** để **formalize relationship**

**Acceptance Criteria**:
- [ ] Chọn customer, building
- [ ] Chọn space (Dedicated Desk / Private Office cụ thể)
- [ ] Chọn contract template (từ list active templates)
- [ ] System auto-fill placeholders: {{customerName}}, {{buildingName}}, {{spaceName}}, etc.
- [ ] Set start date, duration (months) → auto-calculate end date
- [ ] Nhập monthly fee, deposit, setup fee → {{monthlyFee}}, {{deposit}} replaced
- [ ] System calculate total value → {{totalValue}} replaced
- [ ] Preview generated content (HTML/PDF)
- [ ] Edit custom notes nếu cần (optional modifications)
- [ ] Set auto-renewal option
- [ ] Save as "draft" status

### US-35: Quản lý mẫu hợp đồng (Contract Template Management)
> Là **Admin**, tôi muốn **tạo và quản lý mẫu hợp đồng** để **standardize contracts**

**Acceptance Criteria**:
- [ ] CRUD contract templates
- [ ] Nhập template content với placeholders: {{customerName}}, {{monthlyFee}}, {{buildingName}}, {{spaceName}}...
- [ ] Define placeholder list với description (e.g., "{{monthlyFee}}: Giá thuê hàng tháng")
- [ ] Section-based editing: Header, Parties, Service, Pricing, Rules, Liability, Termination, Signature
- [ ] Rich text editor (HTML/Markdown support)
- [ ] Preview template với sample data
- [ ] Version control: Create new version khi update major changes
- [ ] Mark template as active/inactive
- [ ] Set effective date

### US-35A: Apply template to contract
> Là **Manager**, tôi muốn **áp dụng template vào contract** để **generate content nhanh**

**Acceptance Criteria**:
- [ ] Chọn template khi tạo contract
- [ ] System collect data: customer info, building info, pricing data
- [ ] Replace all placeholders:
  - {{contractCode}} → "CTR-20260416-001"
  - {{customerName}} → "Nguyễn Văn A"
  - {{monthlyFee}} → "8,000,000"
  - {{buildingName}} → "Cobi Building 1"
  - etc.
- [ ] Generate full contract content (generatedContent field)
- [ ] Allow preview before save
- [ ] Allow manual edits in customNotes (không affect template)
- [ ] Save templateId + templateVersion cho audit trail

### US-36: Track contract lifecycle
> Là **Manager**, tôi muốn **theo dõi contracts** để **biết contracts nào expiring soon**

**Acceptance Criteria**:
- [ ] List contracts với filter by status
- [ ] Alert khi contract < 30 ngày hết hạn
- [ ] Manually terminate contract (nhập reason)
- [ ] Auto-update status daily (cronjob)

### US-37: Auto-renewal
> Là **System**, tôi muốn **auto-renew contracts** để **không mất customers**

**Acceptance Criteria**:
- [ ] Check auto-renewal flag
- [ ] X days trước endDate, send notification đến customer
- [ ] Nếu customer agree → create new contract với same terms
- [ ] Old contract status → "renewed", new contract status → "active"

### US-37A: E-Contract acceptance
> Là **Customer**, tôi muốn **accept Terms & Conditions khi booking** để **hoàn tất đặt chỗ hợp lệ**

**Acceptance Criteria**:
- [ ] Khi customer confirm booking (short-term), hiển thị T&C checkbox
- [ ] Checkbox text: "Tôi đã đọc và đồng ý với [Điều khoản sử dụng](#)"
- [ ] Click link → mở modal/page hiển thị full T&C content
- [ ] Nếu không tick → không cho phép submit booking
- [ ] Khi submit → log acceptance: timestamp, IP, user agent, termsVersion
- [ ] Save AcceptanceLog record linkto booking

### US-37B: Quản lý mẫu Terms & Conditions
> Là **Admin**, tôi muốn **tạo và quản lý mẫu T&C** để **standardize và update quy định**

**Acceptance Criteria**:
- [ ] CRUD Terms & Conditions templates
- [ ] Chọn code identifier (e.g., "TC-HOTDESK", "TC-MEETINGROOM")
- [ ] Nhập template content với placeholders: {{spaceType}}, {{operatingHours}}, {{cancelHours}}...
- [ ] Define sections: Usage Rules, Liability, Privacy Policy, Cancellation Policy
- [ ] Rich text editor (HTML/Markdown)
- [ ] Define applicable space types (e.g., T&C này cho hot_desk, meeting_room)
- [ ] Placeholder list với description
- [ ] Set effective date, expiry date (optional)
- [ ] Version control (1.0 → 1.1 → 2.0)
- [ ] Only 1 active T&C per code/space type at a time
- [ ] Preview template với sample data
- [ ] View acceptance history: Which customers accepted which version

**Example Placeholders:**
- {{spaceType}} → "Hot Desk" / "Meeting Room"
- {{buildingName}} → "Cobi Building 1"
- {{operatingHours}} → "8:00 - 18:00"
- {{cancelHours}} → "24"
- {{refundPercent}} → "100" / "50"

## Scenarios

### Scenario 1: Tạo contract template
```
Given Admin đăng nhập
When Navigate to "Contract Templates" → "New Template"
And Name "Hợp đồng Dedicated Desk", Code "TPL-DEDICATED-DESK", version "1.0"
And Nhập content sections:
  - Header: "HỢP ĐỒNG THUÊ CHỖ NGỒI LÀM VIỆC\nSố: {{contractCode}}\nNgày ký: {{signedDate}}"
  - Party Lessor: "BÊN CHO THUÊ: Công ty {{companyName}}, MST: {{companyTaxCode}}..."
  - Party Lessee: "BÊN THUÊ: {{customerType}} {{customerName}}, CCCD: {{customerId}}..."
  - Service: "Dịch vụ: Thuê {{spaceType}} tại {{buildingName}}, thời gian {{duration}} tháng..."
  - Pricing: "Giá thuê: {{monthlyFee}} VND/tháng, đặt cọc {{deposit}} VND..."
And Define placeholders: [{{contractCode}}, {{customerName}}, {{monthlyFee}}, {{buildingName}}...]
And Mark as active, effective date "01/05/2026"
Then Template saved với code "TPL-DEDICATED-DESK"
And Có thể dùng khi tạo contract thuê Dedicated Desk / Private Office
```

### Scenario 2: Tạo contract từ template
```
Given Manager đăng nhập
When Create Contract cho Customer "CUS-0010" (Name: "Nguyễn Văn A", CCCD: "001234567890")
And Chọn Building "Cobi Building 1"
And Chọn Space "Dedicated Desk B-05" → System show available templates
And Chọn template "TPL-DEDICATED-DESK v1.0"
And Start date "01/05/2026", duration 6 months → End date "31/10/2026"
And Monthly fee 5,000,000 VND, deposit 5,000,000 VND
Then System generate content:
  - Replace {{contractCode}} → "CTR-20260416-001"
  - Replace {{customerName}} → "Nguyễn Văn A"
  - Replace {{customerId}} → "001234567890"
  - Replace {{monthlyFee}} → "5,000,000"
  - Replace {{buildingName}} → "Cobi Building 1"
  - Replace {{spaceName}} → "Dedicated Desk B-05"
  - Replace {{spaceType}} → "Dedicated Desk"
  - Replace {{duration}} → "6"
And Preview generated content
And Save as draft với templateId = "TPL-DEDICATED-DESK", templateVersion = "1.0"
```

### Scenario 3: Tạo Terms & Conditions template
```
Given Admin đăng nhập
When Navigate to "Terms & Conditions" → "New Template"
And Code "TC-HOTDESK", version "1.0"
And Title "Điều khoản sử dụng Hot Desk - Cobi Coworking Space"
And Applicable space types: ["hot_desk"]
And Content template:
  "ĐIỀU KHOẢN SỬ DỤNG {{spaceType}}
  
  1. QUY ĐỊNH SỬ DỤNG
  Khách hàng được sử dụng {{spaceType}} tại {{buildingName}} trong giờ {{operatingHours}}...
  
  4. CHÍNH SÁCH HỦY
  Hủy trước {{cancelHours}} giờ: Hoàn {{refundPercent}}% phí đã thanh toán..."
And Placeholders: [{{spaceType}}, {{buildingName}}, {{operatingHours}}, {{cancelHours}}, {{refundPercent}}]
And Mark as active, effective date "01/05/2026"
Then T&C template saved với code "TC-HOTDESK"
```

### Scenario 4: Customer accept T&C khi booking (apply template)
```
Given Customer "CUS-0001" tạo booking Hot Desk
When Chọn space "Hot Desk Zone A", date "20/04/2026", time 14:00-17:00
And Đến bước confirm → System load active T&C for "hot_desk" → "TC-HOTDESK v1.0"
And System fill placeholders:
  - {{spaceType}} → "Hot Desk"
  - {{buildingName}} → "Cobi Building 1"
  - {{operatingHours}} → "08:00 - 20:00"
  - {{cancelHours}} → "24"
  - {{refundPercent}} → "100"
And Display checkbox: "☑ Tôi đã đọc và đồng ý với [Điều khoản sử dụng](#)"
And Customer tick checkbox → click "Confirm Booking"
Then Create AcceptanceLog:
  - termsId = "TC-HOTDESK", termsVersion = "1.0"
  - acceptedAt = current timestamp
  - acceptedByIp = customer IP
  - checkboxText = "Tôi đã đọc và đồng ý với Điều khoản sử dụng"
And Booking.termsAccepted = true, termsVersion = "1.0"
```

### Scenario 5: Tạo contract Private Office
```
Given Manager đăng nhập
When Create Contract cho Customer "CUS-0010"
And Chọn Building "Cobi Building 1", Space "Private Office 201"
And Chọn template "TPL-PRIVATE-OFFICE v1.0"
And Start date "01/05/2026", duration 6 months → End date "31/10/2026"
And Monthly fee 8,000,000 VND, setup fee 1,000,000 VND
And Total value = 8M × 6 + 1M = 49,000,000 VND
And Enable auto-renewal, notice 30 days
Then Contract saved as "draft" với code "CTR-20260416-001"
```

### Scenario 5: Contract expiry alert
```
Given Contract "CTR-001" endDate = "30/04/2026"
When Cronjob chạy ngày "01/04/2026" (29 ngày trước expiry)
Then Status update → "expiring_soon"
And Email gửi đến customer "Your contract expires in 29 days"
And Notification cho Manager
```

### Scenario 6: Terminate contract sớm
```
Given Contract "CTR-005" active từ 01/01/2026 - 31/12/2026
When Manager click "Terminate Contract" vào 01/06/2026
And Nhập reason "Customer relocating"
Then Status → "terminated", terminatedAt = 01/06/2026
And Pro-rate refund calculation for kế toán
```

### Scenario 7: Update template version
```
Given Template "TPL-PRIVATE-OFFICE v1.0" đang active
When Admin update quy định mới (e.g., thêm clause về visitor policy)
And Create new version "TPL-PRIVATE-OFFICE v1.1"
And Set effective date "01/06/2026"
And Mark v1.1 as active
Then Old contracts (created with v1.0) → giữ nguyên templateVersion = "1.0"
And New contracts (from 01/06/2026) → dùng templateVersion = "1.1"
And System track: Which contracts use which template version (for audit)
```

## Phụ thuộc

**Phụ thuộc vào**:
- EP-01: Auth
- EP-03: Customer Management (contracts link to customers)

**Được sử dụng bởi**:
- EP-06: Payment & Invoicing (invoices based on contracts)
- EP-11: Dashboards (contract revenue tracking)

## Out of Scope Phase 1
- Digital signature (DocuSign integration)
- Contract versioning / amendments
- Multi-currency contracts

## Technical Notes

### Cronjobs
- **Daily status update**: Check contracts endDate, update status expiring_soon/expired
- **Auto-renewal**: 30 days before endDate, trigger renewal workflow

### Business Rules

**Template Management:**
- Có thể tạo nhiều templates cho các loại space khác nhau (e.g., "TPL-DEDICATED-DESK", "TPL-PRIVATE-OFFICE")
- Chỉ templates "active" mới được chọn khi tạo contract mới
- Contract lưu templateId + templateVersion → không bị ảnh hưởng khi template update
- Update template → tạo version mới, old contracts giữ nguyên old version
- Delete template: Chỉ cho phép nếu không có contract nào đang dùng

**Khi nào BẮT BUỘC có Formal Contract:**
- Thuê Dedicated Desk ≥ 1 tháng → Contract required
- Thuê Private Office bất kỳ thời gian → Contract required
- Doanh nghiệp (Company customer) thuê dài hạn → Contract required

**Khi nào chỉ cần Terms & Conditions:**
- Hot Desk theo giờ/ngày → T&C + AcceptanceLog
- Meeting Room theo giờ → T&C + AcceptanceLog
- Cá nhân booking ngắn hạn (<1 tháng) → T&C + AcceptanceLog
- Nạp Credit → Credit Terms of Service + AcceptanceLog

**Contract vs Booking:**
- 1 Contract có thể link đến nhiều Bookings (recurring)
- Booking ngắn hạn (no contract) → chỉ cần T&C acceptance
- Booking dài hạn (with contract) → cần cả Contract + Booking record

**Contract Operations:**
- Cannot delete contract if has linked invoices paid
- Termination: Calculate pro-rate refund
- Auto-renewal creates new contract, links old contract
- E-contract acceptance: Must log IP, timestamp, user agent (legal evidence)

**Terms & Conditions:**
- Always log acceptance for audit trail
- Keep old T&C versions for historical reference
- New version → update all new bookings, old bookings keep old version

## Ghi chú

**Phase 1 Implementation:**
- **Contract Templates**: CRUD templates với placeholders system
- **Placeholder Engine**: Replace {{key}} với actual data khi generate contract
- **Terms & Conditions Templates**: Version control + space type filtering
- Formal Contracts: Generate từ template → PDF export (manual signing Phase 1)
- E-Contract: Checkbox acceptance + log (for short-term bookings)
- AcceptanceLog: Track all T&C acceptances with IP + timestamp

**Phase 2 Enhancement:**
- Digital signature integration (DocuSign, VNPay eContract)
- Auto-email generated contracts to customers
- Advanced template editor (WYSIWYG, drag-drop sections)
- Conditional placeholders (if/else logic in templates)
- Multi-language templates (VN, EN, KR)
- SMS/Email notifications for contract expiry

**Template System - Common Placeholders:**

**Contract Templates:**
- {{contractCode}} - Mã hợp đồng
- {{signedDate}} - Ngày ký
- {{customerName}} - Tên khách hàng
- {{customerType}} - Cá nhân / Doanh nghiệp
- {{customerId}} - CCCD / MST
- {{customerAddress}} - Địa chỉ khách
- {{companyName}} - Tên công ty Cobi
- {{companyTaxCode}} - MST công ty
- {{buildingName}} - Tên tòa nhà
- {{buildingAddress}} - Địa chỉ tòa nhà
- {{spaceType}} - Loại chỗ (Dedicated Desk, Private Office...)
- {{spaceName}} - Tên cụ thể (e.g., "Private Office 201")
- {{duration}} - Số tháng thuê
- {{startDate}} - Ngày bắt đầu
- {{endDate}} - Ngày kết thúc
- {{monthlyFee}} - Giá thuê tháng
- {{setupFee}} - Phí setup
- {{deposit}} - Tiền đặt cọc
- {{totalValue}} - Tổng giá trị hợp đồng

**Terms & Conditions Templates:**
- {{spaceType}} - Hot Desk / Meeting Room
- {{buildingName}} - Cobi Building 1
- {{operatingHours}} - 08:00 - 20:00
- {{cancelHours}} - 24 (giờ)
- {{refundPercent}} - 100 / 50 (%)
- {{wifiSpeed}} - 100 Mbps
- {{parkingFee}} - 20,000 VND/day

**Credit Terms of Service Placeholders:**
- {{creditRate}} - Tỷ giá (1 credit = 1,000 VND)
- {{minTopup}} - Nạp tối thiểu (100,000 VND)
- {{creditExpiry}} - Thời hạn credit (12 tháng)
- {{refundPolicy}} - Credit không hoàn tiền

**Best Practice:**
- **Thuê dài hạn (Dedicated Desk/Private Office ≥1 tháng)** → Formal contract từ ContractTemplate
- **Booking ngắn hạn (Hot Desk, Meeting Room)** → T&C từ TermsAndConditions template + log
- **Nạp Credit** → Credit Terms of Service + AcceptanceLog
- **Lưu trữ**: Contract/Booking lưu templateId + templateVersion (audit trail)
- **Version control**: Mỗi lần sửa major → tạo version mới
- **Compliance**: Theo Bộ luật Dân sự 2015, thỏa thuận điện tử hợp lệ nếu có log đầy đủ

**Contract Content Structure (Theo thông lệ VN):**
1. Thông tin bên cho thuê (Cobi company info)
2. Thông tin bên thuê (Customer/Company)
3. Dịch vụ thuê (space type, duration, usage hours, amenities)
4. Giá trị hợp đồng (monthly fee, deposit, payment cycle, late fee)
5. Quy định sử dụng (không gây ồn, không phá hoại, guest policy)
6. Trách nhiệm & bồi thường (equipment damage, lost items)
7. Chấm dứt hợp đồng (termination conditions, refund policy)
8. Chữ ký & đóng dấu

**Technical Implementation Notes:**
- Template engine: Sử dụng regex replace hoặc template engine (Handlebars, Mustache)
- Rich text editor: Quill, TinyMCE, hoặc Markdown editor
- PDF generation: html2pdf, puppeteer (Phase 1: Manual export)
- Placeholder validation: Check tất cả placeholders đều được replace trước khi save
