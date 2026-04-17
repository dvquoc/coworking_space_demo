# F-83 – Manager Dashboard (Bảng điều khiển Quản lý Vận hành)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-83 |
| Epic | EP-11 - Role-based Dashboards |
| Độ ưu tiên | Must have ⭐ CRITICAL |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Dashboard dành riêng cho **Manager (Quản lý vận hành)** — trang landing sau khi đăng nhập. Tập trung vào hoạt động vận hành hàng ngày: booking hôm nay, check-in/check-out, yêu cầu khách hàng đang chờ xử lý, và hợp đồng sắp hết hạn cần gia hạn. Manager cần thông tin ngay lập tức để lên kế hoạch công việc trong ngày.

**Business Rationale:**
- **Daily operations**: Manager bắt đầu ngày làm việc từ dashboard — nắm rõ tình hình để assign task cho nhân viên
- **Proactive management**: Thấy trước hợp đồng hết hạn (30 ngày) để chủ động liên hệ gia hạn
- **Customer service**: Yêu cầu khách đang chờ không bị bỏ sót
- **Utilization tracking**: Theo dõi tỷ lệ sử dụng space để tối ưu tài nguyên

**Business Rules:**
- Dashboard chỉ accessible cho role `manager`
- "Hôm nay" tính theo múi giờ `Asia/Ho_Chi_Minh` (GMT+7)
- "Upcoming bookings" hiển thị: hôm nay + 3 ngày tiếp theo
- "Expiring contracts" hiển thị: hợp đồng hết hạn trong vòng 30 ngày
- Pending Requests = tổng yêu cầu có status `pending` hoặc `pending_approval`
- Manager có thể xem toàn bộ dữ liệu nhưng một số actions cần confirm

**Out of Scope:**
- Quản lý nhân sự/ca làm việc → EP-09
- Báo cáo chi tiết → EP-10
- Real-time floor plan view → Phase 2
- Push notification → Phase 2

## User Story

> Là **Manager**, tôi muốn **xem tổng quan vận hành hôm nay — bookings, check-ins, yêu cầu khách và hợp đồng sắp hết hạn** để **lên kế hoạch công việc và đảm bảo không bỏ sót việc quan trọng**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Routing & Access Control

- [ ] **AC1**: Route `/dashboard/manager` chỉ accessible cho role `manager`
- [ ] **AC2**: Sau khi login, user với role `manager` tự động redirect về `/dashboard/manager`
- [ ] **AC3**: Ngày hiện tại hiển thị rõ ràng trong header (VD: "Thứ Sáu, 17/04/2026")

### KPI Cards

- [ ] **AC4**: Hiển thị 4 KPI cards:
  - **Today's Bookings**: Tổng số booking có ngày sử dụng là hôm nay
  - **Check-ins Today**: Số check-in đã thực hiện hôm nay
  - **Check-outs Today**: Số check-out đã thực hiện hôm nay
  - **Pending Requests**: Số yêu cầu đang chờ xử lý (booking/service/complaint)
- [ ] **AC5**: KPI "Pending Requests" có badge đỏ nếu > 0, nhấp vào scroll xuống widget Pending Requests
- [ ] **AC6**: KPI cards cập nhật real-time mỗi 5 phút (polling)

### Charts

- [ ] **AC7**: **Weekly Booking Trend** (Line chart):
  - Hiển thị 7 ngày gần nhất (T2 → CN hoặc theo ngày thực tế)
  - Hôm nay highlight bằng điểm lớn hơn trên line
  - Hover: tooltip hiện số booking chính xác
- [ ] **AC8**: **Space Utilization by Floor** (Bar chart — Horizontal):
  - Mỗi bar là 1 tầng (label: "Tầng 1 - Cobi A", "Tầng 2 - Cobi A"...)
  - Giá trị: % tỷ lệ lấp đầy của tầng đó
  - Màu bar theo threshold: xanh ≥ 70%, vàng 50-69%, đỏ < 50%
- [ ] **AC9**: **Top 5 Customers by Revenue** (List/Ranking):
  - Hiển thị top 5 khách hàng đóng góp doanh thu nhiều nhất tháng hiện tại
  - Columns: Rank, Tên khách, Loại space, Doanh thu tháng
  - Click vào khách → navigate to customer detail

### Widgets

