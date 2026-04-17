# F-19A – Quản lý nhân viên công ty (Company Employees Management)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-19A |
| Epic | EP-03 - Customer Management |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Mỗi **Company customer** có thể có nhiều **nhân viên** (employees). Nhân viên là những người được ủy quyền sử dụng các dịch vụ coworking space thay mặt công ty. Feature này cho phép quản lý danh sách nhân viên và quyền hạn của họ.

**Business Rationale:**
- **Delegate Access**: Công ty có nhiều người, không chỉ contact person
- **Access Control**: Phân quyền ai được book, ai được access portal
- **Billing Centralization**: Mọi booking của employees đều tính về công ty
- **Access Card Management**: Mỗi employee có thể có access card riêng

**Employee Types:**
| Type | Description |
|------|-------------|
| Representative | Đại diện pháp lý, quyền highest |
| Admin | Quản lý booking, invoice của công ty |
| Regular | Nhân viên thường, có thể book nếu được phép |

**Permissions:**
| Permission | Description |
|------------|-------------|
| canBookSpaces | Có quyền đặt chỗ |
| canViewInvoices | Xem hóa đơn công ty |
| canManageEmployees | Thêm/sửa nhân viên khác |
| hasAccessCard | Có thẻ ra vào |

**Business Rules:**
- Mỗi công ty phải có ít nhất 1 employee type="representative"
- Representative không thể bị deactivate nếu là người duy nhất
- Employee code format: `EMP-{companyCode}-{sequence}` (VD: EMP-COM-0001-001)
- Email employee phải unique trong company
- Deactivate employee → revoke access card

**Out of Scope:**
- Employee self-registration → Phase 2
- Employee portal access → EP-09 (Phase 2)
- Access card physical management → External system

## User Story

> Là **Manager**, tôi muốn **quản lý danh sách nhân viên của công ty khách hàng** để **kiểm soát ai được sử dụng dịch vụ**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Access & Navigation

- [ ] **AC1**: Tab "Employees" trong Customer Details (F-18) chỉ hiển thị cho company customers
- [ ] **AC2**: Route: `/customers/{customerId}?tab=employees`
- [ ] **AC3**: Roles có quyền: `admin`, `manager`, `sale`
- [ ] **AC4**: Accountant chỉ xem, không thể add/edit

### Employees List

- [ ] **AC5**: Table hiển thị employees:
  | Cột | Ghi chú |
  |-----|---------|
  | Employee Code | EMP-COM-0001-001 |
  | Name | Họ tên |
  | Email | Email cá nhân |
  | Phone | SĐT |
  | Type | Representative/Admin/Regular |
  | Permissions | Icons hoặc badges |
  | Status | active/inactive |
  | Actions | Edit, Deactivate |

- [ ] **AC6**: Filter: All / Active / Inactive
- [ ] **AC7**: Default sort: Type (Rep > Admin > Regular), then Name
- [ ] **AC8**: Empty state: "Chưa có nhân viên nào. Thêm nhân viên đầu tiên."

### Add Employee

- [ ] **AC9**: Button "Thêm nhân viên" → slide-over panel
- [ ] **AC10**: Form fields:
  | Field | Type | Required | Validation |
  |-------|------|----------|------------|
  | firstName | text | Yes | 1-50 chars |
  | lastName | text | Yes | 1-50 chars |
  | email | email | Yes | Valid email, unique trong company |
  | phone | text | No | Phone format |
  | type | select | Yes | representative/admin/regular |
  | canBookSpaces | checkbox | No | Default: true |
  | canViewInvoices | checkbox | No | Default: false |
  | canManageEmployees | checkbox | No | Default: false |
  | hasAccessCard | checkbox | No | Default: false |
  | accessCardNumber | text | Conditional | Required if hasAccessCard |

- [ ] **AC11**: Type = "representative" tự động enable tất cả permissions
- [ ] **AC12**: Save → employee code auto-generate
- [ ] **AC13**: Toast: "Đã thêm nhân viên {name}"

### Edit Employee

