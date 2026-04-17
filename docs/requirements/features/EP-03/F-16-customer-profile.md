# F-16 – Tạo hồ sơ khách hàng (Customer Profile)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-16 |
| Epic | EP-03 - Customer Management |
| Độ ưu tiên | Must have ⭐ CRITICAL |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép **Sale/Manager** tạo mới và cập nhật hồ sơ khách hàng khi họ đăng ký sử dụng dịch vụ Coworking Space. Hỗ trợ 2 loại khách hàng:

1. **Khách hàng cá nhân (Individual)**: Cá nhân thuê desk/space cho bản thân
2. **Khách hàng công ty (Company)**: Doanh nghiệp thuê Private Office/Dedicated Desk cho team

**Business Rationale:**
- **Single source of truth**: Tất cả thông tin khách hàng được lưu trữ tập trung
- **Data integrity**: Đảm bảo thông tin khách hàng đầy đủ và chính xác trước khi tạo booking/contract
- **Business compliance**: Lưu trữ MST, CCCD để đáp ứng yêu cầu pháp lý (xuất hóa đơn)
- **Customer lifecycle**: Theo dõi khách hàng từ lúc đăng ký đến khi kết thúc sử dụng dịch vụ

**Business Rules:**
- Email khách hàng phải unique trong hệ thống (không trùng với customer khác)
- Customer code tự động generate theo format `CUS-XXXX` (4 digits, sequential)
- Company code tự động generate theo format `COM-XXXX`
- Mã số thuế (MST) phải unique cho Company
- Không thể tạo Individual customer với email đã tồn tại
- Không thể tạo Company với MST đã tồn tại
- Default status khi tạo mới = `active`
- Chỉ Admin/Manager có quyền chỉnh sửa customer đã tạo

**Out of Scope:**
- Import khách hàng từ Excel → F-23 (Phase 2)
- Customer merge (ghép các record trùng) → Phase 2
- Customer referral tracking → Phase 2
- Integration với CRM bên ngoài → Phase 3

## User Story

> Là **Sale/Manager**, tôi muốn **tạo hồ sơ khách hàng khi họ đăng ký** để **lưu trữ thông tin và theo dõi quan hệ khách hàng**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Access Control & Navigation

- [ ] **AC1**: Route `/customers/create` accessible cho roles: `admin`, `manager`, `sale`
- [ ] **AC2**: Button "Add Customer" hiển thị trong Customer List page
- [ ] **AC3**: Click button → mở modal hoặc navigate to create page

### Customer Type Selection

- [ ] **AC4**: Form hiển thị radio buttons chọn customer type:
  - **Individual** (Cá nhân) - Default selected
  - **Company** (Công ty)
- [ ] **AC5**: Khi chuyển đổi type → form fields thay đổi tương ứng
- [ ] **AC6**: Nếu đang nhập dữ liệu → confirm dialog trước khi chuyển type (data sẽ bị reset)

### Individual Customer Form

- [ ] **AC7**: Form fields cho Individual customer:
  | Field | Label | Type | Required | Validation |
  |-------|-------|------|----------|------------|
  | firstName | Họ | Text | ✅ | Max 50 chars |
  | lastName | Tên | Text | ✅ | Max 50 chars |
  | email | Email | Email | ✅ | Valid format, unique |
  | phone | Số điện thoại | Tel | ✅ | VN format (09xx, 08xx, 07xx) |
  | alternativePhone | SĐT phụ | Tel | ❌ | VN format |
  | dateOfBirth | Ngày sinh | Date | ❌ | Must be past date |
  | nationalId | CCCD/CMND | Text | ❌ | 9 or 12 digits |
  | address | Địa chỉ | Textarea | ❌ | Max 200 chars |
  | notes | Ghi chú | Textarea | ❌ | Max 500 chars |

- [ ] **AC8**: `fullName` tự động generate từ `firstName + lastName`
- [ ] **AC9**: Real-time validation khi blur khỏi field
- [ ] **AC10**: Email validation → check unique via API (debounced 500ms)