- [ ] **AC10**: **Upcoming Bookings** (Table — hôm nay + 3 ngày tới):
  - Columns: Thời gian, Khách hàng, Space, Trạng thái (confirmed/pending)
  - Sort: Mới nhất lên trước, hôm nay trên cùng
  - Status `pending` highlight màu vàng
  - Click row → navigate to booking detail
  - Phân trang 10 items, hoặc "Xem thêm" button
- [ ] **AC11**: **Expiring Contracts** (Alert list — hết hạn trong 30 ngày):
  - Columns: Khách hàng, Space, Ngày hết hạn, Còn lại (X ngày)
  - Còn ≤ 7 ngày: màu đỏ + icon ⚠️
  - Còn 8–30 ngày: màu vàng + icon ⏰
  - Button "Liên hệ" → mở form gửi email/ghi chú cho khách
  - Empty state: "Không có hợp đồng hết hạn trong 30 ngày tới"
- [ ] **AC12**: **Recent Customer Inquiries** (List — 5 gần nhất):
  - Hiển thị 5 yêu cầu/khiếu nại gần nhất từ khách hàng
  - Columns: Khách, Loại yêu cầu, Thời gian, Trạng thái
  - Click → navigate to inquiry detail / customer page

### Quick Actions

- [ ] **AC13**: Button **"Tạo Booking"** → navigate to `/bookings/create`
- [ ] **AC14**: Button **"Thêm Khách hàng"** → navigate to `/customers/create`
- [ ] **AC15**: Button **"Xem Lịch"** → navigate to `/bookings/calendar`

### Loading & Error States

- [ ] **AC16**: Skeleton loading cho toàn bộ dashboard khi khởi tạo
- [ ] **AC17**: Mỗi widget độc lập — lỗi một widget không ảnh hưởng widget khác
- [ ] **AC18**: Nút Retry local trên mỗi widget lỗi

## Dữ liệu / Fields

| Trường | Kiểu | Nguồn | Ghi chú |
|--------|------|-------|---------|
| todayBookings | Number | COUNT(bookings WHERE date=today) | |
| checkInsToday | Number | COUNT(bookings WHERE checkedInAt IS NOT NULL AND date=today) | |
| checkOutsToday | Number | COUNT(bookings WHERE checkedOutAt IS NOT NULL AND date=today) | |
| pendingRequests | Number | COUNT(requests WHERE status IN [pending, pending_approval]) | |
| bookingByDay | Array<{date, count}> | 7 ngày gần nhất | Line chart |
| utilizationByFloor | Array<{floorId, floorLabel, buildingName, rate}> | Real-time | Bar chart |
| topCustomers | Array<{rank, name, spaceType, revenue}> | Tháng hiện tại | |
| upcomingBookings | Array<Booking> | Hôm nay + 3 ngày | Pagination |
| expiringContracts | Array<Contract> | Hết hạn ≤ 30 ngày | Sort by expiry ASC |
| recentInquiries | Array<Inquiry> | 5 gần nhất | |

## API Contract

```
GET /api/dashboard/manager
Authorization: Bearer {token}
Role: manager

Response 200:
{
  "kpis": {
    "todayBookings": 18,
    "checkInsToday": 12,
    "checkOutsToday": 5,
    "pendingRequests": 7
  },
  "charts": {
    "bookingByDay": [
      { "date": "2026-04-11", "count": 14 },
      ...
      { "date": "2026-04-17", "count": 18 }
    ],
    "utilizationByFloor": [
      { "floorId": "f1", "floorLabel": "Tầng 1", "buildingName": "Cobi Tower A", "rate": 85.0 },
      ...
    ]
  },
  "topCustomers": [
    { "rank": 1, "customerId": "c1", "name": "Công ty ABC", "spaceType": "private_office", "revenue": 45000000 }
  ],
  "upcomingBookings": [
    {
      "id": "bk1",
      "startTime": "2026-04-17T09:00:00+07:00",
      "endTime": "2026-04-17T17:00:00+07:00",
      "customerName": "Nguyễn Anh",
      "spaceName": "Office 201",
      "status": "confirmed"
    }
  ],
  "expiringContracts": [
    {
      "id": "ct1",
      "customerName": "Công ty XYZ",
      "spaceName": "Office 302",
      "expiryDate": "2026-04-24",
      "daysRemaining": 7
    }
  ],
  "recentInquiries": [
    {
      "id": "inq1",
      "customerName": "Trần Thị B",
      "type": "service_request",
      "createdAt": "2026-04-17T08:00:00+07:00",
      "status": "pending"
    }
  ]
}
```

