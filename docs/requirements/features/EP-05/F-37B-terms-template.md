# F-37B – Quản lý mẫu Điều khoản sử dụng (Terms & Conditions Template Management)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-37B |
| Epic | EP-05 - Contract Management |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép **Admin** tạo và quản lý các mẫu **Terms & Conditions (T&C)** - Điều khoản sử dụng cho các booking ngắn hạn (Hot Desk, Meeting Room theo giờ). Khách hàng phải đồng ý với T&C trước khi hoàn tất booking.

**Business Rationale:**
- **Legal compliance**: Đảm bảo khách hàng đồng ý với quy định trước khi sử dụng dịch vụ
- **Risk mitigation**: Bảo vệ doanh nghiệp khỏi tranh chấp pháp lý
- **Transparency**: Khách hàng rõ ràng về quyền và nghĩa vụ
- **Version control**: Theo dõi T&C versions, biết khách đồng ý version nào
- **Flexibility**: Mỗi loại space có thể có T&C riêng

**T&C áp dụng cho:**
- Hot Desk (theo giờ/ngày)
- Meeting Room (theo giờ)
- Event Space (theo buổi)
- Các booking ngắn hạn không cần formal contract

**T&C Structure (Sections):**
1. **Header**: Tiêu đề, phạm vi áp dụng
2. **Usage Rules**: Quy định sử dụng space
3. **Liability**: Trách nhiệm của khách hàng
4. **Privacy Policy**: Chính sách bảo mật
5. **Cancellation Policy**: Chính sách hủy/hoàn tiền

**Business Rules:**
- T&C code phải unique (ví dụ: `TC-HOTDESK`, `TC-MEETINGROOM`)
- Chỉ 1 T&C active cho mỗi space type tại một thời điểm
- T&C có version control (1.0 → 1.1 → 2.0)
- Khi khách accept T&C → log version đã accept
- Old T&C versions được lưu trữ để tham chiếu pháp lý
- T&C có placeholders để điền thông tin dynamic (building name, operating hours, etc.)

**Out of Scope:**
- Multi-language T&C (VN, EN, KR) → Phase 2
- Customer-specific T&C modifications → Phase 2
- Digital signature on T&C → Phase 2

## User Story

> Là **Admin**, tôi muốn **tạo và quản lý các mẫu Terms & Conditions** để **standardize quy định sử dụng và đảm bảo compliance pháp lý**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Access Control & Navigation

- [ ] **AC1**: Route `/contracts/terms` accessible cho role: `admin`
- [ ] **AC2**: Menu sidebar: "Terms & Conditions" trong section "Contracts"
- [ ] **AC3**: Admin có quyền CRUD, Manager/Sale có quyền View

### T&C List Page

- [ ] **AC4**: Hiển thị danh sách T&C templates với columns:
  | Column | Description |
  |--------|-------------|
  | Code | T&C code (e.g., TC-HOTDESK) |
  | Title | Tiêu đề T&C |
  | Applicable To | Space types áp dụng |
  | Version | Current version |
  | Status | Active / Inactive |
  | Effective Date | Ngày hiệu lực |
  | Acceptance Count | Số lượt đã accept |
  | Actions | View, Edit, Deactivate |

- [ ] **AC5**: Filter by: Space Type, Status (active/inactive)
- [ ] **AC6**: Search by: Code, Title
- [ ] **AC7**: Badge màu: Active = green, Inactive = gray

### Create T&C Template

- [ ] **AC8**: Button "Create T&C" → navigate to `/contracts/terms/create`
- [ ] **AC9**: Form fields - Basic Info:
  | Field | Label | Type | Required | Validation |
  |-------|-------|------|----------|------------|
  | code | Mã T&C | Text | ✅ | Unique, format: TC-XXX |
  | title | Tiêu đề | Text | ✅ | Max 200 chars |
  | version | Version | Text | ✅ | Format: x.x |
  | applicableSpaceTypes | Áp dụng cho | Multi-select | ✅ | hot_desk, meeting_room, event_space |
  | effectiveDate | Ngày hiệu lực | Date | ✅ | >= today |
  | expiryDate | Ngày hết hạn | Date | ❌ | > effectiveDate |
  | isActive | Kích hoạt | Toggle | ✅ | Default: false (draft) |

### T&C Content Sections

