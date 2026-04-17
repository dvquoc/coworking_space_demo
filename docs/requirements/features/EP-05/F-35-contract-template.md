# F-35 – Quản lý mẫu hợp đồng (Contract Template Management)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-35 |
| Epic | EP-05 - Contract Management |
| Độ ưu tiên | Must have ⭐ CRITICAL |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép **Admin** tạo và quản lý các mẫu hợp đồng (Contract Templates) với hệ thống **placeholders** để tự động điền thông tin khi tạo hợp đồng thực tế.

**Business Rationale:**
- **Standardization**: Đảm bảo tất cả hợp đồng tuân theo format chuẩn
- **Efficiency**: Giảm thời gian soạn hợp đồng từ 30-60 phút xuống 5-10 phút
- **Compliance**: Đảm bảo các điều khoản pháp lý được bao gồm đầy đủ
- **Version control**: Theo dõi các thay đổi trong mẫu hợp đồng qua các version
- **Audit trail**: Biết contract nào dùng template version nào

> **Note**: Templates được dùng cho các Formal Contracts (Dedicated Desk, Private Office). Hot Desk và Meeting Room sử dụng Terms & Conditions (F-36).

**Template Structure (Sections):**
1. **Header**: Tiêu đề, số hợp đồng, ngày ký
2. **Party Lessor**: Thông tin bên cho thuê (Cobi)
3. **Party Lessee**: Thông tin bên thuê (khách hàng)
4. **Service**: Dịch vụ thuê (loại chỗ, thời gian, quyền lợi)
5. **Pricing**: Giá thuê, đặt cọc, phương thức thanh toán
6. **Usage Rules**: Quy định sử dụng
7. **Liability**: Trách nhiệm và bồi thường
8. **Termination**: Điều khoản chấm dứt
9. **Signature**: Chữ ký các bên

**Business Rules:**
- Template code phải unique (ví dụ: `TPL-DEDICATED-DESK`)
- Chỉ templates có status `active` mới được chọn khi tạo contract mới
- Khi update template với thay đổi lớn → phải tạo version mới
- Old contracts giữ nguyên templateVersion đã sử dụng
- Không thể xóa template nếu có contract đang sử dụng

**Out of Scope:**
- WYSIWYG drag-drop template editor → Phase 2
- Multi-language templates (VN, EN, KR) → Phase 2
- Conditional placeholders (if/else logic) → Phase 2
- Import template từ Word/PDF → Phase 2

## User Story

> Là **Admin**, tôi muốn **tạo và quản lý các mẫu hợp đồng với placeholders** để **standardize việc tạo hợp đồng và đảm bảo tính nhất quán**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Access Control & Navigation

- [ ] **AC1**: Route `/contracts/templates` accessible cho role: `admin`
- [ ] **AC2**: Menu sidebar hiển thị "Contract Templates" trong section "Contracts"
- [ ] **AC3**: Chỉ Admin có quyền CRUD templates, Manager có quyền View

### Template List Page

- [ ] **AC4**: Hiển thị danh sách templates với columns:
  | Column | Description |
  |--------|-------------|
  | Code | Template code (e.g., TPL-DEDICATED-DESK) |
  | Name | Tên template |
  | Version | Current version (1.0, 1.1, 2.0) |
  | Status | Active / Inactive badge |
  | Effective Date | Ngày có hiệu lực |
  | Actions | View, Edit, Duplicate, Deactivate |

- [ ] **AC5**: Filter by: Status (active/inactive)
- [ ] **AC6**: Search by: Template code, name
- [ ] **AC7**: Sort by: Name, Created Date, Effective Date
- [ ] **AC8**: Badge màu: Active = green, Inactive = gray

### Create Template

- [ ] **AC9**: Button "Create Template" → navigate to `/contracts/templates/create`
- [ ] **AC10**: Form fields - Basic Info:
  | Field | Label | Type | Required | Validation |
  |-------|-------|------|----------|------------|
  | code | Mã template | Text | ✅ | Unique, format: TPL-XXX |
  | name | Tên template | Text | ✅ | Max 100 chars |
  | description | Mô tả | Textarea | ❌ | Max 500 chars |

  | version | Version | Text | ✅ | Format: x.x (e.g., 1.0) |
  | effectiveDate | Ngày hiệu lực | Date | ✅ | >= today |
  | isActive | Kích hoạt | Toggle | ✅ | Default: true |

### Template Content Sections

