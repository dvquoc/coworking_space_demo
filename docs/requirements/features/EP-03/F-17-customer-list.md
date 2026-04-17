# F-17 – Danh sách khách hàng (Customer List)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-17 |
| Epic | EP-03 - Customer Management |
| Độ ưu tiên | Must have ⭐ CRITICAL |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Trang danh sách hiển thị tất cả khách hàng trong hệ thống với khả năng tìm kiếm, lọc và sắp xếp. Hỗ trợ phân trang để xử lý số lượng lớn khách hàng.

**Business Rationale:**
- **Quick access**: Tìm kiếm khách hàng nhanh chóng theo nhiều tiêu chí
- **Overview**: Nhìn tổng quan về customer base
- **Navigation**: Entry point để đi vào Customer Details
- **Management**: Thực hiện quick actions như suspend, export

**Business Rules:**
- Mặc định sắp xếp theo ngày tạo mới nhất (createdAt DESC)
- Pagination: 20 customers/page (có thể chọn 10, 20, 50, 100)
- Search tìm kiếm theo: name, email, phone, company name
- Filter có thể kết hợp nhiều điều kiện (AND logic)
- Company customers hiển thị badge "COMPANY"
- Status hiển thị màu: active (xanh), inactive (xám), suspended (đỏ)

**Out of Scope:**
- Bulk actions (delete, export nhiều) → Phase 2
- Advanced filters (date range, tags) → Phase 2
- Saved filters / views → Phase 2
- Infinite scroll → sử dụng pagination

## User Story

> Là **Manager/Sale**, tôi muốn **xem danh sách tất cả khách hàng** để **quản lý, tìm kiếm và truy cập thông tin khách hàng nhanh chóng**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Access Control & Navigation

- [ ] **AC1**: Route `/customers` accessible cho roles: `admin`, `manager`, `sale`, `accountant`
- [ ] **AC2**: Menu item "Khách hàng" trong sidebar navigation
- [ ] **AC3**: Role `accountant` chỉ có quyền view (không có button Add/Edit)

### Page Header

- [ ] **AC4**: Header hiển thị:
  - Title: "Khách hàng"
  - Subtitle: Tổng số customers "123 khách hàng"
  - Button "Add Customer" (chỉ admin, manager, sale)
- [ ] **AC5**: Click "Add Customer" → mở modal/navigate to create page (F-16)

### Table Display

- [ ] **AC6**: Table hiển thị các cột:
  | Cột | Width | Sortable | Ghi chú |
  |-----|-------|----------|---------|
  | Customer Code | 120px | ✅ | CUS-0001 |
  | Name | Flexible | ✅ | fullName + type badge |
  | Email | 200px | ✅ | |
  | Phone | 140px | ❌ | |
  | Type | 100px | ✅ | Individual / Company badge |
  | Status | 100px | ✅ | active/inactive/suspended badge |
  | Created Date | 120px | ✅ | DD/MM/YYYY format |
  | Actions | 80px | ❌ | Icon buttons |

- [ ] **AC7**: Company customer hiển thị:
  - Name: Company name
  - Badge: "COMPANY" màu xanh dương
  - Tooltip: "Liên hệ: {contactPersonName}"

- [ ] **AC8**: Individual customer hiển thị:
  - Name: fullName
  - Badge: "INDIVIDUAL" màu xám (optional, có thể ẩn)

- [ ] **AC9**: Status badges:
  - `active`: Badge xanh lá "Active"
  - `inactive`: Badge xám "Inactive"
  - `suspended`: Badge đỏ "Suspended"

### Row Interactions

- [ ] **AC10**: Click row → navigate to Customer Details (`/customers/{id}`)
- [ ] **AC11**: Hover row → highlight với `bg-slate-50`
- [ ] **AC12**: Actions column (dropdown hoặc icon buttons):
  - 👁 View Details
  - ✏️ Edit (admin, manager only)
  - ⏸ Suspend / Resume (admin only)

### Search