- [ ] **AC14**: Click employee row hoặc Edit icon → slide-over panel
- [ ] **AC15**: Form pre-fill dữ liệu hiện tại
- [ ] **AC16**: Không thể đổi employee code
- [ ] **AC17**: Không thể đổi type của representative (nếu là rep duy nhất)
- [ ] **AC18**: Save → update employee
- [ ] **AC19**: Validation như Add

### Deactivate Employee

- [ ] **AC20**: Action "Deactivate" → confirm dialog
- [ ] **AC21**: Warning nếu employee có upcoming bookings
- [ ] **AC22**: Cannot deactivate nếu:
  - Là representative duy nhất còn active
- [ ] **AC23**: Deactivate:
  - `status` → "inactive"
  - Nếu `hasAccessCard`: revoke card (log action)
  - Cancel upcoming bookings? (option in dialog)
- [ ] **AC24**: Sau deactivate, row màu xám, action → "Reactivate"

### Reactivate Employee

- [ ] **AC25**: Action "Reactivate" → employee status = "active"
- [ ] **AC26**: Access card cần re-issue manually (không tự động restore)

### Delete Employee

- [ ] **AC27**: Admin only: Delete button
- [ ] **AC28**: Confirm dialog: "Xóa sẽ xóa vĩnh viễn nhân viên này"
- [ ] **AC29**: Cannot delete representative duy nhất
- [ ] **AC30**: Delete → soft delete, không hiển thị trong list

### Permissions UI

- [ ] **AC31**: Permission badges/icons hiển thị trong list:
  - 📅 canBookSpaces
  - 📄 canViewInvoices  
  - 👥 canManageEmployees
  - 🎫 hasAccessCard

- [ ] **AC32**: Tooltip giải thích mỗi permission

### Employee Summary

- [ ] **AC33**: Summary stats ở đầu tab:
  - Total Employees
  - Active / Inactive
  - With Access Card

### Search & Quick Filter

- [ ] **AC34**: Search box: tìm theo name, email
- [ ] **AC35**: Quick filter by type

## Dữ liệu / Fields

### CompanyEmployee Entity

```typescript
interface CompanyEmployee {
  id: string;
  companyId: string;
  employeeCode: string;      // EMP-COM-0001-001
  firstName: string;
  lastName: string;
  fullName: string;          // computed
  email: string;
  phone?: string;
  type: 'representative' | 'admin' | 'regular';
  
  // Permissions
  canBookSpaces: boolean;
  canViewInvoices: boolean;
  canManageEmployees: boolean;
  hasAccessCard: boolean;
  accessCardNumber?: string;
  accessCardIssuedAt?: string;
  
  status: 'active' | 'inactive';
  
  // Metadata
  createdAt: string;
  createdBy: { id: string; name: string; };
  updatedAt: string;
  deactivatedAt?: string;
  deactivatedBy?: { id: string; name: string; };
}

// Request DTOs
interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  type: 'representative' | 'admin' | 'regular';
  canBookSpaces?: boolean;
  canViewInvoices?: boolean;
  canManageEmployees?: boolean;
  hasAccessCard?: boolean;
  accessCardNumber?: string;
}

interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  status?: 'active' | 'inactive';
}
```

### Employee Type Permissions Default

```typescript
const TYPE_DEFAULT_PERMISSIONS = {
  representative: {
    canBookSpaces: true,
    canViewInvoices: true,
    canManageEmployees: true,
    hasAccessCard: true
  },
  admin: {
    canBookSpaces: true,
    canViewInvoices: true,
    canManageEmployees: false,
    hasAccessCard: true
  },
  regular: {
    canBookSpaces: false,
    canViewInvoices: false,
    canManageEmployees: false,
    hasAccessCard: false
  }
};
```

## API Contracts

### List Employees