### Company Customer Form

- [ ] **AC11**: Form fields cho Company customer:
  
  **Company Information:**
  | Field | Label | Type | Required | Validation |
  |-------|-------|------|----------|------------|
  | companyName | Tên công ty | Text | ✅ | Max 100 chars |
  | legalName | Tên pháp lý | Text | ❌ | Max 100 chars |
  | taxCode | Mã số thuế | Text | ✅ | 10 or 13 digits, unique |
  | industry | Ngành nghề | Select | ❌ | Predefined list |
  | companySize | Quy mô | Select | ✅ | startup/sme/enterprise |
  | foundedYear | Năm thành lập | Number | ❌ | 1900 - current year |
  | registeredAddress | Địa chỉ ĐKKD | Textarea | ✅ | Max 200 chars |
  | officeAddress | Địa chỉ VP | Textarea | ❌ | Max 200 chars |
  | companyEmail | Email công ty | Email | ❌ | Valid format |
  | companyPhone | SĐT công ty | Tel | ❌ | VN format |
  | website | Website | URL | ❌ | Valid URL format |

  **Primary Contact Person:**
  | Field | Label | Type | Required | Validation |
  |-------|-------|------|----------|------------|
  | contactPersonName | Người liên hệ | Text | ✅ | Max 100 chars |
  | contactPersonTitle | Chức vụ | Text | ❌ | Max 50 chars |
  | email | Email liên hệ | Email | ✅ | Valid format, unique |
  | phone | SĐT liên hệ | Tel | ✅ | VN format |

- [ ] **AC12**: Industry dropdown options: IT, Marketing, Finance, Education, Healthcare, Manufacturing, Retail, Other
- [ ] **AC13**: Company size options:
  - `startup`: 1-10 nhân viên
  - `sme`: 11-50 nhân viên
  - `enterprise`: 51+ nhân viên
- [ ] **AC14**: MST validation → check unique via API (debounced 500ms)

### Form Actions

- [ ] **AC15**: Button "Save" → create customer và redirect to customer details
- [ ] **AC16**: Button "Save & Add Another" → create customer, reset form, stay on create page
- [ ] **AC17**: Button "Cancel" → confirm dialog nếu form dirty, navigate back to customer list
- [ ] **AC18**: Khi save thành công → toast notification "Khách hàng đã được tạo"

### Auto-generated Data

- [ ] **AC19**: `customerCode` auto-generate: `CUS-0001`, `CUS-0002`, ... (sequential)
- [ ] **AC20**: `companyCode` auto-generate cho company: `COM-0001`, `COM-0002`, ...
- [ ] **AC21**: `createdAt`, `updatedAt` = current timestamp
- [ ] **AC22**: `createdBy` = ID của staff đang đăng nhập
- [ ] **AC23**: `status` = "active" (default)

### Edit Customer

- [ ] **AC24**: Vào Customer Details → Button "Edit" (chỉ Admin/Manager)
- [ ] **AC25**: Edit form pre-fill dữ liệu hiện tại
- [ ] **AC26**: Không thể đổi `customerType` sau khi tạo (Individual ↔ Company)
- [ ] **AC27**: Email change → validate unique (exclude current customer)
- [ ] **AC28**: Khi save → update `updatedAt`

### Validation & Error Handling

- [ ] **AC29**: Hiển thị validation errors inline dưới mỗi field
- [ ] **AC30**: Hiển thị API errors (duplicate email/MST) với message rõ ràng
- [ ] **AC31**: Form không submit nếu có validation errors
- [ ] **AC32**: Network error → toast "Không thể kết nối server, vui lòng thử lại"

## Dữ liệu / Fields

### Customer (Individual)