- [ ] **AC11**: Rich text editor cho mỗi section với toolbar: Bold, Italic, Underline, Lists, Headings
- [ ] **AC12**: Template sections:
  | Section | Field Name | Description |
  |---------|------------|-------------|
  | Header | headerTemplate | Tiêu đề, số HĐ: `{{contractCode}}`, ngày ký: `{{signedDate}}` |
  | Lessor | partyLessorTemplate | Bên cho thuê: `{{companyName}}`, MST: `{{companyTaxCode}}` |
  | Lessee | partyLesseeTemplate | Bên thuê: `{{customerName}}`, CCCD: `{{customerId}}` |
  | Service | serviceTemplate | Dịch vụ: `{{spaceType}}` tại `{{buildingName}}`, `{{duration}}` tháng |
  | Pricing | pricingTemplate | Giá: `{{monthlyFee}}` VND/tháng, đặt cọc: `{{deposit}}` |
  | Usage Rules | usageRulesTemplate | Quy định sử dụng (thường là standard text) |
  | Liability | liabilityTemplate | Trách nhiệm bồi thường |
  | Termination | terminationTemplate | Điều khoản chấm dứt |
  | Signature | signatureTemplate | Chữ ký các bên |

- [ ] **AC13**: Mỗi section có button "Insert Placeholder" → dropdown list placeholders

### Placeholder Management

- [ ] **AC14**: System cung cấp danh sách standard placeholders:

  **Contract Info:**
  | Placeholder | Description | Example |
  |-------------|-------------|---------|
  | `{{contractCode}}` | Mã hợp đồng | CTR-20260417-001 |
  | `{{signedDate}}` | Ngày ký | 17/04/2026 |
  | `{{startDate}}` | Ngày bắt đầu | 01/05/2026 |
  | `{{endDate}}` | Ngày kết thúc | 31/10/2026 |
  | `{{duration}}` | Thời hạn (tháng) | 6 |

  **Lessor (Cobi) Info:**
  | Placeholder | Description | Example |
  |-------------|-------------|---------|
  | `{{companyName}}` | Tên công ty Cobi | Công ty TNHH Cobi |
  | `{{companyTaxCode}}` | MST công ty | 0123456789 |
  | `{{companyAddress}}` | Địa chỉ công ty | 123 Nguyễn Huệ, Q1, HCM |
  | `{{companyRepName}}` | Người đại diện | Nguyễn Văn A |
  | `{{companyRepTitle}}` | Chức vụ đại diện | Giám đốc |

  **Lessee (Customer) Info:**
  | Placeholder | Description | Example |
  |-------------|-------------|---------|
  | `{{customerType}}` | Loại KH | Cá nhân / Doanh nghiệp |
  | `{{customerName}}` | Tên khách hàng | Nguyễn Văn B |
  | `{{customerId}}` | CCCD/MST | 001234567890 |
  | `{{customerAddress}}` | Địa chỉ KH | 456 Lê Lai, Q1, HCM |
  | `{{customerPhone}}` | SĐT KH | 0901234567 |
  | `{{customerEmail}}` | Email KH | customer@email.com |

  **Space & Building:**
  | Placeholder | Description | Example |
  |-------------|-------------|---------|
  | `{{buildingName}}` | Tên tòa nhà | Cobi Tower 1 |
  | `{{buildingAddress}}` | Địa chỉ tòa nhà | 789 Điện Biên Phủ, Q3 |
  | `{{spaceType}}` | Loại chỗ | Dedicated Desk / Private Office |
  | `{{spaceName}}` | Tên space cụ thể | Zone B - Desk 15 |
  | `{{floorLabel}}` | Tầng | Tầng 5 |

  **Pricing:**
  | Placeholder | Description | Example |
  |-------------|-------------|---------|
  | `{{monthlyFee}}` | Giá thuê/tháng | 5,000,000 |
  | `{{setupFee}}` | Phí setup | 1,000,000 |
  | `{{deposit}}` | Tiền đặt cọc | 5,000,000 |
  | `{{totalValue}}` | Tổng giá trị HĐ | 31,000,000 |

- [ ] **AC15**: Hiển thị placeholder list panel bên phải editor
- [ ] **AC16**: Click placeholder → copy vào clipboard hoặc insert vào editor position

### Preview Template

- [ ] **AC17**: Button "Preview" → mở modal hiển thị template với sample data
- [ ] **AC18**: Sample data được fill vào placeholders để preview
- [ ] **AC19**: Preview hỗ trợ Print view (A4 format)

### Version Control

- [ ] **AC20**: Khi edit template đã có contracts sử dụng → warning message
- [ ] **AC21**: Option "Create New Version" → tạo version mới (1.0 → 1.1 → 2.0)
- [ ] **AC22**: Old contracts giữ nguyên old version
- [ ] **AC23**: Version history: Xem list các versions của template
- [ ] **AC24**: Compare versions: So sánh 2 versions side by side

### Template Status Management

- [ ] **AC25**: Toggle Active/Inactive trên list page
- [ ] **AC26**: Deactivate template → không hiển thị khi tạo contract mới
- [ ] **AC27**: Không thể deactivate nếu không còn template active nào

