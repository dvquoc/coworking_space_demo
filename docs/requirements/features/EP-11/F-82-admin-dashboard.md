# F-82 – Admin Dashboard (Bảng điều khiển Quản trị viên)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-82 |
| Epic | EP-11 - Role-based Dashboards |
| Độ ưu tiên | Must have ⭐ CRITICAL |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Dashboard dành riêng cho **Admin** — trang landing ngay sau khi đăng nhập. Cung cấp cái nhìn toàn diện về tình trạng hệ thống, hoạt động người dùng, và các cảnh báo bảo mật/vận hành. Admin cần nắm bắt ngay toàn bộ "sức khỏe" của hệ thống và hành động kịp thời.

**Business Rationale:**
- **System health**: Admin cần biết ngay nếu có sự cố (uptime thấp, disk đầy, backup lỗi)
- **Security monitoring**: Phát hiện đăng nhập bất thường, nhiều lần thất bại
- **User oversight**: Theo dõi hoạt động user để đảm bảo tuân thủ quy trình
- **Pending approvals**: Không để yêu cầu phê duyệt bị block quá lâu

**Business Rules:**
- Dashboard chỉ accessible cho role `admin`
- Audit log hiển thị 20 hoạt động gần nhất
- System alerts ưu tiên thứ tự: Critical → Warning → Info
- Pending Approvals hiển thị tất cả items cần admin xác nhận (user mới, thay đổi role...)
- Dữ liệu refresh mỗi 5 phút (polling)

**Out of Scope:**
- Real-time WebSocket alerts → Phase 2
- Custom alert rules configuration → Phase 3
- Log export → EP-10 Reporting

## User Story

> Là **Admin**, tôi muốn **xem tổng quan sức khỏe hệ thống và hoạt động người dùng** để **phát hiện kịp thời sự cố, bảo mật bất thường và xử lý các yêu cầu phê duyệt đang chờ**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Routing & Access Control

- [ ] **AC1**: Route `/dashboard/admin` chỉ accessible cho role `admin`
- [ ] **AC2**: Sau khi login, user với role `admin` tự động redirect về `/dashboard/admin`
- [ ] **AC3**: Role khác truy cập `/dashboard/admin` → redirect về dashboard tương ứng của role đó

### KPI Cards

- [ ] **AC4**: Hiển thị 4 KPI cards:
  - **Total Users**: Tổng số user trong hệ thống (tất cả role)
  - **Active Sessions**: Số session đang hoạt động tại thời điểm hiện tại
  - **System Uptime**: Uptime (%) của 30 ngày gần nhất (badge xanh ≥ 99%, vàng 95-99%, đỏ < 95%)
  - **Pending Approvals**: Số items đang chờ admin phê duyệt (badge đỏ nếu > 0)
- [ ] **AC5**: Click vào **Pending Approvals** card → scroll/navigate đến widget danh sách pending items
- [ ] **AC6**: Active Sessions count cập nhật mỗi 60 giây (polling)

### Widgets

- [ ] **AC7**: **Recent User Activities** (Audit Log Table):
  - Hiển thị 20 hoạt động gần nhất
  - Columns: Thời gian, User, Hành động, IP Address, Kết quả (Success/Failed)
  - Hành động Failed highlight màu đỏ
  - Link "View Full Audit Log" → `/admin/audit-logs`
- [ ] **AC8**: **System Alerts** widget:
  - Hiển thị tất cả alerts hiện tại theo priority (Critical trên cùng)
  - Mỗi alert: icon severity, message, thời gian, nút "Dismiss" (với xác nhận)
  - Alert types: disk_space, backup_failed, high_memory, ssl_expiry, service_down
  - Empty state: "✅ Không có alerts — hệ thống hoạt động bình thường"
- [ ] **AC9**: **User Login Statistics** widget:
  - Bar chart: Số login thành công/thất bại mỗi ngày (7 ngày gần nhất)
  - Summary: Tổng login tuần này, tỷ lệ thất bại
- [ ] **AC10**: **Pending Approvals** widget:
  - Danh sách items cần phê duyệt (tạo user mới, đổi role, xóa tài khoản)
  - Mỗi item: Avatar, Tên, Loại yêu cầu, Ngày yêu cầu, nút Approve/Reject
  - Empty state: "Không có yêu cầu nào đang chờ"

### Quick Actions

- [ ] **AC11**: Button **"Manage Users"** → navigate to `/admin/users`
- [ ] **AC12**: Button **"View Audit Logs"** → navigate to `/admin/audit-logs`
- [ ] **AC13**: Button **"System Settings"** → navigate to `/admin/settings`

### Loading & Error States

- [ ] **AC14**: Skeleton loading cho tất cả widgets khi trang khởi tạo
- [ ] **AC15**: Mỗi widget có error state độc lập (widget lỗi không ảnh hưởng widget khác)
- [ ] **AC16**: Toast notification khi dismiss alert thành công/thất bại

## Dữ liệu / Fields