| Trường | Kiểu | Bắt buộc | Validation | Ghi chú |
|--------|------|----------|------------|---------|
| id | UUID | Auto | | PK |
| customerCode | String | Auto | Format CUS-XXXX | Unique |
| customerType | Enum | ✅ | 'individual' | |
| firstName | String | ✅ | Max 50 chars | |
| lastName | String | ✅ | Max 50 chars | |
| fullName | String | Auto | firstName + lastName | |
| email | String | ✅ | Email format, unique | |
| phone | String | ✅ | VN phone format | |
| alternativePhone | String | ❌ | VN phone format | |
| dateOfBirth | Date | ❌ | Past date | |
| nationalId | String | ❌ | 9 or 12 digits | CCCD/CMND |
| address | String | ❌ | Max 200 chars | |
| tags | String[] | ❌ | | |
| status | Enum | Auto | Default 'active' | active/inactive/suspended |
| referredBy | UUID | ❌ | FK Customer | |
| accountManager | UUID | ❌ | FK Staff (EP-09) | |
| notes | String | ❌ | Max 500 chars | |
| createdAt | DateTime | Auto | | |
| updatedAt | DateTime | Auto | | |
| createdBy | UUID | Auto | FK Staff | |

### Customer (Company)

| Trường | Kiểu | Bắt buộc | Validation | Ghi chú |
|--------|------|----------|------------|---------|
| id | UUID | Auto | | PK |
| customerCode | String | Auto | Format CUS-XXXX | Unique |
| customerType | Enum | ✅ | 'company' | |
| companyId | UUID | Auto | FK Company | Created together |
| fullName | String | Auto | = companyName | |
| contactPersonName | String | ✅ | Max 100 chars | Người liên hệ |
| contactPersonTitle | String | ❌ | Max 50 chars | |
| email | String | ✅ | Email format, unique | Primary contact email |
| phone | String | ✅ | VN phone format | Primary contact phone |
| tags | String[] | ❌ | | |
| status | Enum | Auto | Default 'active' | |
| accountManager | UUID | ❌ | FK Staff | |
| notes | String | ❌ | Max 500 chars | |
| createdAt | DateTime | Auto | | |
| updatedAt | DateTime | Auto | | |
| createdBy | UUID | Auto | FK Staff | |

### Company

| Trường | Kiểu | Bắt buộc | Validation | Ghi chú |
|--------|------|----------|------------|---------|
| id | UUID | Auto | | PK |
| companyCode | String | Auto | Format COM-XXXX | Unique |
| companyName | String | ✅ | Max 100 chars | |
| legalName | String | ❌ | Max 100 chars | |
| taxCode | String | ✅ | 10 or 13 digits, unique | MST |
| industry | String | ❌ | Predefined list | |
| companySize | Enum | ✅ | startup/sme/enterprise | |
| foundedYear | Number | ❌ | 1900 - current year | |
| registeredAddress | String | ✅ | Max 200 chars | Địa chỉ ĐKKD |
| officeAddress | String | ❌ | Max 200 chars | |
| companyEmail | String | ❌ | Email format | |
| companyPhone | String | ❌ | VN phone format | |
| website | String | ❌ | URL format | |
| status | Enum | Auto | Default 'active' | |
| notes | String | ❌ | Max 500 chars | |
| createdAt | DateTime | Auto | | |
| updatedAt | DateTime | Auto | | |
| createdBy | UUID | Auto | FK Staff | |

## API Contracts

### Create Individual Customer

```
POST /api/customers
Content-Type: application/json
Authorization: Bearer {token}

Request:
{
  "customerType": "individual",
  "firstName": "Nguyen Van",
  "lastName": "A",
  "email": "a@example.com",
  "phone": "0901234567",
  "alternativePhone": "0912345678",
  "dateOfBirth": "1990-01-15",
  "nationalId": "001234567890",
  "address": "123 Nguyen Trai, Q1, HCM",
  "notes": "VIP customer"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "customerCode": "CUS-0001",
    "customerType": "individual",
    "firstName": "Nguyen Van",
    "lastName": "A",
    "fullName": "Nguyen Van A",
    "email": "a@example.com",
    "phone": "0901234567",
    "status": "active",
    "createdAt": "2026-04-17T10:00:00Z",
    "createdBy": "staff-uuid"
  }
}

Response 400:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email đã tồn tại trong hệ thống",
    "field": "email"
  }
}
```