## Scenarios

**Scenario 1: Manager bắt đầu ngày làm việc**
```
Given User "manager@cobi.vn" đăng nhập lúc 08:00
When Redirect đến /dashboard/manager
Then Hiển thị ngày: "Thứ Sáu, 17/04/2026"
And KPI cards: Bookings hôm nay (18), Check-ins (12), Check-outs (5), Pending (7)
And Upcoming Bookings hiển thị 10 booking đầu tiên
And Expiring Contracts: 2 hợp đồng hết hạn trong 7 ngày (màu đỏ)
```

**Scenario 2: Hợp đồng sắp hết hạn — liên hệ khách**
```
Given Expiring Contracts widget có hợp đồng "Công ty XYZ - Office 302" còn 3 ngày
When Manager click "Liên hệ"
Then Mở modal/form với thông tin khách được pre-fill
And Manager nhập ghi chú: "Liên hệ gia hạn hợp đồng"
And Submit → tạo inquiry/note gắn với khách hàng đó
And Toast: "Đã ghi nhận liên hệ"
```

**Scenario 3: Pending Requests = 0 — ngày nhàn rỗi**
```
Given Tất cả yêu cầu đã được xử lý
When Dashboard load
Then KPI "Pending Requests" = 0, không có badge đỏ
And Widget "Recent Inquiries" hiển thị empty state
And Manager vẫn thấy upcoming bookings và expiring contracts
```

**Scenario 4: Check tỷ lệ lấp đầy theo tầng**
```
Given Space Utilization chart hiển thị
When Nhìn vào "Tầng B1 - Cobi A" có rate = 30% (màu đỏ)
Then Manager biết tầng hầm ít khách → có thể xem xét promotion
And Click bar → navigate to /properties/floors?buildingId=...
```

**Scenario 5: Click khách trong Top 5**
```
Given Top Customers list hiển thị "Công ty ABC" rank 1
When Click vào row
Then Navigate to /customers/{id} — trang chi tiết khách hàng
```

**Scenario 6: Tạo booking nhanh từ dashboard**
```
Given Manager nhìn thấy Quick Action "Tạo Booking"
When Click
Then Navigate to /bookings/create với form trống
And Sau khi submit booking → quay lại dashboard, KPI Today's Bookings tăng 1
```

## Phụ thuộc (Dependencies)

**Phụ thuộc vào:**
- EP-01: Authentication & role-based routing
- EP-02: Property data (floors, spaces cho utilization chart)
- EP-03: Customer data (top customers, inquiries)
- EP-04: Booking data (today's bookings, upcoming, check-in/out)
- EP-05: Contract data (expiring contracts)

**Được sử dụng bởi:**
- `/bookings/create` — Quick action target
- `/customers/create` — Quick action target
- `/bookings/calendar` — Quick action target

## Out of Scope

- Assign task cho nhân viên từ dashboard → EP-09
- Báo cáo chi tiết doanh thu → EP-06/EP-10
- Real-time floor map → Phase 2
- Gửi email trực tiếp từ dashboard → Phase 2 (hiện tại chỉ tạo ghi chú)

## Màn hình / Luồng liên quan

- **Route**: `/dashboard/manager`
- **Layout**: Header ngày + 4 KPIs → 2 charts (line + bar) → 3 widgets (Upcoming | Expiring | Inquiries) → Quick Actions
- **Date header**: Hiển thị ngày giờ hiện tại — cập nhật mỗi phút

## Ghi chú

- **Timezone**: Luôn dùng `Asia/Ho_Chi_Minh` (UTC+7) cho tất cả so sánh ngày "hôm nay"
- **Recharts**: Bar chart horizontal dùng `<BarChart layout="vertical">` 
- **Expiring contracts**: Sort `expiryDate ASC` — gần nhất lên trên
- **Mock data**: `useManagerDashboard()` hook trả về hardcoded data khi `VITE_MOCK_API=true`
- **Polling**: `refetchInterval: 300000` (5 phút) cho KPI cards