- [ ] **AC10**: Rich text editor cho mỗi section
- [ ] **AC11**: T&C sections:
  | Section | Field Name | Description |
  |---------|------------|-------------|
  | Header | headerTemplate | Tiêu đề: "Điều khoản sử dụng {{spaceType}}" |
  | Usage Rules | usageRulesTemplate | Quy định: giờ hoạt động, trang thiết bị, vệ sinh |
  | Liability | liabilityTemplate | Trách nhiệm: tài sản, thiệt hại |
  | Privacy | privacyPolicyTemplate | Bảo mật: camera, dữ liệu |
  | Cancellation | cancellationPolicyTemplate | Hủy: thời gian, hoàn tiền % |

### T&C Placeholders

- [ ] **AC12**: Standard placeholders cho T&C:

  **Space Info:**
  | Placeholder | Description | Example |
  |-------------|-------------|---------|
  | `{{spaceType}}` | Loại space | Hot Desk / Meeting Room |
  | `{{buildingName}}` | Tên tòa nhà | Cobi Tower 1 |
  | `{{buildingAddress}}` | Địa chỉ | 123 Nguyễn Huệ |
  | `{{operatingHours}}` | Giờ hoạt động | 08:00 - 20:00 |

  **Policy Info:**
  | Placeholder | Description | Example |
  |-------------|-------------|---------|
  | `{{cancelHours}}` | Số giờ trước để hủy miễn phí | 24 |
  | `{{refundPercent}}` | % hoàn tiền | 100 / 50 / 0 |
  | `{{lateCheckoutFee}}` | Phí trả muộn | 50,000 VND/giờ |
  | `{{damageDeposit}}` | Tiền cọc thiệt hại | 500,000 VND |

  **Company Info:**
  | Placeholder | Description | Example |
  |-------------|-------------|---------|
  | `{{companyName}}` | Tên công ty Cobi | Công ty TNHH Cobi |
  | `{{companyEmail}}` | Email liên hệ | support@cobi.vn |
  | `{{companyPhone}}` | Hotline | 1900-xxxx |

- [ ] **AC13**: Panel placeholders bên phải editor
- [ ] **AC14**: Click placeholder → insert vào editor

### Preview T&C

- [ ] **AC15**: Button "Preview" → modal hiển thị T&C với sample data
- [ ] **AC16**: Preview hiển thị đúng format sẽ hiện cho customer
- [ ] **AC17**: Checkbox preview: "☑ Tôi đã đọc và đồng ý với Điều khoản sử dụng"

### Version Control

- [ ] **AC18**: Khi edit T&C đã có acceptances → warning message
- [ ] **AC19**: Option "Create New Version" để tạo version mới
- [ ] **AC20**: Version history: List tất cả versions
- [ ] **AC21**: View acceptance history: Ai đã accept version nào, khi nào

### Active/Inactive Management

- [ ] **AC22**: Khi activate T&C mới cho 1 space type:
  - Nếu đã có T&C active khác cho space type đó → tự động deactivate T&C cũ
  - Confirm dialog: "T&C cũ sẽ bị deactivate. Tiếp tục?"
- [ ] **AC23**: Không thể deactivate nếu không có T&C active khác cho space type

### Acceptance History

- [ ] **AC24**: Tab "Acceptance History" trong T&C detail
- [ ] **AC25**: List acceptances với columns:
  | Column | Description |
  |--------|-------------|
  | Customer | Tên khách hàng |
  | Booking | Mã booking |
  | Accepted At | Thời gian accept |
  | IP Address | IP khi accept |
  | Device | Browser/Device info |

- [ ] **AC26**: Export acceptance history to CSV

### Save & Validation

- [ ] **AC27**: Validate required fields
- [ ] **AC28**: Validate code unique
- [ ] **AC29**: Validate placeholder syntax
- [ ] **AC30**: Auto-save draft mỗi 30 giây
- [ ] **AC31**: Success toast: "T&C đã được lưu"

## Dữ liệu / Fields

### TermsAndConditions Entity