- [ ] **AC13**: Search bar với placeholder "Tìm kiếm theo tên, email, phone, công ty..."
- [ ] **AC14**: Search debounce 300ms
- [ ] **AC15**: Search tìm kiếm trong các fields:
  - `fullName` (contains, case-insensitive)
  - `email` (contains)
  - `phone` (contains)
  - `company.companyName` (contains)
  - `customerCode` (equals)
- [ ] **AC16**: Clear search button (X) khi có text
- [ ] **AC17**: Search term được giữ trong URL query params (`?search=abc`)

### Filters

- [ ] **AC18**: Filter panel với các options:
  
  **Status:**
  - [ ] All (default)
  - [ ] Active
  - [ ] Inactive
  - [ ] Suspended

  **Type:**
  - [ ] All (default)
  - [ ] Individual
  - [ ] Company

- [ ] **AC19**: Filter chips hiển thị active filters
- [ ] **AC20**: "Clear All Filters" button khi có filter active
- [ ] **AC21**: Filter values được giữ trong URL query params (`?status=active&type=company`)
- [ ] **AC22**: Khi apply filter → reset về page 1

### Sorting

- [ ] **AC23**: Click column header → sort ASC
- [ ] **AC24**: Click lại → sort DESC
- [ ] **AC25**: Icon indicator (▲/▼) hiển thị sort direction
- [ ] **AC26**: Default sort: `createdAt` DESC
- [ ] **AC27**: Sort được giữ trong URL (`?sortBy=fullName&sortOrder=asc`)

### Pagination

- [ ] **AC28**: Pagination controls ở dưới table:
  - Previous / Next buttons
  - Page numbers (1, 2, 3, ..., 10)
  - Ellipsis cho nhiều pages (...) 
- [ ] **AC29**: Page size selector: 10, 20 (default), 50, 100
- [ ] **AC30**: Hiển thị "Showing 1-20 of 123 customers"
- [ ] **AC31**: Page number trong URL (`?page=2&pageSize=20`)

### Empty & Loading States

- [ ] **AC32**: Loading state: Skeleton rows (5 rows)
- [ ] **AC33**: Empty state (no customers):
  - Icon illustration
  - Text: "Chưa có khách hàng nào"
  - Button: "Add First Customer"
- [ ] **AC34**: Empty search results:
  - Text: "Không tìm thấy khách hàng nào với từ khóa '{search}'"
  - Button: "Clear Search"

### Error Handling

- [ ] **AC35**: API error → Toast "Không thể tải danh sách khách hàng"
- [ ] **AC36**: Retry button trong error state

## Dữ liệu / Fields

### List Item (CustomerListItem)

| Trường | Kiểu | Nguồn | Ghi chú |
|--------|------|-------|---------|
| id | UUID | customers.id | PK |
| customerCode | String | customers.customer_code | CUS-XXXX |
| fullName | String | customers.full_name | Display name |
| email | String | customers.email | |
| phone | String | customers.phone | |
| customerType | Enum | customers.customer_type | individual/company |
| status | Enum | customers.status | active/inactive/suspended |
| companyName | String | companies.company_name | Nếu company customer |
| contactPersonName | String | customers.contact_person_name | Nếu company customer |
| createdAt | DateTime | customers.created_at | |

### Request Parameters

| Parameter | Type | Default | Ghi chú |
|-----------|------|---------|---------|
| page | Number | 1 | 1-indexed |
| pageSize | Number | 20 | 10, 20, 50, 100 |
| search | String | "" | Search term |
| status | Enum | "all" | all, active, inactive, suspended |
| type | Enum | "all" | all, individual, company |
| sortBy | String | "createdAt" | Column name |
| sortOrder | Enum | "desc" | asc, desc |

## API Contracts

### Get Customer List

```
GET /api/customers?page=1&pageSize=20&search=nguyen&status=active&type=individual&sortBy=fullName&sortOrder=asc
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid-1",
        "customerCode": "CUS-0001",
        "fullName": "Nguyen Van A",
        "email": "a@example.com",
        "phone": "0901234567",
        "customerType": "individual",
        "status": "active",
        "companyName": null,
        "contactPersonName": null,
        "createdAt": "2026-04-15T10:00:00Z"
      },
      {
        "id": "uuid-2",
        "customerCode": "CUS-0002",
        "fullName": "ABC Technology Co., Ltd",
        "email": "contact@abc.com",
        "phone": "0909876543",
        "customerType": "company",
        "status": "active",
        "companyName": "ABC Technology Co., Ltd",
        "contactPersonName": "Tran Thi B",
        "createdAt": "2026-04-14T09:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 123,
      "totalPages": 7
    }
  }
}
```