```
GET /api/customers/{customerId}/employees?filter=all&search=
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "employeeCode": "EMP-COM-0001-001",
        "firstName": "Tran Van",
        "lastName": "B",
        "fullName": "Tran Van B",
        "email": "b@company.com",
        "phone": "0902345678",
        "type": "representative",
        "canBookSpaces": true,
        "canViewInvoices": true,
        "canManageEmployees": true,
        "hasAccessCard": true,
        "accessCardNumber": "AC-00100",
        "status": "active",
        "createdAt": "2026-01-15T10:00:00Z"
      },
      {
        "id": "uuid",
        "employeeCode": "EMP-COM-0001-002",
        "firstName": "Le Thi",
        "lastName": "C",
        "fullName": "Le Thi C",
        "email": "c@company.com",
        "type": "regular",
        "canBookSpaces": true,
        "canViewInvoices": false,
        "canManageEmployees": false,
        "hasAccessCard": false,
        "status": "active"
      }
    ],
    "summary": {
      "total": 5,
      "active": 4,
      "inactive": 1,
      "withAccessCard": 3
    }
  }
}
```

### Create Employee

```
POST /api/customers/{customerId}/employees
Authorization: Bearer {token}

Request:
{
  "firstName": "Nguyen",
  "lastName": "Van D",
  "email": "d@company.com",
  "phone": "0903456789",
  "type": "regular",
  "canBookSpaces": true,
  "hasAccessCard": false
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "employeeCode": "EMP-COM-0001-003",
    "firstName": "Nguyen",
    "lastName": "Van D",
    "fullName": "Nguyen Van D",
    "email": "d@company.com",
    "type": "regular",
    "canBookSpaces": true,
    "canViewInvoices": false,
    "canManageEmployees": false,
    "hasAccessCard": false,
    "status": "active",
    "createdAt": "2026-04-17T10:00:00Z"
  }
}

Response 400:
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS_IN_COMPANY",
    "message": "Email này đã được sử dụng bởi nhân viên khác trong công ty"
  }
}
```

### Update Employee

```
PUT /api/customers/{customerId}/employees/{employeeId}
Authorization: Bearer {token}

Request:
{
  "firstName": "Nguyen",
  "lastName": "Van D",
  "canBookSpaces": true,
  "canViewInvoices": true,
  "hasAccessCard": true,
  "accessCardNumber": "AC-00150"
}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "employeeCode": "EMP-COM-0001-003",
    "fullName": "Nguyen Van D",
    "canViewInvoices": true,
    "hasAccessCard": true,
    "accessCardNumber": "AC-00150",
    "accessCardIssuedAt": "2026-04-17T10:00:00Z",
    "updatedAt": "2026-04-17T10:00:00Z"
  }
}
```

### Deactivate Employee

```
PATCH /api/customers/{customerId}/employees/{employeeId}/deactivate
Authorization: Bearer {token}

Request:
{
  "cancelUpcomingBookings": true,
  "reason": "Employee resigned"
}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "inactive",
    "deactivatedAt": "2026-04-17T10:00:00Z",
    "accessCardRevoked": true,
    "bookingsCancelled": 2
  }
}

Response 400:
{
  "success": false,
  "error": {
    "code": "CANNOT_DEACTIVATE_SOLE_REPRESENTATIVE",
    "message": "Không thể vô hiệu hóa đại diện duy nhất của công ty"
  }
}
```

### Reactivate Employee

```
PATCH /api/customers/{customerId}/employees/{employeeId}/reactivate
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "active",
    "hasAccessCard": false,
    "note": "Access card needs to be re-issued manually"
  }
}
```

### Delete Employee

```
DELETE /api/customers/{customerId}/employees/{employeeId}
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "deleted": true
  }
}

Response 400:
{
  "success": false,
  "error": {
    "code": "CANNOT_DELETE_SOLE_REPRESENTATIVE",
    "message": "Không thể xóa đại diện duy nhất của công ty"
  }
}
```

## Scenarios (Given / When / Then)

### Scenario 1: Xem employees list

```gherkin
Given Company customer "COM-0001" (ABC Technology) có 5 employees
And Manager đang xem Customer Details

When Click tab "Employees"

Then Table hiển thị 5 employees
And Summary: Total: 5, Active: 4, Inactive: 1, With Card: 3
And Sorted by Type (Rep first)
```