### Create Company Customer

```
POST /api/customers
Content-Type: application/json
Authorization: Bearer {token}

Request:
{
  "customerType": "company",
  "company": {
    "companyName": "ABC Technology Co., Ltd",
    "legalName": "Công ty TNHH ABC Technology",
    "taxCode": "0123456789",
    "industry": "IT",
    "companySize": "sme",
    "foundedYear": 2020,
    "registeredAddress": "456 Le Lai, Q1, HCM",
    "officeAddress": "789 Nguyen Hue, Q1, HCM",
    "companyEmail": "contact@abc.com",
    "companyPhone": "0287654321",
    "website": "https://abc.com"
  },
  "contactPersonName": "Tran Thi B",
  "contactPersonTitle": "Office Manager",
  "email": "b@abc.com",
  "phone": "0909876543",
  "notes": "Enterprise customer"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "customer-uuid",
    "customerCode": "CUS-0002",
    "customerType": "company",
    "companyId": "company-uuid",
    "fullName": "ABC Technology Co., Ltd",
    "contactPersonName": "Tran Thi B",
    "email": "b@abc.com",
    "phone": "0909876543",
    "status": "active",
    "company": {
      "id": "company-uuid",
      "companyCode": "COM-0001",
      "companyName": "ABC Technology Co., Ltd",
      "taxCode": "0123456789",
      "industry": "IT",
      "companySize": "sme"
    },
    "createdAt": "2026-04-17T10:00:00Z"
  }
}

Response 400:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Mã số thuế đã tồn tại trong hệ thống",
    "field": "company.taxCode"
  }
}
```

### Update Customer

```
PUT /api/customers/{customerId}
Content-Type: application/json
Authorization: Bearer {token}

Request (Individual):
{
  "firstName": "Nguyen Van",
  "lastName": "An",
  "phone": "0901234568",
  "address": "456 Le Loi, Q1, HCM"
}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "customerCode": "CUS-0001",
    "fullName": "Nguyen Van An",
    "phone": "0901234568",
    "updatedAt": "2026-04-17T11:00:00Z"
  }
}
```

### Check Email Unique

```
GET /api/customers/check-email?email=a@example.com&excludeId={customerId}

Response:
{
  "available": true
}
// or
{
  "available": false,
  "message": "Email đã được sử dụng bởi khách hàng khác"
}
```

### Check Tax Code Unique

```
GET /api/companies/check-tax-code?taxCode=0123456789&excludeId={companyId}

Response:
{
  "available": true
}
```

## Scenarios (Given / When / Then)

### Scenario 1: Tạo khách hàng cá nhân thành công

```gherkin
Given Staff (role: sale) đã đăng nhập
And Đang ở trang Customer List

When Click button "Add Customer"
And Modal/Page Create Customer hiển thị
And Chọn customer type "Individual" (default)
And Nhập firstName "Nguyen Van"
And Nhập lastName "A"
And Nhập email "a@example.com"
And Nhập phone "0901234567"
And Nhập CCCD "001234567890"
And Nhập address "123 Nguyen Trai, Q1, HCM"
And Click "Save"

Then Customer được tạo thành công
And customerCode = "CUS-0001"
And fullName = "Nguyen Van A"
And status = "active"
And Toast hiển thị "Khách hàng đã được tạo"
And Redirect to Customer Details page
```

### Scenario 2: Tạo khách hàng công ty thành công

```gherkin
Given Staff (role: manager) đã đăng nhập
And Đang ở trang Create Customer

When Chọn customer type "Company"
And Form chuyển sang Company fields
And Nhập companyName "ABC Technology Co., Ltd"
And Nhập taxCode "0123456789"
And Chọn industry "IT"
And Chọn companySize "sme"
And Nhập registeredAddress "456 Le Lai, Q1, HCM"
And Nhập contactPersonName "Tran Thi B"
And Nhập contactPersonTitle "Office Manager"
And Nhập email "b@abc.com"
And Nhập phone "0909876543"
And Click "Save"

Then Company record được tạo với companyCode = "COM-0001"
And Customer record được tạo với customerCode = "CUS-0002"
And Customer.companyId = Company.id
And Customer.fullName = "ABC Technology Co., Ltd"
And Toast hiển thị "Khách hàng đã được tạo"
And Redirect to Customer Details
```