### Suspend Customer

```
PATCH /api/customers/{customerId}/suspend
Authorization: Bearer {token}

Request:
{
  "reason": "Payment overdue"
}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "suspended",
    "suspendedAt": "2026-04-17T10:00:00Z",
    "suspendReason": "Payment overdue"
  }
}
```

### Resume Customer

```
PATCH /api/customers/{customerId}/resume
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "active",
    "resumedAt": "2026-04-17T10:00:00Z"
  }
}
```

## Scenarios (Given / When / Then)

### Scenario 1: Xem danh sách customers

```gherkin
Given Manager đã đăng nhập
And Có 50 customers trong hệ thống

When Navigate to /customers

Then Table hiển thị 20 customers đầu tiên
And Pagination hiển thị "Showing 1-20 of 50"
And Default sort: createdAt DESC (mới nhất trước)
```

### Scenario 2: Search customer theo tên

```gherkin
Given Customer list đang hiển thị 50 customers
And Có 5 customers tên chứa "Nguyen"

When Nhập "Nguyen" vào search box
And Đợi 300ms (debounce)

Then Table chỉ hiển thị 5 customers có tên chứa "Nguyen"
And URL updated to ?search=Nguyen
And Pagination cập nhật theo kết quả search
```

### Scenario 3: Search customer theo customer code

```gherkin
Given Customer "CUS-0025" tồn tại

When Nhập "CUS-0025" vào search box

Then Table hiển thị chính xác 1 customer với code "CUS-0025"
```

### Scenario 4: Filter theo status + type

```gherkin
Given Customer list có mix Individual và Company, status khác nhau

When Chọn filter Status = "Active"
And Chọn filter Type = "Company"

Then Table chỉ hiển thị Company customers với status Active
And Filter chips hiển thị: [Active] [Company]
And URL: ?status=active&type=company
```

### Scenario 5: Sort theo tên

```gherkin
Given Customer list đang hiển thị (default sort: createdAt DESC)

When Click header cột "Name"

Then Table sort theo fullName ASC (A → Z)
And Sort icon ▲ hiển thị trên cột Name
And URL: ?sortBy=fullName&sortOrder=asc

When Click lại header cột "Name"

Then Table sort theo fullName DESC (Z → A)
And Sort icon ▼ hiển thị
```

### Scenario 6: Pagination navigation

```gherkin
Given 100 customers trong hệ thống
And PageSize = 20

When Click page 3

Then Table hiển thị customers 41-60
And "Showing 41-60 of 100"
And URL: ?page=3

When Click "Next"

Then Table hiển thị customers 61-80
And Page 4 được highlight
```

### Scenario 7: Suspend customer (Admin only)

```gherkin
Given Admin đã đăng nhập
And Customer "CUS-0010" status = "active"

When Click Actions dropdown của customer "CUS-0010"
And Click "Suspend"
And Nhập reason "Payment overdue"
And Confirm

Then Customer "CUS-0010" status → "suspended"
And Badge đổi thành đỏ "Suspended"
And Toast: "Khách hàng đã bị tạm ngưng"
```

### Scenario 8: Empty search results

```gherkin
Given Customer list có 50 customers

When Search "xyz123abc" (không match)

Then Table hiển thị empty state
And Message: "Không tìm thấy khách hàng nào với từ khóa 'xyz123abc'"
And Button "Clear Search"
```

### Scenario 9: Navigate to customer details

```gherkin
Given Customer "CUS-0001" hiển thị trong table

When Click vào row của "CUS-0001"

Then Navigate to /customers/{id}
And Customer Details page hiển thị
```

## UI/UX Guidelines

### Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Sidebar │ Main Content                                          │
│         │                                                       │
│ [≡]     │ Khách hàng                          [+ Add Customer]  │
│ Dashboard│ 123 khách hàng                                       │
│ Customers│                                                      │
│ ...     │ ┌─────────────────────────────────────────────────┐   │
│         │ │ 🔍 Tìm kiếm theo tên, email, phone...    [X]    │   │
│         │ └─────────────────────────────────────────────────┘   │
│         │                                                       │
│         │ Filters: [Status ▼] [Type ▼]  Chips: [Active] [X]     │
│         │                                                       │
│         │ ┌─────────────────────────────────────────────────┐   │
│         │ │ Code▼  │ Name▼ │ Email │ Phone │ Type │ Status │   │
│         │ ├────────┼───────┼───────┼───────┼──────┼────────┤   │
│         │ │CUS-0001│Nguyen │a@...  │0901.. │      │ Active │   │
│         │ │CUS-0002│ABC Co │b@...  │0909.. │COMPANY│ Active │   │
│         │ │CUS-0003│Tran   │c@...  │0912.. │      │Inactive│   │
│         │ │...     │...    │...    │...    │...   │...     │   │
│         │ └─────────────────────────────────────────────────┘   │
│         │                                                       │
│         │ Showing 1-20 of 123        [10▼]  < 1 2 3 ... 7 >     │
│         │                                                       │
└─────────────────────────────────────────────────────────────────┘
```

### Design Tokens

- Page container: `p-6 max-w-7xl mx-auto`
- Search input: `w-full md:w-96 px-4 py-3 pl-10 border border-slate-300 rounded-xl`
- Filter dropdown: `bg-white border border-slate-300 rounded-xl shadow-sm`
- Filter chip: `px-3 py-1 bg-slate-100 rounded-full text-sm flex items-center gap-1`
- Table container: `bg-white rounded-2xl shadow-sm border border-slate-200`
- Table header: `bg-slate-50 text-xs font-medium text-slate-500 uppercase`
- Table row hover: `hover:bg-slate-50 cursor-pointer`
- Badge (active): `px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full`
- Badge (inactive): `px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full`
- Badge (suspended): `px-2 py-0.5 bg-rose-100 text-rose-700 text-xs rounded-full`
- Badge (company): `px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full`
- Pagination button: `px-3 py-2 border rounded-lg hover:bg-slate-50`
- Primary button: `bg-[#b11e29] text-white rounded-xl hover:bg-[#8f1821]`

## Technical Notes

### URL State Management

```typescript
// useCustomerListParams hook
interface CustomerListParams {
  page: number;
  pageSize: number;
  search: string;
  status: 'all' | 'active' | 'inactive' | 'suspended';
  type: 'all' | 'individual' | 'company';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

function useCustomerListParams(): [CustomerListParams, (params: Partial<CustomerListParams>) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const params: CustomerListParams = {
    page: parseInt(searchParams.get('page') || '1'),
    pageSize: parseInt(searchParams.get('pageSize') || '20'),
    search: searchParams.get('search') || '',
    status: searchParams.get('status') as any || 'all',
    type: searchParams.get('type') as any || 'all',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') as any || 'desc'
  };
  
  // ... update logic
}
```

### Debounced Search

```typescript
// useDebounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}
```

### TanStack Query Implementation

```typescript
// useCustomers hook
function useCustomers(params: CustomerListParams) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customersService.getList(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    keepPreviousData: true // Smooth pagination
  });
}
```

## Dependencies

**Phụ thuộc vào:**
- EP-01: Authentication (cần login, role check)
- F-16: Customer Profile (tạo customer)

**Được sử dụng bởi:**
- F-18: Customer Details (navigate from list)
- EP-04: Booking (select customer for booking)
- EP-05: Contract (select customer for contract)

## Ghi chú

- URL state management đảm bảo shareable links + browser back/forward
- `keepPreviousData: true` trong React Query giúp UX mượt khi paginate
- Search debounce 300ms cân bằng giữa responsiveness và API calls
- Company customers có thể có nhiều employees, nhưng list chỉ hiển thị primary contact