### Duplicate Template

- [ ] **AC28**: Action "Duplicate" → tạo bản copy với code mới
- [ ] **AC29**: New template có version = 1.0, status = inactive (draft)

### Delete Template

- [ ] **AC30**: Chỉ có thể delete template nếu:
  - Không có contract nào đang sử dụng
  - Status = inactive
- [ ] **AC31**: Confirm dialog trước khi delete
- [ ] **AC32**: Nếu có contracts → hiển thị warning, không cho delete

### Save & Validation

- [ ] **AC33**: Validate tất cả required fields trước khi save
- [ ] **AC34**: Validate template code unique
- [ ] **AC35**: Validate placeholders syntax (đúng format `{{xxx}}`)
- [ ] **AC36**: Auto-save draft mỗi 30 giây
- [ ] **AC37**: Button "Save" → save và redirect to list
- [ ] **AC38**: Button "Save & Continue Editing" → save và ở lại trang edit
- [ ] **AC39**: Success toast: "Template đã được lưu"

## Dữ liệu / Fields

### ContractTemplate Entity

```typescript
interface ContractTemplate {
  id: string
  code: string                      // "TPL-MEMBERSHIP-GOLD"
  name: string                      // "Hợp đồng Membership Gold"
  description?: string
  
  // Type
  contractType: 'membership' | 'dedicated_space' | 'meeting_room_package'
  
  // Template Content (với placeholders)
  headerTemplate: string
  partyLessorTemplate: string
  partyLesseeTemplate: string
  serviceTemplate: string
  pricingTemplate: string
  usageRulesTemplate: string
  liabilityTemplate: string
  terminationTemplate: string
  signatureTemplate: string
  
  // Placeholders Reference
  placeholders: string[]            // ["{{contractCode}}", "{{customerName}}", ...]
  
  // Version & Status
  version: string                   // "1.0", "1.1", "2.0"
  isActive: boolean
  effectiveDate: string             // ISO date
  
  // Audit
  usageCount: number                // Number of contracts using this template
  createdBy: string
  createdAt: string
  updatedAt: string
}
```

### Standard Placeholders Config

```typescript
const STANDARD_PLACEHOLDERS = {
  contract: [
    { key: '{{contractCode}}', label: 'Mã hợp đồng', example: 'CTR-20260417-001' },
    { key: '{{signedDate}}', label: 'Ngày ký', example: '17/04/2026' },
    { key: '{{startDate}}', label: 'Ngày bắt đầu', example: '01/05/2026' },
    { key: '{{endDate}}', label: 'Ngày kết thúc', example: '31/10/2026' },
    { key: '{{duration}}', label: 'Thời hạn (tháng)', example: '6' },
  ],
  lessor: [
    { key: '{{companyName}}', label: 'Tên công ty Cobi', example: 'Công ty TNHH Cobi' },
    { key: '{{companyTaxCode}}', label: 'MST công ty', example: '0123456789' },
    // ...
  ],
  lessee: [
    { key: '{{customerType}}', label: 'Loại KH', example: 'Cá nhân' },
    { key: '{{customerName}}', label: 'Tên khách hàng', example: 'Nguyễn Văn B' },
    // ...
  ],
  space: [
    { key: '{{buildingName}}', label: 'Tên tòa nhà', example: 'Cobi Tower 1' },
    { key: '{{spaceType}}', label: 'Loại chỗ', example: 'Dedicated Desk' },
    // ...
  ],
  pricing: [
    { key: '{{monthlyFee}}', label: 'Giá thuê/tháng', example: '5,000,000' },
    { key: '{{deposit}}', label: 'Tiền đặt cọc', example: '5,000,000' },
    // ...
  ],
}
```

## UI/UX Guidelines

### Template List Page
```
┌─────────────────────────────────────────────────────────────────┐
│ Contract Templates                          [Create Template]   │
├─────────────────────────────────────────────────────────────────┤
│ Filters: [Contract Type ▼] [Status ▼]    Search: [___________] │
├─────────────────────────────────────────────────────────────────┤
│ Code           │ Name                │ Type      │ Ver │ Status │
│────────────────┼─────────────────────┼───────────┼─────┼────────│
│ TPL-MEMB-GOLD  │ HĐ Membership Gold  │ membership│ 1.0 │ 🟢 Active│
│ TPL-MEMB-PLAT  │ HĐ Membership Plat  │ membership│ 1.1 │ 🟢 Active│
│ TPL-DESK-STD   │ HĐ Dedicated Desk   │ dedicated │ 2.0 │ 🔘 Inactive│
└─────────────────────────────────────────────────────────────────┘
```