### Scenario 3: Email trùng - Individual

```gherkin
Given Customer với email "existing@example.com" đã tồn tại

When Staff tạo Individual customer mới
And Nhập email "existing@example.com"
And Blur khỏi field email

Then Field email hiển thị error "Email đã tồn tại trong hệ thống"
And Button Save bị disabled
And Không thể submit form
```

### Scenario 4: MST trùng - Company

```gherkin
Given Company với taxCode "0123456789" đã tồn tại

When Staff tạo Company customer mới
And Nhập taxCode "0123456789"
And Blur khỏi field taxCode

Then Field taxCode hiển thị error "Mã số thuế đã tồn tại"
And Button Save bị disabled
```

### Scenario 5: Chuyển đổi customer type khi đang nhập liệu

```gherkin
Given Staff đang ở form Create Customer
And Đã chọn type "Individual"
And Đã nhập firstName "Test"

When Click chọn type "Company"

Then Confirm dialog hiển thị "Dữ liệu đã nhập sẽ bị xóa. Bạn có chắc muốn chuyển loại khách hàng?"
And Nếu click "Confirm" → form reset, hiển thị Company fields
And Nếu click "Cancel" → giữ nguyên Individual fields
```

### Scenario 6: Edit customer - thay đổi email

```gherkin
Given Individual customer "CUS-0001" với email "old@example.com"
And Staff (role: manager) đang ở Customer Details

When Click "Edit"
And Thay đổi email thành "new@example.com"
And Click "Save"

Then API validate email "new@example.com" chưa tồn tại (exclude CUS-0001)
And Customer được cập nhật
And Toast hiển thị "Thông tin đã được cập nhật"
```

## UI/UX Guidelines

### Form Layout

```
┌────────────────────────────────────────────────────────────┐
│ Add New Customer                                     [X]   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Customer Type:                                            │
│  ○ Individual (Cá nhân)    ○ Company (Công ty)             │
│                                                            │
│  ─────────────────────────────────────────────────────     │
│                                                            │
│  Personal Information                                      │
│  ┌──────────────────────┐ ┌──────────────────────┐        │
│  │ Họ *                 │ │ Tên *                │        │
│  │ ________________     │ │ ________________     │        │
│  └──────────────────────┘ └──────────────────────┘        │
│                                                            │
│  ┌──────────────────────┐ ┌──────────────────────┐        │
│  │ Email *              │ │ Số điện thoại *      │        │
│  │ ________________     │ │ ________________     │        │
│  └──────────────────────┘ └──────────────────────┘        │
│                                                            │
│  ┌─────────────────────────────────────────────────┐      │
│  │ Địa chỉ                                          │      │
│  │ __________________________________________________│      │
│  └─────────────────────────────────────────────────┘      │
│                                                            │
│  ┌──────────────────────┐ ┌──────────────────────┐        │
│  │ CCCD/CMND            │ │ Ngày sinh            │        │
│  │ ________________     │ │ [📅] ____________    │        │
│  └──────────────────────┘ └──────────────────────┘        │
│                                                            │
│  Notes                                                     │
│  ┌─────────────────────────────────────────────────┐      │
│  │ __________________________________________________│      │
│  └─────────────────────────────────────────────────┘      │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                     [Cancel]  [Save & Add Another]  [Save] │
└────────────────────────────────────────────────────────────┘
```

### Company Form (additional sections)

