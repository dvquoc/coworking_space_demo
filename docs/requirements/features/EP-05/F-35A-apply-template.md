# F-35A – Áp dụng mẫu vào hợp đồng (Apply Template to Contract)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-35A |
| Epic | EP-05 - Contract Management |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Khi tạo hợp đồng (F-34), hệ thống tự động **điền placeholders từ template** với dữ liệu thực tế (customer info, pricing, dates, etc.) để generate nội dung hợp đồng hoàn chỉnh.

**Business Rationale:**
- **Automation**: Giảm effort soạn hợp đồng từ 30-60 phút xuống 5-10 phút
- **Consistency**: Đảm bảo format và nội dung nhất quán cho tất cả contracts
- **Error reduction**: Tránh lỗi chính tả, thiếu thông tin khi soạn thủ công
- **Traceability**: Lưu templateId + version để biết contract dùng template nào

**Placeholder Categories:**
1. **Contract Info**: Mã HĐ, ngày ký, thời hạn
2. **Lessor (Cobi)**: Thông tin công ty cho thuê
3. **Lessee (Customer)**: Thông tin khách hàng thuê
4. **Space & Building**: Thông tin tòa nhà, space
5. **Pricing**: Giá thuê, deposit, tổng giá trị
6. **Dates**: Ngày bắt đầu, kết thúc

**Business Rules:**
- Tất cả placeholders phải có data trước khi generate
- Missing placeholder → highlight warning, không block save
- Generated content stored trong contract, không re-generate khi template update
- Support format số tiền với separators (5,000,000 VND)
- Support format ngày theo locale VN (dd/MM/yyyy)

**Out of Scope:**
- Conditional placeholders (if/else) → Phase 2
- Computed placeholders (e.g., {{taxAmount}} = {{totalValue}} × 10%) → Phase 2
- Multiple languages → Phase 2

## User Story

> Là **Manager/Sale**, tôi muốn **hệ thống tự động điền thông tin vào mẫu hợp đồng** để **không phải nhập thủ công và tránh sai sót**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Template Selection & Data Collection

- [ ] **AC1**: Khi user chọn template trong create contract flow:
  - Load template content với tất cả placeholders
  - Identify required placeholders từ template
  - Collect data sources: Customer, Building, Space, Contract form

### Placeholder Data Sources

- [ ] **AC2**: Data sources cho từng placeholder category:

  **Contract Info (from form input):**
  | Placeholder | Source | Format |
  |-------------|--------|--------|
  | `{{contractCode}}` | Auto-generated | CTR-YYYYMMDD-XXX |
  | `{{signedDate}}` | Current date or input | dd/MM/yyyy |
  | `{{startDate}}` | Form: startDate | dd/MM/yyyy |
  | `{{endDate}}` | Calculated | dd/MM/yyyy |
  | `{{duration}}` | Form: durationMonths | Number |
  | `{{packageName}}` | Form: packageName | Text |

  **Lessor Info (from system config):**
  | Placeholder | Source | Example |
  |-------------|--------|---------|
  | `{{companyName}}` | System Config | Công ty TNHH Cobi |
  | `{{companyTaxCode}}` | System Config | 0123456789 |
  | `{{companyAddress}}` | System Config | 123 Nguyễn Huệ, Q1, HCM |
  | `{{companyRepName}}` | System Config | Nguyễn Văn A |
  | `{{companyRepTitle}}` | System Config | Giám đốc |
  | `{{companyPhone}}` | System Config | 1900-xxxx |
  | `{{companyEmail}}` | System Config | contact@cobi.vn |

  **Lessee Info (from selected Customer):**
  | Placeholder | Source | Example |
  |-------------|--------|---------|
  | `{{customerType}}` | Customer.customerType | Cá nhân / Doanh nghiệp |
  | `{{customerName}}` | Customer.fullName | Nguyễn Văn B |
  | `{{customerId}}` | Customer.nationalId / taxCode | 001234567890 |
  | `{{customerAddress}}` | Customer.address | 456 Lê Lai, Q1 |
  | `{{customerPhone}}` | Customer.phone | 0901234567 |
  | `{{customerEmail}}` | Customer.email | customer@email.com |
  | `{{contactPerson}}` | Customer.contactPersonName | Trần Văn C |
  | `{{contactTitle}}` | Customer.contactPersonTitle | Office Manager |

  **Space & Building (from selected Building/Space):**
  | Placeholder | Source | Example |
  |-------------|--------|---------|
  | `{{buildingName}}` | Building.name | Cobi Tower 1 |
  | `{{buildingAddress}}` | Building.address | 789 Điện Biên Phủ, Q3 |
  | `{{spaceType}}` | Space.spaceType | Dedicated Desk |
  | `{{spaceName}}` | Space.name | Zone B - Desk 15 |
  | `{{floorLabel}}` | Floor.label | Tầng 5 |
  | `{{operatingHours}}` | Building.operatingHours | 08:00 - 20:00 |

  **Pricing (from form input):**
  | Placeholder | Source | Format |
  |-------------|--------|--------|
  | `{{monthlyFee}}` | Form: monthlyFee | 5,000,000 |
  | `{{setupFee}}` | Form: setupFee | 1,000,000 |
  | `{{deposit}}` | Form: depositAmount | 5,000,000 |
  | `{{totalValue}}` | Calculated | 31,000,000 |
  | `{{monthlyFeeText}}` | Number to words | Năm triệu đồng |
  | `{{totalValueText}}` | Number to words | Ba mươi mốt triệu đồng |