```typescript
interface TermsAndConditions {
  id: string
  code: string                      // "TC-HOTDESK", "TC-MEETINGROOM"
  title: string                     // "Điều khoản sử dụng Hot Desk"
  version: string                   // "1.0", "1.1", "2.0"
  
  // Template Content (với placeholders)
  headerTemplate: string
  usageRulesTemplate: string
  liabilityTemplate: string
  privacyPolicyTemplate: string
  cancellationPolicyTemplate: string
  
  // Full content (optional - combined)
  contentTemplate: string           // Full T&C nếu không dùng sections
  
  // Placeholders Reference
  placeholders: string[]
  
  // Applicable Space Types
  applicableSpaceTypes: SpaceType[] // ['hot_desk', 'meeting_room']
  
  // Validity
  effectiveDate: string
  expiryDate?: string
  isActive: boolean
  
  // Stats
  acceptanceCount: number           // Number of acceptances
  
  // Audit
  createdBy: string
  createdAt: string
  updatedAt: string
}

type SpaceType = 'hot_desk' | 'meeting_room' | 'event_space' | 'phone_booth'
```

### T&C Placeholders Config

```typescript
const TC_PLACEHOLDERS = {
  space: [
    { key: '{{spaceType}}', label: 'Loại space', example: 'Hot Desk' },
    { key: '{{buildingName}}', label: 'Tên tòa nhà', example: 'Cobi Tower 1' },
    { key: '{{operatingHours}}', label: 'Giờ hoạt động', example: '08:00 - 20:00' },
  ],
  policy: [
    { key: '{{cancelHours}}', label: 'Giờ hủy miễn phí', example: '24' },
    { key: '{{refundPercent}}', label: '% hoàn tiền', example: '100' },
    { key: '{{lateCheckoutFee}}', label: 'Phí trả muộn', example: '50,000 VND/giờ' },
  ],
  company: [
    { key: '{{companyName}}', label: 'Tên công ty', example: 'Công ty TNHH Cobi' },
    { key: '{{companyEmail}}', label: 'Email hỗ trợ', example: 'support@cobi.vn' },
  ],
}
```

## UI/UX Guidelines

### T&C List Page
```
┌─────────────────────────────────────────────────────────────────┐
│ Terms & Conditions                               [Create T&C]   │
├─────────────────────────────────────────────────────────────────┤
│ Filters: [Space Type ▼] [Status ▼]    Search: [___________]    │
├─────────────────────────────────────────────────────────────────┤
│ Code         │ Title                │ Applies To │ Ver │ Status │
│──────────────┼──────────────────────┼────────────┼─────┼────────│
│ TC-HOTDESK   │ Điều khoản Hot Desk  │ Hot Desk   │ 1.2 │ 🟢 Active│
│ TC-MEETING   │ Điều khoản Meeting   │ Meeting Room│1.0 │ 🟢 Active│
│ TC-EVENT     │ Điều khoản Event     │ Event Space │1.0 │ 🔘 Draft │
└─────────────────────────────────────────────────────────────────┘
```

### T&C Editor Page
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back  │  Edit T&C: TC-HOTDESK                     [Preview]  │
├─────────────────────────────────────────────────────────────────┤
│ BASIC INFO                                                      │
│ Code: [TC-HOTDESK]        Title: [Điều khoản sử dụng Hot Desk]  │
│ Applies To: [☑ Hot Desk] [☐ Meeting Room]  Version: [1.2]       │
│ Effective: [01/05/2026]   Expiry: [___________]  [🔘 Active]    │
├─────────────────────────────────────────────────────────────────┤
│ CONTENT                                 │ PLACEHOLDERS          │
│                                         │                       │
│ Section: [Usage Rules ▼]                │ 📋 Space Info         │
│ ┌─────────────────────────────────────┐ │ {{spaceType}}         │
│ │ 1. QUY ĐỊNH SỬ DỤNG                 │ │ {{operatingHours}}    │
│ │                                     │ │ {{buildingName}}      │
│ │ Khách hàng được sử dụng             │ │                       │
│ │ {{spaceType}} tại {{buildingName}}  │ │ 📋 Policy             │
│ │ trong giờ {{operatingHours}}.       │ │ {{cancelHours}}       │
│ │                                     │ │ {{refundPercent}}     │
│ └─────────────────────────────────────┘ │                       │
│                                         │                       │
│ [Save] [Save & Continue] [Cancel]       │                       │
└─────────────────────────────────────────────────────────────────┘
```

### Customer View (Preview)
```
┌─────────────────────────────────────────────────────────────────┐
│                 ĐIỀU KHOẢN SỬ DỤNG HOT DESK                     │
│                    Cobi Coworking Space                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 1. QUY ĐỊNH SỬ DỤNG                                             │
│ Khách hàng được sử dụng Hot Desk tại Cobi Tower 1 trong giờ     │
│ 08:00 - 20:00. Vui lòng giữ gìn vệ sinh chung...               │
│                                                                 │
│ 2. TRÁCH NHIỆM                                                  │
│ Khách hàng chịu trách nhiệm về tài sản cá nhân...              │
│                                                                 │
│ 3. CHÍNH SÁCH BẢO MẬT                                           │
│ Camera giám sát được sử dụng tại khu vực chung...              │
│                                                                 │
│ 4. CHÍNH SÁCH HỦY                                               │
│ Hủy trước 24 giờ: Hoàn 100% phí đã thanh toán                  │
│ Hủy trong 24 giờ: Hoàn 50% phí đã thanh toán                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ ☑ Tôi đã đọc và đồng ý với Điều khoản sử dụng                  │
└─────────────────────────────────────────────────────────────────┘
```

## Scenarios

### Scenario 1: Tạo T&C template mới
```
Given Admin đăng nhập
When Navigate to "Terms & Conditions" → Click "Create T&C"
And Nhập:
  - Code: "TC-HOTDESK"
  - Title: "Điều khoản sử dụng Hot Desk - Cobi Coworking Space"
  - Version: "1.0"
  - Applicable: [hot_desk]
  - Effective Date: "01/05/2026"