```
│  Company Information                                       │
│  ┌─────────────────────────────────────────────────┐      │
│  │ Tên công ty *                                    │      │
│  │ ABC Technology Co., Ltd_________________________ │      │
│  └─────────────────────────────────────────────────┘      │
│                                                            │
│  ┌──────────────────────┐ ┌──────────────────────┐        │
│  │ Mã số thuế *         │ │ Ngành nghề           │        │
│  │ 0123456789__________ │ │ [▼ IT             ]  │        │
│  └──────────────────────┘ └──────────────────────┘        │
│                                                            │
│  ┌──────────────────────┐                                  │
│  │ Quy mô công ty *     │                                  │
│  │ [▼ SME (11-50)    ]  │                                  │
│  └──────────────────────┘                                  │
│                                                            │
│  ─────────────────────────────────────────────────────     │
│  Primary Contact Person                                    │
│  ┌──────────────────────┐ ┌──────────────────────┐        │
│  │ Người liên hệ *      │ │ Chức vụ              │        │
│  │ Tran Thi B__________ │ │ Office Manager______ │        │
│  └──────────────────────┘ └──────────────────────┘        │
```

### Design Tokens

- Form container: `bg-white rounded-2xl shadow-sm border border-slate-200 p-6`
- Section header: `text-lg font-semibold text-slate-900 mb-4`
- Input field: `w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#b11e29]/20 focus:border-[#b11e29]`
- Label: `text-sm font-medium text-slate-700 mb-1`
- Required asterisk: `text-rose-500`
- Error message: `text-sm text-rose-600 mt-1`
- Radio button active: `border-[#b11e29] bg-[#b11e29]`
- Primary button: `bg-[#b11e29] text-white rounded-xl hover:bg-[#8f1821]`
- Secondary button: `bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50`

## Technical Notes

### Database Indexes

```sql
-- Customer indexes
CREATE UNIQUE INDEX idx_customers_email ON customers(email);
CREATE UNIQUE INDEX idx_customers_code ON customers(customer_code);
CREATE INDEX idx_customers_type_status ON customers(customer_type, status);
CREATE INDEX idx_customers_company ON customers(company_id);
CREATE INDEX idx_customers_created ON customers(created_at);

-- Company indexes
CREATE UNIQUE INDEX idx_companies_tax_code ON companies(tax_code);
CREATE UNIQUE INDEX idx_companies_code ON companies(company_code);
CREATE INDEX idx_companies_status ON companies(status);
```

### Customer Code Generation

```typescript
// Sequential generation with gap handling
async function generateCustomerCode(): Promise<string> {
  const lastCustomer = await db.customers
    .orderBy('customerCode', 'desc')
    .first();
  
  if (!lastCustomer) return 'CUS-0001';
  
  const lastNumber = parseInt(lastCustomer.customerCode.split('-')[1]);
  return `CUS-${String(lastNumber + 1).padStart(4, '0')}`;
}
```

### Phone Validation (Vietnam)

```typescript
const VN_PHONE_REGEX = /^(0[3|5|7|8|9])[0-9]{8}$/;

function validateVNPhone(phone: string): boolean {
  return VN_PHONE_REGEX.test(phone);
}
```

### Tax Code Validation

```typescript
// MST Vietnam: 10 or 13 digits
const TAX_CODE_REGEX = /^[0-9]{10}(-[0-9]{3})?$/;

function validateTaxCode(taxCode: string): boolean {
  return TAX_CODE_REGEX.test(taxCode);
}
```

## Dependencies

**Phụ thuộc vào:**
- EP-01: Authentication (cần login)
- EP-09: Staff Management (createdBy, accountManager)

**Được sử dụng bởi:**
- F-17: Customer List (hiển thị customers đã tạo)
- F-18: Customer Details (xem chi tiết customer)
- EP-04: Booking (link booking to customer)
- EP-05: Contract (link contract to customer)
- EP-06: Invoice (link invoice to customer)

## Ghi chú

- Customer là **đã convert** (đã ký contract hoặc đã booking). Lead chưa convert nằm ở EP-12.
- Email unique đảm bảo 1 người = 1 customer account.
- Company customer: tạo cả Company record + Customer record cùng lúc (transaction).
- Không cho phép đổi `customerType` sau khi tạo để đảm bảo data integrity.
