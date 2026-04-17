# F-18 – Chi tiết khách hàng (Customer Details)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-18 |
| Epic | EP-03 - Customer Management |
| Độ ưu tiên | Must have ⭐ CRITICAL |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Trang chi tiết hiển thị **360° view** của một khách hàng bao gồm: thông tin cá nhân/công ty, lịch sử bookings, contracts, invoices và các hoạt động liên quan. Là central hub để quản lý mọi thứ liên quan đến một khách hàng.

**Business Rationale:**
- **Customer 360**: Một nơi để xem tất cả thông tin về khách hàng
- **Quick actions**: Thực hiện operations thường xuyên (edit, suspend, create booking)
- **Relationship tracking**: Theo dõi lịch sử quan hệ với khách hàng
- **Decision support**: Đủ thông tin để đưa ra quyết định (gia hạn contract, offer VIP)

**Business Rules:**
- Chỉ Admin/Manager có quyền Edit customer
- Chỉ Admin có quyền Suspend/Delete customer
- Company customer hiển thị thêm tab "Employees" (F-19A)
- Bookings/Contracts/Invoices list cho phép navigate đến chi tiết tương ứng
- Không hiển thị sensitive data (CCCD) cho role Sale

**Out of Scope:**
- Customer communication log → F-22 (Phase 2)
- Customer analytics/insights → F-21 (Phase 2)
- Activity timeline → Phase 2
- Export customer profile to PDF → Phase 2

## User Story

> Là **Manager/Kế toán**, tôi muốn **xem thông tin đầy đủ của khách hàng** để **hiểu rõ lịch sử sử dụng và đưa ra quyết định phù hợp**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Access Control & Navigation

- [ ] **AC1**: Route `/customers/{customerId}` accessible cho roles: `admin`, `manager`, `sale`, `accountant`
- [ ] **AC2**: Navigate từ Customer List (F-17) bằng cách click row
- [ ] **AC3**: Breadcrumb: `Khách hàng > CUS-0001` (clickable back to list)
- [ ] **AC4**: 404 page nếu customerId không tồn tại

### Page Header

- [ ] **AC5**: Header hiển thị:
  - Customer avatar (initials hoặc company logo placeholder)
  - Customer name (fullName)
  - Customer code (CUS-XXXX)
  - Status badge (active/inactive/suspended)
  - Type badge (Individual/Company)
- [ ] **AC6**: Action buttons (theo role):
  - Edit (admin, manager)
  - Suspend/Resume (admin)
  - Delete (admin) - với confirm dialog
  - Create Booking (admin, manager, sale)
  - Create Contract (admin, manager)

### Customer Info Section

- [ ] **AC7**: **Individual Customer** hiển thị:
  | Field | Label | Ghi chú |
  |-------|-------|---------|
  | customerCode | Mã khách hàng | CUS-0001 |
  | fullName | Họ tên | |
  | email | Email | Clickable mailto: |
  | phone | Số điện thoại | Clickable tel: |
  | alternativePhone | SĐT phụ | |
  | dateOfBirth | Ngày sinh | DD/MM/YYYY |
  | nationalId | CCCD/CMND | Masked cho role Sale |
  | address | Địa chỉ | |
  | tags | Tags | Tag chips |
  | status | Trạng thái | Badge |
  | accountManager | Account Manager | Staff name, clickable |
  | referredBy | Giới thiệu bởi | Customer name, clickable |
  | createdAt | Ngày tạo | DD/MM/YYYY HH:mm |
  | createdBy | Người tạo | Staff name |

- [ ] **AC8**: **Company Customer** hiển thị thêm:
  | Field | Label | Ghi chú |
  |-------|-------|---------|
  | companyName | Tên công ty | |
  | legalName | Tên pháp lý | |
  | taxCode | Mã số thuế | |
  | industry | Ngành nghề | |
  | companySize | Quy mô | Startup/SME/Enterprise |
  | foundedYear | Năm thành lập | |
  | registeredAddress | Địa chỉ ĐKKD | |
  | officeAddress | Địa chỉ VP | |
  | companyEmail | Email công ty | |
  | companyPhone | SĐT công ty | |
  | website | Website | Clickable link |
  | contactPersonName | Người liên hệ | |
  | contactPersonTitle | Chức vụ | |

- [ ] **AC9**: Notes section - editable inline (auto-save on blur)

### Tabs Navigation