### Generate Content

- [ ] **AC3**: Function `generateContractContent(template, data)`:
  ```
  Input: Template sections + Data object
  Process: Replace {{placeholder}} with actual values
  Output: Generated HTML content
  ```

- [ ] **AC4**: Handle missing placeholders:
  - Missing data → keep placeholder as-is (e.g., `{{customerId}}`)
  - Highlight missing placeholders in preview (yellow background)
  - Warning message: "Một số thông tin chưa được điền"

- [ ] **AC5**: Number formatting:
  - Currency: `5000000` → `5,000,000` VND
  - Add " VND" suffix for pricing fields

- [ ] **AC6**: Date formatting:
  - ISO date → `dd/MM/yyyy` (e.g., 2026-05-01 → 01/05/2026)

- [ ] **AC7**: Text case handling:
  - Customer type: `individual` → "Cá nhân", `company` → "Doanh nghiệp"
  - Space type: `dedicated_desk` → "Dedicated Desk"

### Preview Generated Content

- [ ] **AC8**: Preview screen trong create contract step 3:
  - Left panel: Template sections (original với placeholders highlighted)
  - Right panel: Generated content (actual values)

- [ ] **AC9**: Highlight differences:
  - Filled placeholders: Green text
  - Missing placeholders: Yellow background + red text

- [ ] **AC10**: Collapsible sections trong preview:
  - Header
  - Party Lessor (Bên cho thuê)
  - Party Lessee (Bên thuê)
  - Service (Dịch vụ)
  - Pricing (Giá cả)
  - Usage Rules (Quy định)
  - Liability (Trách nhiệm)
  - Termination (Chấm dứt)
  - Signature (Chữ ký)

### Store Generated Content

- [ ] **AC11**: Khi save contract:
  - Store `templateId` và `templateVersion`
  - Store `generatedContent` (full HTML)
  - Content is snapshot - không thay đổi khi template update

- [ ] **AC12**: Generated content có thể edit trong `customNotes` field
- [ ] **AC13**: Không re-generate content khi edit contract (trừ khi user explicitly request)

### Re-generate Content

- [ ] **AC14**: Button "Re-generate Content" trong edit contract (draft only):
  - Warning: "Nội dung hiện tại sẽ bị thay thế"
  - Re-apply template với current data

### PDF Generation

- [ ] **AC15**: Button "Generate PDF" từ generated content:
  - Render HTML → PDF
  - A4 format, margins appropriate
  - Company logo header
  - Page numbers footer

- [ ] **AC16**: PDF filename: `{contractCode}.pdf` (e.g., CTR-20260417-001.pdf)

## Dữ liệu / Fields

### Placeholder Data Object

```typescript
interface PlaceholderData {
  // Contract
  contractCode: string
  signedDate: string
  startDate: string
  endDate: string
  duration: number
  packageName?: string
  
  // Lessor (Cobi)
  companyName: string
  companyTaxCode: string
  companyAddress: string
  companyRepName: string
  companyRepTitle: string
  companyPhone: string
  companyEmail: string
  
  // Lessee (Customer)
  customerType: string
  customerName: string
  customerId: string
  customerAddress: string
  customerPhone: string
  customerEmail: string
  contactPerson?: string
  contactTitle?: string
  
  // Space & Building
  buildingName: string
  buildingAddress: string
  spaceType: string
  spaceName?: string
  floorLabel?: string
  operatingHours: string
  
  // Pricing
  monthlyFee: string           // formatted
  setupFee: string             // formatted
  deposit: string              // formatted
  totalValue: string           // formatted
  monthlyFeeText: string       // text form
  totalValueText: string       // text form
}
```