### Scenario 2: Add new employee - regular

```gherkin
Given Manager đang ở Employees tab của "COM-0001"

When Click "Thêm nhân viên"
And Nhập:
  - First Name: "Nguyen"
  - Last Name: "Van D"
  - Email: "d@company.com"
  - Type: Regular
  - Can Book Spaces: ✓
And Click "Lưu"

Then Employee mới xuất hiện trong list
And Employee code = "EMP-COM-0001-003"
And Toast: "Đã thêm nhân viên Nguyen Van D"
```

### Scenario 3: Add representative with all permissions

```gherkin
Given Manager thêm employee

When Select Type = "Representative"

Then Tất cả permissions tự động checked và disabled
And Permissions: canBookSpaces, canViewInvoices, canManageEmployees, hasAccessCard = true
```

### Scenario 4: Email duplicate validation

```gherkin
Given Company "COM-0001" đã có employee với email "b@company.com"

When Manager thêm employee mới với email "b@company.com"
And Click Save

Then Error: "Email này đã được sử dụng bởi nhân viên khác trong công ty"
And Form không submit
```

### Scenario 5: Deactivate employee with booking

```gherkin
Given Employee "EMP-COM-0001-002" có 2 upcoming bookings
And Manager click "Deactivate"

Then Dialog hiển thị:
  - "Nhân viên này có 2 booking sắp tới"
  - Checkbox: "Hủy các booking này"
  - Button: Deactivate

When Check "Hủy các booking này"
And Click "Deactivate"

Then Employee status → "inactive"
And 2 bookings cancelled
And Access card (if any) revoked
```

### Scenario 6: Cannot deactivate sole representative

```gherkin
Given Company "COM-0001" chỉ có 1 representative (active)

When Manager click "Deactivate" trên representative

Then Error toast: "Không thể vô hiệu hóa đại diện duy nhất của công ty"
And Action không thực hiện
```

### Scenario 7: Edit employee permissions

```gherkin
Given Employee "EMP-COM-0001-002" type = "regular"
And canViewInvoices = false

When Manager edit employee
And Check "Có quyền xem hóa đơn"
And Save

Then Employee.canViewInvoices = true
And Permission icon 📄 xuất hiện trong list
```

### Scenario 8: Issue access card

```gherkin
Given Employee "EMP-COM-0001-003" hasAccessCard = false

When Manager edit employee
And Check "Có thẻ ra vào"
And Nhập Access Card Number: "AC-00200"
And Save

Then hasAccessCard = true
And accessCardNumber = "AC-00200"
And accessCardIssuedAt có giá trị
And Icon 🎫 xuất hiện
```

## UI/UX Guidelines