- [ ] **AC10**: Tab navigation cho customer data:
  - **Overview** (default) - Summary statistics
  - **Bookings** - Lịch sử đặt chỗ
  - **Contracts** - Hợp đồng
  - **Invoices** - Hóa đơn
  - **Employees** (chỉ Company customers) - Nhân viên công ty

- [ ] **AC11**: Tab state được giữ trong URL (`?tab=bookings`)

### Overview Tab

- [ ] **AC12**: Statistics cards:
  - Total Bookings (số lượng)
  - Active Contracts (số lượng)
  - Total Spent (VND) - tổng tiền đã thanh toán
  - Outstanding Balance (VND) - số tiền còn nợ
- [ ] **AC13**: Recent Activity timeline (5 items gần nhất):
  - Booking created/cancelled
  - Contract signed/expired
  - Invoice paid
  - Customer info updated

### Bookings Tab

- [ ] **AC14**: Table hiển thị bookings:
  | Cột | Ghi chú |
  |-----|---------|
  | Booking Code | BK-XXXXX |
  | Space | Tên space |
  | Building/Floor | Location |
  | Date | DD/MM/YYYY |
  | Time | HH:mm - HH:mm |
  | Status | pending/confirmed/checked_in/completed/cancelled |
  | Amount | VND |

- [ ] **AC15**: Filter: All / Upcoming / Past / Cancelled
- [ ] **AC16**: Upcoming bookings: màu xanh highlight
- [ ] **AC17**: Past bookings: màu xám
- [ ] **AC18**: Click row → navigate to Booking Details (EP-04)
- [ ] **AC19**: Empty state: "Chưa có booking nào"
- [ ] **AC20**: Button "Create Booking" → navigate to booking create với customer pre-selected

### Contracts Tab

- [ ] **AC21**: Table hiển thị contracts:
  | Cột | Ghi chú |
  |-----|---------|
  | Contract Code | CT-XXXXX |
  | Space | Private Office / Dedicated Desk |
  | Start Date | DD/MM/YYYY |
  | End Date | DD/MM/YYYY |
  | Status | active/expired/terminated |
  | Monthly Value | VND/tháng |

- [ ] **AC22**: Filter: All / Active / Expired / Terminated
- [ ] **AC23**: Active contracts: màu xanh lá
- [ ] **AC24**: Expiring soon (≤30 days): badge "Sắp hết hạn"
- [ ] **AC25**: Expired contracts: màu xám
- [ ] **AC26**: Click row → navigate to Contract Details (EP-05)
- [ ] **AC27**: Button "Create Contract" (admin, manager)

### Invoices Tab

- [ ] **AC28**: Table hiển thị invoices:
  | Cột | Ghi chú |
  |-----|---------|
  | Invoice Code | INV-XXXXX |
  | Description | Booking/Contract description |
  | Issue Date | DD/MM/YYYY |
  | Due Date | DD/MM/YYYY |
  | Amount | VND |
  | Status | draft/sent/paid/overdue/cancelled |

- [ ] **AC29**: Filter: All / Paid / Pending / Overdue
- [ ] **AC30**: Overdue invoices: màu đỏ highlight
- [ ] **AC31**: Click row → navigate to Invoice Details (EP-06)
- [ ] **AC32**: Summary: Total Paid / Outstanding / Overdue

### Employees Tab (Company only)

- [ ] **AC33**: Chỉ hiển thị cho company customers
- [ ] **AC34**: Xem chi tiết tại F-19A
- [ ] **AC35**: Summary: Total Employees / Active / With Access Card

### Edit Customer

- [ ] **AC36**: Click "Edit" → mở modal hoặc slide-over panel
- [ ] **AC37**: Form pre-fill dữ liệu hiện tại
- [ ] **AC38**: Không thể đổi `customerType`
- [ ] **AC39**: Save → update customer, refresh page
- [ ] **AC40**: Validation như F-16

### Suspend/Resume Customer

- [ ] **AC41**: Suspend dialog:
  - Textarea nhập reason
  - Warning: "Khách hàng sẽ không thể tạo booking mới"
  - Button "Suspend"
- [ ] **AC42**: Sau khi suspend:
  - Status badge → "Suspended" đỏ
  - Banner warning hiển thị ở đầu page
  - Resume button xuất hiện
- [ ] **AC43**: Resume: Confirm dialog → status → "active"

### Delete Customer

- [ ] **AC44**: Delete button → confirm dialog:
  - "Bạn có chắc muốn xóa khách hàng này?"
  - Warning nếu có active contracts/unpaid invoices