### Generated Content Storage

```typescript
interface ContractContent {
  templateId: string
  templateVersion: string
  generatedAt: string          // ISO timestamp
  sections: {
    header: string
    partyLessor: string
    partyLessee: string
    service: string
    pricing: string
    usageRules: string
    liability: string
    termination: string
    signature: string
  }
  fullContent: string          // Combined HTML
  missingPlaceholders: string[] // List of unfilled placeholders
}
```

## UI/UX Guidelines

### Preview - Side by Side View
```
┌─────────────────────────────────────────────────────────────────┐
│ Preview Contract Content                          [Generate PDF]│
├─────────────────────────────────────────────────────────────────┤
│ ⚠️ 2 placeholders chưa được điền: {{customerId}}, {{spaceName}}│
├────────────────────────────┬────────────────────────────────────┤
│ TEMPLATE                   │ GENERATED                          │
│                            │                                    │
│ ▼ Header                   │ ▼ Header                           │
│ ┌────────────────────────┐ │ ┌──────────────────────────────────┐│
│ │ HỢP ĐỒNG THUÊ CHỖ NGỒI│ │ │ HỢP ĐỒNG THUÊ CHỖ NGỒI            ││
│ │ Số: [{{contractCode}}] │ │ │ Số: CTR-20260417-001             ││
│ │ Ngày: [{{signedDate}}] │ │ │ Ngày: 17/04/2026                 ││
│ └────────────────────────┘ │ └──────────────────────────────────┘│
│                            │                                    │
│ ▼ Party Lessee             │ ▼ Party Lessee                     │
│ ┌────────────────────────┐ │ ┌──────────────────────────────────┐│
│ │ BÊN THUÊ (Bên B):      │ │ │ BÊN THUÊ (Bên B):                ││
│ │ [{{customerType}}]     │ │ │ Cá nhân                          ││
│ │ [{{customerName}}]     │ │ │ Nguyễn Văn An                    ││
│ │ CCCD: [{{customerId}}] │ │ │ CCCD: [{{customerId}}] ⚠️        ││
│ └────────────────────────┘ │ └──────────────────────────────────┘│
│                            │                                    │
│ Legend:                    │                                    │
│ 🟢 Filled  🟡 Missing      │                                    │
├────────────────────────────┴────────────────────────────────────┤
│                                          [← Back] [Save Draft]  │
└─────────────────────────────────────────────────────────────────┘
```

### Placeholder Fill Status
```
┌─────────────────────────────────────────────────────────────────┐
│ PLACEHOLDER STATUS                                              │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Contract Info (6/6 filled)                                   │
│    {{contractCode}} = CTR-20260417-001                          │
│    {{signedDate}} = 17/04/2026                                  │
│    ...                                                          │
│                                                                 │
│ ✅ Lessor Info (7/7 filled)                                     │
│    {{companyName}} = Công ty TNHH Cobi                          │
│    ...                                                          │
│                                                                 │
│ ⚠️ Lessee Info (5/7 filled)                                     │
│    {{customerName}} = Nguyễn Văn An                             │
│    ❌ {{customerId}} = [Not provided]                           │
│    ❌ {{customerAddress}} = [Not provided]                      │
│    ...                                                          │
│                                                                 │
│ ✅ Pricing (6/6 filled)                                         │
│    {{monthlyFee}} = 8,000,000 VND                               │
│    ...                                                          │
└─────────────────────────────────────────────────────────────────┘
```

## Scenarios

### Scenario 1: Generate content successfully
```
Given Manager đang tạo contract
And Selected template "TPL-DEDICATED-DESK v1.0"
And Selected customer "Nguyễn Văn An" (CUS-0001)
And Filled form: Building "Cobi Tower 1", Monthly 8M, Duration 6 months
When Click "Next" to preview step
Then System collects data from:
  - Customer record: name, phone, email, nationalId
  - Building record: name, address, operatingHours
  - Form input: startDate, duration, monthlyFee, deposit
  - System config: Company info
And Replace all placeholders in template
And Display preview with all values filled
And Show status: "✅ All 25 placeholders filled"
```