And Nhập content cho mỗi section:
  - Usage Rules: "Khách hàng được sử dụng {{spaceType}} tại {{buildingName}} trong giờ {{operatingHours}}..."
  - Cancellation: "Hủy trước {{cancelHours}} giờ: Hoàn {{refundPercent}}% phí..."
And Click "Preview" → verify content renders correctly
And Click "Save"
Then T&C saved với status = inactive (draft)
And Toast: "T&C đã được lưu"
```

### Scenario 2: Activate T&C mới (replace old)
```
Given T&C "TC-HOTDESK v1.0" đang active cho hot_desk
And T&C "TC-HOTDESK v1.1" mới tạo, status = inactive
When Admin click "Activate" trên v1.1
Then Confirm dialog: "T&C v1.0 sẽ bị deactivate. Tiếp tục?"
And Admin confirm
Then v1.1 → active, v1.0 → inactive
And New bookings sẽ show T&C v1.1
And Old acceptances vẫn lưu reference đến v1.0
```

### Scenario 3: View acceptance history
```
Given T&C "TC-HOTDESK v1.0" đã có 150 acceptances
When Admin view T&C detail → tab "Acceptance History"
Then Hiển thị list:
  | Customer      | Booking    | Accepted At      | IP            |
  | Nguyễn Văn A  | BK-0001    | 15/04/2026 14:32 | 192.168.1.100 |
  | Trần Thị B    | BK-0002    | 16/04/2026 09:15 | 192.168.1.101 |
  | ...           | ...        | ...              | ...           |
And Button "Export CSV" để download history
```

## Phụ thuộc

**Phụ thuộc vào:**
- EP-01: Auth (role-based access)
- EP-02: Property Management (space types)

**Được sử dụng bởi:**
- F-37A: E-Contract Acceptance (hiển thị T&C cho customer)
- EP-04: Booking Management (require T&C acceptance)

## Technical Notes

### API Endpoints

```
GET    /api/terms                        # List T&C templates
GET    /api/terms/:id                    # Get T&C by ID
GET    /api/terms/active?spaceType=hot_desk  # Get active T&C for space type
POST   /api/terms                        # Create T&C
PUT    /api/terms/:id                    # Update T&C
DELETE /api/terms/:id                    # Delete T&C (if no acceptances)
GET    /api/terms/:id/acceptances        # Get acceptance history
POST   /api/terms/:id/activate           # Activate T&C
```

### Rendering T&C for Customer

```typescript
function renderTermsForCustomer(
  termsId: string, 
  buildingId: string, 
  spaceType: string
): RenderedTerms {
  const terms = await getTermsById(termsId);
  const building = await getBuildingById(buildingId);
  const config = await getSystemConfig();
  
  const data = {
    spaceType: SPACE_TYPE_LABELS[spaceType],
    buildingName: building.name,
    buildingAddress: building.address,
    operatingHours: building.operatingHours,
    cancelHours: config.cancellationHours,
    refundPercent: config.refundPercent,
    companyName: config.companyName,
    companyEmail: config.supportEmail,
  };
  
  return {
    title: replacePlaceholders(terms.title, data),
    content: replacePlaceholders(terms.contentTemplate, data),
    version: terms.version,
    termsId: terms.id,
  };
}
```