### Employees Tab Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Employees                                    [+ Thêm nhân viên] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐        │
│ │   Total   │ │  Active   │ │ Inactive  │ │ Has Card  │        │
│ │     5     │ │     4     │ │     1     │ │     3     │        │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘        │
│                                                                 │
│ [All (5)] [Active (4)] [Inactive (1)]    🔍 Search...           │
├─────────────────────────────────────────────────────────────────┤
│ Code         │ Name        │ Email     │ Type │ Perms  │ Status│
├──────────────┼─────────────┼───────────┼──────┼────────┼───────┤
│ EMP-...-001  │ Tran Van B  │ b@...     │ Rep  │📅📄👥🎫│ Active│
│ EMP-...-002  │ Le Thi C    │ c@...     │ Admin│📅📄  🎫│ Active│
│ EMP-...-003  │ Nguyen D    │ d@...     │ Reg  │📅      │ Active│
│ EMP-...-004  │ Hoang E     │ e@...     │ Reg  │        │Inactive│
└─────────────────────────────────────────────────────────────────┘
```

### Add/Edit Employee Panel

```
┌─────────────────────────────────────────────────┐
│ Thêm nhân viên                              [X] │
├─────────────────────────────────────────────────┤
│                                                 │
│ Thông tin cơ bản                                │
│                                                 │
│ First Name *        Last Name *                 │
│ ┌──────────────┐   ┌──────────────┐             │
│ │              │   │              │             │
│ └──────────────┘   └──────────────┘             │
│                                                 │
│ Email *                                         │
│ ┌─────────────────────────────────────────────┐ │
│ │                                             │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Điện thoại                                      │
│ ┌─────────────────────────────────────────────┐ │
│ │                                             │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Vai trò *                                       │
│ ┌─────────────────────────────────────────────┐ │
│ │ Regular                                   ▼ │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Quyền hạn                                       │
│ [ ] Đặt chỗ (📅)                                │
│ [ ] Xem hóa đơn (📄)                            │
│ [ ] Quản lý nhân viên (👥)                      │
│ [ ] Có thẻ ra vào (🎫)                          │
│                                                 │
│ Số thẻ ra vào                                   │
│ ┌─────────────────────────────────────────────┐ │
│ │                                             │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
├─────────────────────────────────────────────────┤
│                           [Hủy]         [Lưu]   │
└─────────────────────────────────────────────────┘
```

### Design Tokens

- Stats cards: `grid grid-cols-4 gap-4`
- Table: như Customer List (F-17)
- Type badge:
  - Representative: `bg-amber-100 text-amber-700`
  - Admin: `bg-blue-100 text-blue-700`
  - Regular: `bg-slate-100 text-slate-600`
- Permission icons: `text-slate-400` (inactive), `text-slate-700` (active)
- Status inactive row: `opacity-50 bg-slate-50`
- Slide-over panel: `w-96 max-w-full`
- Permissions checkboxes: `space-y-2`

## Technical Notes

### Permission Icons Mapping

```typescript
const PERMISSION_ICONS = {
  canBookSpaces: { icon: Calendar, label: 'Đặt chỗ' },
  canViewInvoices: { icon: FileText, label: 'Xem hóa đơn' },
  canManageEmployees: { icon: Users, label: 'Quản lý NV' },
  hasAccessCard: { icon: CreditCard, label: 'Thẻ ra vào' }
};

function PermissionIcons({ employee }: { employee: CompanyEmployee }) {
  return (
    <div className="flex gap-1">
      {Object.entries(PERMISSION_ICONS).map(([key, { icon: Icon, label }]) => (
        <Tooltip key={key} content={label}>
          <Icon 
            className={cn(
              'w-4 h-4',
              employee[key] ? 'text-slate-700' : 'text-slate-300'
            )} 
          />
        </Tooltip>
      ))}
    </div>
  );
}
```

### Auto-set Permissions by Type

```typescript
const handleTypeChange = (type: EmployeeType) => {
  if (type === 'representative') {
    setValue('canBookSpaces', true);
    setValue('canViewInvoices', true);
    setValue('canManageEmployees', true);
    setValue('hasAccessCard', true);
  } else if (type === 'admin') {
    setValue('canBookSpaces', true);
    setValue('canViewInvoices', true);
    setValue('canManageEmployees', false);
    setValue('hasAccessCard', true);
  }
  // regular: keep user selection
};
```

### Employee Code Generation

```typescript
// Backend logic
async function generateEmployeeCode(companyCode: string): Promise<string> {
  const count = await db.employees.count({ where: { companyCode } });
  const sequence = String(count + 1).padStart(3, '0');
  return `EMP-${companyCode}-${sequence}`;
  // e.g., EMP-COM-0001-003
}
```

## Dependencies

**Phụ thuộc vào:**
- EP-01: Authentication (role check)
- F-16: Customer Profile (company customer)
- F-18: Customer Details (Employees tab)

**Được sử dụng bởi:**
- EP-04: Booking (employee can book for company)
- EP-08: Access Control (access card management)
- EP-09: Customer Portal (employee login) - Phase 2

## Ghi chú

- Company employees là những người được ủy quyền sử dụng dịch vụ
- Representative là người đại diện pháp lý, bắt buộc phải có
- Permissions granular giúp kiểm soát quyền hạn chi tiết
- Access card integration với hệ thống thẻ ra vào (external)
- Email unique trong company, nhưng có thể trùng với company khác