### Scenario 2: Missing placeholders warning
```
Given Customer "Nguyễn Văn An" không có nationalId trong profile
When Generate contract content
Then Placeholder {{customerId}} remains as-is
And Warning badge: "⚠️ 1 placeholder chưa được điền"
And {{customerId}} highlighted yellow in preview
And User can still save as draft
But Warning when try to activate: "Vui lòng điền CCCD/MST để hoàn tất hợp đồng"
```

### Scenario 3: Number formatting
```
Given monthlyFee = 8000000 (number)
When Generate content
Then {{monthlyFee}} = "8,000,000 VND" (formatted)
And {{monthlyFeeText}} = "Tám triệu đồng" (text)
And totalValue calculated = monthlyFee × 6 + setupFee = 49,000,000
And {{totalValue}} = "49,000,000 VND"
And {{totalValueText}} = "Bốn mươi chín triệu đồng"
```

### Scenario 4: Re-generate content
```
Given Contract "CTR-001" status = "draft"
And generatedContent already exists
When Manager edit contract và thay đổi monthlyFee: 8M → 10M
And Click "Re-generate Content"
Then Warning: "Nội dung hiện tại sẽ bị thay thế. Tiếp tục?"
And Manager confirm
Then Content re-generated với new monthlyFee = 10,000,000
And totalValue recalculated = 61,000,000
And generatedAt updated to current timestamp
```

## Phụ thuộc

**Phụ thuộc vào:**
- F-35: Contract Templates (source templates)
- EP-03: Customer Management (customer data)
- EP-02: Property Management (building/space data)
- System Config: Company info

**Được sử dụng bởi:**
- F-34: Contract CRUD (generate content step)
- PDF Export feature

## Technical Notes

### Placeholder Replacement Engine

```typescript
interface PlaceholderEngine {
  /**
   * Replace all placeholders in template with actual data
   */
  generate(template: string, data: PlaceholderData): GenerateResult;
  
  /**
   * Validate that all required placeholders have data
   */
  validate(template: string, data: PlaceholderData): ValidationResult;
  
  /**
   * Extract all placeholders from template
   */
  extractPlaceholders(template: string): string[];
}

function generateContractContent(
  template: ContractTemplate,
  data: PlaceholderData
): ContractContent {
  const engine = new PlaceholderEngine();
  
  // Extract placeholders từ tất cả sections
  const allPlaceholders = [
    ...engine.extractPlaceholders(template.headerTemplate),
    ...engine.extractPlaceholders(template.partyLessorTemplate),
    ...engine.extractPlaceholders(template.partyLesseeTemplate),
    // ... other sections
  ];
  
  // Validate data
  const validation = engine.validate(allPlaceholders, data);
  
  // Generate each section
  const sections = {
    header: engine.generate(template.headerTemplate, data),
    partyLessor: engine.generate(template.partyLessorTemplate, data),
    partyLessee: engine.generate(template.partyLesseeTemplate, data),
    service: engine.generate(template.serviceTemplate, data),
    pricing: engine.generate(template.pricingTemplate, data),
    usageRules: engine.generate(template.usageRulesTemplate, data),
    liability: engine.generate(template.liabilityTemplate, data),
    termination: engine.generate(template.terminationTemplate, data),
    signature: engine.generate(template.signatureTemplate, data),
  };
  
  return {
    templateId: template.id,
    templateVersion: template.version,
    generatedAt: new Date().toISOString(),
    sections,
    fullContent: Object.values(sections).join('\n\n'),
    missingPlaceholders: validation.missing,
  };
}
```

### Number to Vietnamese Text

```typescript
function numberToVietnameseText(num: number): string {
  // 8000000 → "Tám triệu đồng"
  // 49000000 → "Bốn mươi chín triệu đồng"
  // Implementation using vietnamese number words
}
```

### Format Helpers

```typescript
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
}

function formatDate(isoDate: string): string {
  return format(parseISO(isoDate), 'dd/MM/yyyy');
}

function formatSpaceType(type: string): string {
  const map: Record<string, string> = {
    'hot_desk': 'Hot Desk',
    'dedicated_desk': 'Dedicated Desk',
    'private_office': 'Private Office',
    'meeting_room': 'Phòng họp',
  };
  return map[type] || type;
}

function formatCustomerType(type: string): string {
  return type === 'individual' ? 'Cá nhân' : 'Doanh nghiệp';
}
```
