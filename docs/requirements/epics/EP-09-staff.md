# EP-09 – Staff & Permission Management

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-09 |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 3 - Advanced Features |
| Độ ưu tiên | Should have |

## Mô tả

Quản lý nhân sự (staff) và phân quyền chi tiết. Tạo staff accounts, assign roles (6 roles), quản lý permissions (CRUD permissions per module), theo dõi staff activity logs.

## Features thuộc Epic này

### Phase 3 Features

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-71 | Staff management | CRUD staff accounts | Draft |
| F-72 | Role assignment | Gán roles cho staff | Draft |
| F-73 | Permission matrix | Chi tiết permissions per module | Draft |
| F-74 | Activity logs | Theo dõi staff actions | Draft |

## Data Models

### Staff
```typescript
interface Staff {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;               // Investor, Admin, Manager, etc.
  buildingIds: string[];        // Staff quản lý buildings nào
  
  // Status
  status: 'active' | 'inactive';
  isEmailVerified: boolean;
  
  // Metadata
  createdAt: Date;
  lastLoginAt?: Date;
}
```

### Permission
```typescript
interface Permission {
  role: UserRole;
  module: string;               // "customers", "bookings", "invoices"
  actions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
}
```

### ActivityLog
```typescript
interface ActivityLog {
  id: string;
  userId: string;
  action: string;               // "created_booking", "deleted_customer"
  module: string;               // "bookings"
  targetId?: string;            // ID of affected entity
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}
```

## User Stories

### US-71: Add staff account
> Là **Admin**, tôi muốn **thêm staff account** để **cho phép nhân viên access hệ thống**

**Acceptance Criteria**:
- [ ] Form: email, fullName, phone, role, buildings
- [ ] Send invitation email with temporary password
- [ ] Staff login → must change password

### US-72: Assign role with permissions
> Là **Admin**, tôi muốn **gán role cho staff** để **kiểm soát quyền truy cập**

**Acceptance Criteria**:
- [ ] Select role: Manager, Kế toán, Sale, Bảo trì
- [ ] Role có permissions mặc định
- [ ] View permission matrix per role

### US-73: View activity logs
> Là **Admin**, tôi muốn **xem activity logs** để **audit actions**

**Acceptance Criteria**:
- [ ] Filter by staff, module, date range
- [ ] Logs show: timestamp, user, action, target

## Phụ thuộc

**Phụ thuộc vào**:
- EP-01: Auth

## Out of Scope
- Custom permission builder (Phase 1-2 dùng role-based cố định)

## Ghi chú
- Phase 3 vì Phase 1-2 đủ với role-based access cơ bản