### Template Editor Page
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back  │  Edit Template: TPL-MEMBERSHIP-GOLD        [Preview] │
├─────────────────────────────────────────────────────────────────┤
│ BASIC INFO                                                      │
│ Code: [TPL-MEMBERSHIP-GOLD]  Name: [Hợp đồng Membership Gold]   │
│ Type: [membership ▼]         Version: [1.0]                     │
│ Effective: [01/05/2026]      Status: [🟢 Active]                │
├─────────────────────────────────────────────────────────────────┤
│ TEMPLATE CONTENT                           │ PLACEHOLDERS       │
│                                            │                    │
│ Section: [Header ▼]                        │ 📋 Contract Info   │
│ ┌────────────────────────────────────────┐ │ {{contractCode}}   │
│ │ HỢP ĐỒNG MEMBERSHIP                    │ │ {{signedDate}}     │
│ │ Số: {{contractCode}}                   │ │ {{startDate}}      │
│ │ Ngày ký: {{signedDate}}                │ │ ...                │
│ └────────────────────────────────────────┘ │                    │
│                                            │ 📋 Customer Info   │
│ Section: [Party Lessor ▼]                  │ {{customerName}}   │
│ ┌────────────────────────────────────────┐ │ {{customerId}}     │
│ │ BÊN CHO THUÊ (Bên A):                  │ │ ...                │
│ │ {{companyName}}, MST: {{companyTaxCode}}│ │                    │
│ └────────────────────────────────────────┘ │ 📋 Pricing         │
│                                            │ {{monthlyFee}}     │
│ [Save] [Save & Continue] [Cancel]          │ {{deposit}}        │
└─────────────────────────────────────────────────────────────────┘
```

## Scenarios

### Scenario 1: Tạo template mới
```
Given Admin đăng nhập
When Navigate to "Contract Templates" → Click "Create Template"
And Nhập:
  - Code: "TPL-DEDICATED-DESK"
  - Name: "Hợp đồng Dedicated Desk"
  - Type: "dedicated_space"
  - Version: "1.0"
  - Effective Date: "01/05/2026"
And Nhập content cho mỗi section:
  - Header: "HỢP ĐỒNG THUÊ CHỖ NGỒI\nSố: {{contractCode}}\nNgày: {{signedDate}}"
  - Party Lessor: "BÊN CHO THUÊ: {{companyName}}, MST: {{companyTaxCode}}..."
  - Party Lessee: "BÊN THUÊ: {{customerName}}, CCCD/MST: {{customerId}}..."
  - Service: "Thuê {{spaceType}} tại {{buildingName}}, thời hạn {{duration}} tháng..."
  - Pricing: "Giá thuê: {{monthlyFee}} VND/tháng, đặt cọc: {{deposit}} VND..."
And Click "Preview" → verify sample data fills correctly
And Click "Save"
Then Template saved, redirect to list
And Toast: "Template đã được lưu"
```

### Scenario 2: Update template - tạo version mới
```
Given Template "TPL-MEMBERSHIP-GOLD v1.0" đang được sử dụng bởi 5 contracts
When Admin edit template, thêm clause mới trong Usage Rules
And System warning: "Template này đang được sử dụng bởi 5 hợp đồng"
And Admin chọn "Create New Version"
And System tự động version = "1.1"
And Admin save
Then New version "1.1" được tạo, set effectiveDate từ ngày hôm nay
And Old contracts vẫn giữ templateVersion = "1.0"
And New contracts sẽ dùng "1.1"
```

### Scenario 3: Không thể xóa template đang dùng
```
Given Template "TPL-DEDICATED-DESK v1.0" có 3 contracts đang sử dụng
When Admin click "Delete" trên template
Then System hiển thị warning: "Không thể xóa template đang được sử dụng bởi 3 hợp đồng"
And Delete button disabled
And Suggest: "Hãy deactivate template thay vì xóa"
```

## Phụ thuộc

**Phụ thuộc vào:**
- EP-01: Auth (role-based access)

**Được sử dụng bởi:**
- F-34: Contract CRUD (chọn template khi tạo contract)
- F-35A: Apply Template (generate content từ template)

## Technical Notes

### API Endpoints

```
GET    /api/contract-templates           # List templates
GET    /api/contract-templates/:id       # Get template by ID
POST   /api/contract-templates           # Create template
PUT    /api/contract-templates/:id       # Update template
DELETE /api/contract-templates/:id       # Delete template (if no usage)
POST   /api/contract-templates/:id/duplicate  # Duplicate template
GET    /api/contract-templates/:id/versions   # Get version history
```

### Placeholder Engine

```typescript
function replacePlaceholders(template: string, data: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match; // Return original if no data
  });
}
```

### Rich Text Editor

- Recommend: TipTap hoặc React-Quill
- Features: Bold, Italic, Underline, Lists, Headings (H1-H3), Tables
- Output format: HTML (lưu trong DB, render khi preview/export)