- [ ] **AC45**: Cannot delete nếu:
  - Có active contracts
  - Có unpaid invoices
  - Có upcoming bookings
- [ ] **AC46**: Soft delete: set status = 'deleted', không xóa hẳn

### Loading & Error States

- [ ] **AC47**: Skeleton loading cho customer info và tabs
- [ ] **AC48**: Error state với retry button
- [ ] **AC49**: Tab data loading riêng (mỗi tab fetch khi active)

## Dữ liệu / Fields

### CustomerDetails Response

```typescript
interface CustomerDetails {
  // Basic info (như CustomerListItem)
  id: string;
  customerCode: string;
  customerType: 'individual' | 'company';
  fullName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  tags: string[];
  
  // Individual fields
  firstName?: string;
  lastName?: string;
  alternativePhone?: string;
  dateOfBirth?: string;
  nationalId?: string;
  address?: string;
  
  // Company fields
  contactPersonName?: string;
  contactPersonTitle?: string;
  
  // Company record (if company customer)
  company?: {
    id: string;
    companyCode: string;
    companyName: string;
    legalName?: string;
    taxCode: string;
    industry?: string;
    companySize: 'startup' | 'sme' | 'enterprise';
    foundedYear?: number;
    registeredAddress: string;
    officeAddress?: string;
    companyEmail?: string;
    companyPhone?: string;
    website?: string;
  };
  
  // Relations
  accountManager?: { id: string; name: string; };
  referredBy?: { id: string; customerCode: string; fullName: string; };
  
  // Stats
  stats: {
    totalBookings: number;
    activeContracts: number;
    totalSpent: number;
    outstandingBalance: number;
  };
  
  // Metadata
  notes?: string;
  createdAt: string;
  createdBy: { id: string; name: string; };
  updatedAt: string;
}
```

### Tab Data Types

```typescript
interface CustomerBooking {
  id: string;
  bookingCode: string;
  spaceId: string;
  spaceName: string;
  buildingName: string;
  floorLabel: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
  totalAmount: number;
}

interface CustomerContract {
  id: string;
  contractCode: string;
  spaceId: string;
  spaceName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'terminated';
  monthlyValue: number;
  daysRemaining: number;
}

interface CustomerInvoice {
  id: string;
  invoiceCode: string;
  description: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paidAmount: number;
}
```

## API Contracts

### Get Customer Details

```
GET /api/customers/{customerId}
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "customerCode": "CUS-0001",
    "customerType": "individual",
    "fullName": "Nguyen Van A",
    "email": "a@example.com",
    "phone": "0901234567",
    "status": "active",
    "tags": ["VIP", "Long-term"],
    "firstName": "Nguyen Van",
    "lastName": "A",
    "dateOfBirth": "1990-01-15",
    "nationalId": "001234567890",
    "address": "123 Nguyen Trai, Q1, HCM",
    "stats": {
      "totalBookings": 25,
      "activeContracts": 1,
      "totalSpent": 50000000,
      "outstandingBalance": 5000000
    },
    "accountManager": {
      "id": "staff-uuid",
      "name": "Le Thi C"
    },
    "createdAt": "2026-01-10T09:00:00Z",
    "createdBy": {
      "id": "staff-uuid",
      "name": "Admin"
    }
  }
}

Response 404:
{
  "success": false,
  "error": {
    "code": "CUSTOMER_NOT_FOUND",
    "message": "Khách hàng không tồn tại"
  }
}
```

### Get Customer Bookings

```
GET /api/customers/{customerId}/bookings?filter=all&page=1&pageSize=10
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "bookingCode": "BK-00125",
        "spaceName": "Meeting Room A",
        "buildingName": "Cobi Tower",
        "floorLabel": "2F",
        "date": "2026-04-20",
        "startTime": "09:00",
        "endTime": "11:00",
        "status": "confirmed",
        "totalAmount": 500000
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "totalItems": 25,
      "totalPages": 3
    }
  }
}
```

### Get Customer Contracts

```
GET /api/customers/{customerId}/contracts?filter=all
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "contractCode": "CT-00050",
        "spaceName": "Private Office 101",
        "startDate": "2026-01-01",
        "endDate": "2026-12-31",
        "status": "active",
        "monthlyValue": 15000000,
        "daysRemaining": 258
      }
    ]
  }
}
```

### Get Customer Invoices