| Trường | Kiểu | Nguồn | Ghi chú |
|--------|------|-------|---------|
| totalUsers | Number | COUNT(users) | Tất cả roles |
| activeSessions | Number | COUNT(active_sessions) | Real-time |
| systemUptime | Number (%) | Monitoring service | 30 ngày |
| pendingApprovals | Number | COUNT(approval_requests WHERE status=pending) | |
| recentActivities | Array<AuditLog> | audit_logs ORDER BY created_at DESC LIMIT 20 | |
| systemAlerts | Array<Alert> | alerts WHERE status=active | |
| loginStats | Array<{date, success, failed}> | 7 ngày gần nhất | |
| pendingItems | Array<ApprovalRequest> | approval_requests WHERE status=pending | |

## API Contract

```
GET /api/dashboard/admin
Authorization: Bearer {token}
Role: admin

Response 200:
{
  "kpis": {
    "totalUsers": 45,
    "activeSessions": 12,
    "systemUptime": 99.8,
    "pendingApprovals": 3
  },
  "recentActivities": [
    {
      "id": "act1",
      "timestamp": "2026-04-17T08:30:00Z",
      "userId": "u1",
      "userName": "manager@cobi.vn",
      "action": "LOGIN",
      "ipAddress": "192.168.1.10",
      "result": "success"
    }
  ],
  "systemAlerts": [
    {
      "id": "alert1",
      "severity": "warning",
      "message": "Disk usage at 85% on server-01",
      "timestamp": "2026-04-17T06:00:00Z"
    }
  ],
  "loginStats": [
    { "date": "2026-04-11", "success": 28, "failed": 2 },
    ...
  ],
  "pendingItems": [
    {
      "id": "apr1",
      "type": "new_user",
      "requesterName": "Nguyễn Văn A",
      "requestedRole": "manager",
      "requestedAt": "2026-04-16T14:00:00Z"
    }
  ]
}
```

## Scenarios

**Scenario 1: Admin đăng nhập và thấy alert nghiêm trọng**
```
Given User "admin@cobi.vn" vừa login
When Redirect đến /dashboard/admin
Then Skeleton loading hiển thị
And Sau khi load xong, System Alerts widget hiển thị:
  - [Critical] "Backup lỗi — Server-01 backup thất bại lúc 03:00 AM"
And Alert Critical có màu đỏ và icon ⚠️
And KPI "System Uptime" = 98.5% với badge màu vàng
```

**Scenario 2: Admin approve yêu cầu tạo user mới**
```
Given Pending Approvals = 3
When Admin click nút "Approve" trên yêu cầu "Nguyễn Văn A - Manager"
Then Confirm dialog: "Xác nhận phê duyệt tài khoản cho Nguyễn Văn A với role Manager?"
And Click Confirm → API call POST /api/approval-requests/{id}/approve
And Success → item biến mất khỏi danh sách
And Toast: "Đã phê duyệt tài khoản Nguyễn Văn A"
And KPI Pending Approvals giảm từ 3 xuống 2
```

**Scenario 3: Phát hiện login thất bại bất thường**
```
Given Login Stats chart hiển thị
When Ngày 16/04 có 15 login thất bại (thông thường < 3)
Then Bar "failed" ngày đó màu đỏ nổi bật
And Tooltip: "15 lần thất bại — kiểm tra audit log"
And Admin có thể click → filter audit log ngày đó
```

**Scenario 4: Dismiss system alert**
```
Given Alert "Disk usage 85%" đang hiển thị
When Admin click "Dismiss"
Then Confirm dialog: "Dismiss alert này? Nó sẽ không hiển thị lại trong 24 giờ"
And Xác nhận → alert ẩn khỏi widget
And Toast: "Alert đã được dismiss"
```

**Scenario 5: Không có pending approvals**
```
Given Tất cả yêu cầu đã được xử lý
When Dashboard load
Then Widget "Pending Approvals" hiển thị empty state:
  "✅ Không có yêu cầu nào đang chờ xử lý"
And KPI card "Pending Approvals" = 0 (không có badge đỏ)
```

**Scenario 6: Widget audit log lỗi độc lập**
```
Given API trả về lỗi cho phần recentActivities
When Dashboard load
Then KPI cards và các widget khác hiển thị bình thường
And Widget "Recent User Activities" hiển thị: "Không thể tải audit log" + nút Retry
```

## Phụ thuộc (Dependencies)

**Phụ thuộc vào:**
- EP-01 (F-01): Authentication & role-based routing
- EP-09: Staff/User management (approval requests)

**Được sử dụng bởi:**
- `/admin/users` — Quick action target
- `/admin/audit-logs` — Quick action target + widget link

## Out of Scope

- Thực hiện deploy, restart server từ dashboard → DevOps tooling
- Real-time alert push (WebSocket) → Phase 2
- Cấu hình ngưỡng alert → Phase 3
- Two-factor authentication management → EP-01 extension

## Màn hình / Luồng liên quan

- **Route**: `/dashboard/admin`
- **Layout**: 4 KPI cards → System Alerts (full-width) → 2 cột (Audit Log | Login Stats) → Pending Approvals → Quick Actions
- **Responsive**: Single column trên mobile

## Ghi chú

- **Polling**: Dùng `refetchInterval: 60000` trong TanStack Query cho Active Sessions
- **Alert severity colors**: Critical = `rose-600`, Warning = `amber-500`, Info = `blue-500`
- **Audit log table**: Dùng component table tái sử dụng từ EP-09
- **Mock data**: `useAdminDashboard()` trả về mock khi `VITE_MOCK_API=true`