```
GET /api/customers/{customerId}/invoices?filter=all&page=1
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "invoiceCode": "INV-2026-0100",
        "description": "Private Office 101 - Tháng 04/2026",
        "issueDate": "2026-04-01",
        "dueDate": "2026-04-15",
        "amount": 15000000,
        "status": "paid",
        "paidAmount": 15000000
      }
    ],
    "summary": {
      "totalPaid": 45000000,
      "outstanding": 5000000,
      "overdue": 0
    }
  }
}
```

### Update Customer Notes

```
PATCH /api/customers/{customerId}/notes
Authorization: Bearer {token}

Request:
{
  "notes": "VIP customer, prefers window seats."
}

Response 200:
{
  "success": true,
  "data": {
    "notes": "VIP customer, prefers window seats.",
    "updatedAt": "2026-04-17T10:00:00Z"
  }
}
```

## Scenarios (Given / When / Then)

### Scenario 1: Xem customer details - Individual

```gherkin
Given Individual customer "CUS-0001" (Nguyen Van A) tồn tại
And Manager đã đăng nhập

When Navigate to /customers/CUS-0001

Then Page hiển thị customer details:
  - Avatar với initials "NA"
  - Name: "Nguyen Van A"
  - Code: "CUS-0001"
  - Status badge: "Active" (xanh)
  - Type: Individual
And Customer info section hiển thị:
  - Email, Phone, Address, CCCD, etc.
And Tabs: Overview, Bookings, Contracts, Invoices
And Overview tab active by default
```

### Scenario 2: Xem customer details - Company

```gherkin
Given Company customer "CUS-0002" (ABC Technology) tồn tại

When Navigate to /customers/CUS-0002

Then Page hiển thị:
  - Name: "ABC Technology Co., Ltd"
  - Badge: "COMPANY" (xanh dương)
And Company info section hiển thị:
  - Company name, MST, Industry, Size
  - Contact person name, title
And Tabs bao gồm thêm: "Employees"
```

### Scenario 3: Xem bookings history

```gherkin
Given Customer "CUS-0001" có 15 bookings (5 upcoming, 10 past)

When Click tab "Bookings"

Then Table hiển thị 15 bookings
And Upcoming bookings highlight xanh
And Past bookings màu xám
And Filter buttons: All (15), Upcoming (5), Past (10), Cancelled (0)
```

### Scenario 4: Xem contracts - expiring soon

```gherkin
Given Customer "CUS-0001" có 1 contract sắp hết hạn trong 20 ngày

When Click tab "Contracts"

Then Contract hiển thị badge "Sắp hết hạn" (vàng)
And daysRemaining hiển thị "Còn 20 ngày"
```

### Scenario 5: Xem invoices - có overdue

```gherkin
Given Customer "CUS-0001" có 1 invoice quá hạn 5 ngày

When Click tab "Invoices"

Then Invoice row highlight màu đỏ
And Status badge: "Quá hạn" (đỏ)
And Summary hiển thị: Outstanding: 5,000,000 VND, Overdue: 5,000,000 VND
```

### Scenario 6: Edit customer inline notes

```gherkin
Given Customer "CUS-0001" details đang hiển thị
And Notes section có text "VIP customer"

When Click vào notes section
And Thay đổi thành "VIP customer, prefers morning bookings"
And Click ra ngoài (blur)

Then Notes auto-save
And Toast: "Ghi chú đã được cập nhật"
```

### Scenario 7: Suspend customer

```gherkin
Given Customer "CUS-0001" status = "active"
And Admin đã đăng nhập

When Click "Suspend"
And Nhập reason: "Payment overdue 30 days"
And Confirm

Then Customer status → "suspended"
And Banner warning hiển thị: "Khách hàng này đang bị tạm ngưng"
And Button "Suspend" → "Resume"
```

### Scenario 8: Cannot delete customer with active contract

```gherkin
Given Customer "CUS-0001" có 1 active contract

When Admin click "Delete"

Then Dialog hiển thị warning:
  "Không thể xóa khách hàng này vì:"
  "- Có 1 hợp đồng đang active"
And Delete button bị disabled
```

### Scenario 9: Navigate to booking details

```gherkin
Given Customer details đang hiển thị Bookings tab
And Booking "BK-00125" trong list

When Click vào row "BK-00125"

Then Navigate to /bookings/BK-00125
And Booking Details page hiển thị
```

## UI/UX Guidelines

### Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Breadcrumb: Khách hàng > CUS-0001                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────┐  Nguyen Van A                    [Edit] [Suspend] [▼]│
│  │  NA  │  CUS-0001  [Active] [Individual]                     │
│  └──────┘  📧 a@example.com  📞 0901234567                      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [Overview] [Bookings] [Contracts] [Invoices]                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Customer Information                              [Employees]  │
│  ┌─────────────────────────┬─────────────────────────┐         │
│  │ Họ tên      │ Nguyen Van A                        │         │
│  │ Email       │ a@example.com                       │         │
│  │ SĐT         │ 0901234567                          │         │
│  │ Địa chỉ     │ 123 Nguyen Trai, Q1                 │         │
│  │ Tags        │ [VIP] [Long-term]                   │         │
│  │ Ngày tạo    │ 10/01/2026 09:00                    │         │
│  └─────────────────────────┴─────────────────────────┘         │
│                                                                 │
│  Notes                                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ VIP customer, prefers window seats.                      │   │
│  │ ________________________________________________________│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Statistics                                                     │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐       │
│  │ Bookings  │ │ Contracts │ │ Total Paid│ │Outstanding│       │
│  │    25     │ │     1     │ │   50M     │ │    5M     │       │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Bookings Tab Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ [All (25)] [Upcoming (5)] [Past (20)] [Cancelled (0)]           │
│                                                   [+ Create]    │
├─────────────────────────────────────────────────────────────────┤
│ Code     │ Space          │ Location    │ Date    │ Time   │ $ │
├──────────┼────────────────┼─────────────┼─────────┼────────┼───┤
│ BK-00125 │ Meeting Room A │ Cobi/2F     │ 20/04   │ 9-11   │ ✅│
│ BK-00124 │ Hot Desk 15    │ Cobi/3F     │ 18/04   │ 8-17   │ ✓ │
│ ...      │ ...            │ ...         │ ...     │ ...    │...│
└─────────────────────────────────────────────────────────────────┘
```

### Design Tokens

- Page container: `p-6 max-w-7xl mx-auto`
- Avatar large: `w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-semibold text-slate-600`
- Customer name: `text-2xl font-bold text-slate-900`
- Customer code: `text-sm text-slate-500`
- Info grid: `grid grid-cols-2 gap-4`
- Info label: `text-sm text-slate-500`
- Info value: `text-sm font-medium text-slate-900`
- Tab active: `border-b-2 border-[#b11e29] text-[#b11e29]`
- Tab inactive: `text-slate-500 hover:text-slate-700`
- Stats card: `bg-white rounded-xl border border-slate-200 p-4 text-center`
- Stats number: `text-2xl font-bold text-slate-900`
- Notes textarea: `w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#b11e29]/20`
- Warning banner: `bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl`

## Technical Notes

### Data Fetching Strategy

```typescript
// Main customer details - always fetch
const { data: customer } = useQuery({
  queryKey: ['customer', customerId],
  queryFn: () => customersService.getById(customerId)
});

// Tab data - fetch on demand
const { data: bookings } = useQuery({
  queryKey: ['customer', customerId, 'bookings', filter],
  queryFn: () => customersService.getBookings(customerId, filter),
  enabled: activeTab === 'bookings' // Only fetch when tab active
});
```

### Notes Auto-save

```typescript
const debouncedNotes = useDebounce(notes, 1000);

useEffect(() => {
  if (debouncedNotes !== initialNotes) {
    updateNotes.mutate({ notes: debouncedNotes });
  }
}, [debouncedNotes]);
```

### Tab URL State

```typescript
const [searchParams, setSearchParams] = useSearchParams();
const activeTab = searchParams.get('tab') || 'overview';

const setActiveTab = (tab: string) => {
  setSearchParams({ tab });
};
```

## Dependencies

**Phụ thuộc vào:**
- EP-01: Authentication (role check)
- F-16: Customer Profile (customer data)
- F-17: Customer List (navigation from)

**Được sử dụng bởi:**
- F-19: Customer Segmentation (add/remove tags)
- F-19A: Company Employees (employees tab)
- EP-04: Booking (navigate to booking details)
- EP-05: Contract (navigate to contract details)
- EP-06: Invoice (navigate to invoice details)

## Ghi chú

- Customer 360 view là một trong những tính năng quan trọng nhất cho CRM
- Tab lazy loading giúp giảm initial load time
- Notes auto-save cải thiện UX, giảm click "Save"
- Company customers có thêm tab Employees để quản lý nhân viên
- Sensitive data (CCCD) được mask cho một số roles
