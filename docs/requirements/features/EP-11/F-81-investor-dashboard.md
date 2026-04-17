# F-81 – Investor Dashboard (Bảng điều khiển Nhà đầu tư)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-81 |
| Epic | EP-11 - Role-based Dashboards |
| Độ ưu tiên | Must have ⭐ CRITICAL |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Dashboard dành riêng cho **Nhà đầu tư (Investor)** — trang landing sau khi đăng nhập. Hiển thị các chỉ số tài chính và vận hành cấp cao giúp nhà đầu tư theo dõi hiệu suất kinh doanh, doanh thu, và tỷ lệ lấp đầy mà không cần đi sâu vào chi tiết vận hành.

**Business Rationale:**
- **Decision support**: Nhà đầu tư cần tổng quan nhanh để ra quyết định chiến lược (mở rộng, điều chỉnh giá, đầu tư thêm)
- **Transparency**: Báo cáo minh bạch về hiệu suất tài sản
- **Trend monitoring**: Phát hiện sớm xu hướng sụt giảm doanh thu hay occupancy
- **Report export**: Tạo báo cáo PDF để trình bày với các bên liên quan

**Business Rules:**
- Dashboard chỉ accessible cho role `investor`
- Dữ liệu mặc định hiển thị tháng hiện tại
- Revenue tính theo các invoice đã thanh toán (`status = paid`)
- Occupancy Rate = (Số spaces đang cho thuê) / (Tổng spaces active) × 100
- Profit Margin = (Revenue - Operating Costs) / Revenue × 100 (Operating Costs là giá trị ước tính)
- Nhà đầu tư chỉ có quyền **xem** (read-only), không thể chỉnh sửa dữ liệu

**Out of Scope:**
- Customizable widget layout → F-87 (Phase 2)
- Real-time data push (WebSocket) → Phase 2
- Comparison với thị trường bên ngoài → Phase 3
- Detail drill-down per building → EP-10 Reporting

## User Story

> Là **Nhà đầu tư**, tôi muốn **xem dashboard tóm tắt doanh thu, occupancy và hiệu suất tài chính** để **nắm bắt nhanh tình hình kinh doanh và đưa ra quyết định chiến lược**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Routing & Access Control

- [ ] **AC1**: Route `/dashboard/investor` chỉ accessible cho role `investor`
- [ ] **AC2**: Sau khi login thành công, user với role `investor` tự động redirect về `/dashboard/investor`
- [ ] **AC3**: Role khác cố truy cập `/dashboard/investor` → redirect về dashboard của role đó

### KPI Cards

- [ ] **AC4**: Hiển thị 4 KPI cards trong grid 2×2 (desktop) / 1 cột (mobile):
  - **Total Revenue (tháng)**: Tổng doanh thu tháng hiện tại (đơn vị VND, format `xxx,xxx,xxx`)
  - **Occupancy Rate**: Tỷ lệ lấp đầy (%, badge màu xanh nếu ≥ 70%, vàng nếu 50-69%, đỏ nếu < 50%)
  - **Active Customers**: Tổng số khách hàng đang có hợp đồng/booking active
  - **Monthly Profit Margin**: Biên lợi nhuận tháng (%)
- [ ] **AC5**: Mỗi KPI card hiển thị % change so với tháng trước (icon ▲ màu xanh / ▼ màu đỏ)
- [ ] **AC6**: Hover vào KPI card hiển thị tooltip giải thích công thức tính

### Charts

- [ ] **AC7**: **Revenue Trend Chart** (Line chart, 12 tháng gần nhất):
  - X-axis: Tháng (T1 đến T12 hoặc label tháng/năm)
  - Y-axis: Doanh thu (VND, format ngắn gọn: `450M`, `1.2B`)
  - Có thể hover để xem giá trị chính xác từng tháng
- [ ] **AC8**: **Occupancy by Building Chart** (Bar chart):
  - Mỗi cột là 1 tòa nhà
  - Y-axis: Tỷ lệ lấp đầy (%)
  - Màu bar: xanh lá ≥ 70%, vàng 50-69%, đỏ < 50%
- [ ] **AC9**: **Revenue by Space Type Chart** (Pie chart / Donut chart):
  - Phân bổ doanh thu theo loại space (Hot Desk, Private Office, Meeting Room, ...)
  - Legend hiển thị tên loại + % + giá trị
- [ ] **AC10**: Chart responsive — hiển thị đúng trên desktop và tablet

### Quick Links

- [ ] **AC11**: Button **"View Financial Reports"** → navigate to `/reports/financial` (EP-10)
- [ ] **AC12**: Button **"Export Revenue Report (PDF)"** → tải xuống file PDF báo cáo tháng hiện tại
  - File name: `revenue-report-YYYY-MM.pdf`
  - Nội dung: Revenue summary, occupancy trend, top 10 customers
- [ ] **AC13**: Quick links hiển thị trong section riêng biệt phía dưới charts

### Loading & Error States

- [ ] **AC14**: Skeleton loading hiển thị trong khi fetch dữ liệu
- [ ] **AC15**: Error state với nút "Retry" nếu API call thất bại
- [ ] **AC16**: Empty state nếu chưa có dữ liệu tháng hiện tại (tháng đầu tiên)

## Dữ liệu / Fields

| Trường | Kiểu | Nguồn | Ghi chú |
|--------|------|-------|---------|
| totalRevenue | Number (VND) | SUM(invoices.amount WHERE status=paid, month=current) | Tháng hiện tại |
| revenueChangePercent | Number (%) | So sánh vs tháng trước | ▲/▼ indicator |
| occupancyRate | Number (%) | COUNT(spaces active) / COUNT(spaces total) × 100 | Real-time |
| occupancyChange | Number (%) | So sánh vs tháng trước | |
| activeCustomers | Number | COUNT(customers WHERE hasActiveContract OR hasActiveBooking) | |
| customersChange | Number | So sánh vs tháng trước | |
| profitMargin | Number (%) | (Revenue - EstimatedCosts) / Revenue × 100 | Ước tính |
| revenueByMonth | Array<{month, amount}> | 12 tháng gần nhất | Dùng cho line chart |
| occupancyByBuilding | Array<{buildingId, name, rate}> | Theo từng tòa | Dùng cho bar chart |
| revenueBySpaceType | Array<{type, amount, percent}> | Theo loại space | Dùng cho pie chart |

## API Contract

```
GET /api/dashboard/investor
Authorization: Bearer {token}
Role: investor

Response 200:
{
  "kpis": {
    "totalRevenue": 450000000,
    "revenueChangePercent": 12.5,
    "occupancyRate": 78.0,
    "occupancyChange": 3.2,
    "activeCustomers": 142,
    "customersChange": 8,
    "profitMargin": 28.0,
    "profitMarginChange": -1.5
  },
  "charts": {
    "revenueByMonth": [
      { "month": "2025-05", "amount": 380000000 },
      ...
      { "month": "2026-04", "amount": 450000000 }
    ],
    "occupancyByBuilding": [
      { "buildingId": "b1", "name": "Cobi Tower A", "rate": 82.0 },
      { "buildingId": "b2", "name": "Cobi Tower B", "rate": 74.0 }
    ],
    "revenueBySpaceType": [
      { "type": "hot_desk", "label": "Hot Desk", "amount": 120000000, "percent": 26.7 },
      { "type": "private_office", "label": "Văn phòng riêng", "amount": 180000000, "percent": 40.0 },
      ...
    ]
  },
  "period": { "month": 4, "year": 2026 }
}
```

## Scenarios

**Scenario 1: Investor xem dashboard lần đầu**
```
Given User "investor@cobi.vn" đăng nhập thành công
When System xử lý login
Then Redirect đến /dashboard/investor
And Hiển thị skeleton loading (0.5s)
And Load KPI cards: Revenue 450M VND (+12.5%), Occupancy 78% (+3.2%)
And Hiển thị Revenue Trend chart 12 tháng
And Quick links "View Financial Reports" và "Export Revenue Report" visible
```

**Scenario 2: Occupancy thấp — cảnh báo**
```
Given Occupancy Rate hiện tại là 45%
When Dashboard load xong
Then KPI card "Occupancy Rate" hiển thị badge màu ĐỎ
And Hiển thị tooltip: "Tỷ lệ thấp — cần xem lại chiến lược marketing"
And Bar chart cột buildings liên quan màu đỏ
```

**Scenario 3: Export Revenue Report PDF**
```
Given Investor đang xem dashboard
When Click "Export Revenue Report (PDF)"
Then Hiển thị loading spinner trên button
And Sau 2-3s, tải file "revenue-report-2026-04.pdf"
And File chứa: Revenue summary, occupancy chart (ảnh), top 10 customers
And Nếu lỗi → toast "Không thể xuất báo cáo, vui lòng thử lại"
```

**Scenario 4: API lỗi**
```
Given API /api/dashboard/investor trả về 500
When Dashboard cố load
Then Hiển thị error state: "Không thể tải dữ liệu dashboard"
And Nút "Thử lại" hiển thị
And Click Thử lại → retry API call
```

**Scenario 5: Đầu tháng — chưa có dữ liệu**
```
Given Ngày 01/05/2026, chưa có invoice nào trong tháng 5
When Investor xem dashboard
Then KPI Revenue tháng hiện tại = 0 VND
And Hiển thị note: "Dữ liệu tháng 5/2026 đang được cập nhật"
And Charts hiển thị dữ liệu tháng trước bình thường
```

**Scenario 6: Role không phải investor truy cập**
```
Given User "manager@cobi.vn" với role Manager
When Cố truy cập /dashboard/investor
Then Redirect về /dashboard/manager
And Không hiển thị lỗi, chỉ redirect
```

## Phụ thuộc (Dependencies)

**Phụ thuộc vào:**
- EP-01 (F-01): Authentication & role-based routing
- EP-02: Property data (buildings, spaces cho occupancy)
- EP-04: Booking data (active bookings)
- EP-05: Contract data (active customers)
- EP-06: Invoice/Payment data (revenue)

**Được sử dụng bởi:**
- EP-10: Reporting — "View Financial Reports" link target

## Out of Scope

- Chỉnh sửa bất kỳ dữ liệu nào từ dashboard (read-only)
- So sánh với đối thủ cạnh tranh / benchmark ngành
- Dự báo (forecast) doanh thu → Phase 3
- Widget kéo thả tùy chỉnh → F-87 Phase 2
- Notification/alert tự động gửi email → Phase 2

## Màn hình / Luồng liên quan

- **Route**: `/dashboard/investor`
- **Layout**: Header (tên user + logout) + Main content (4 KPIs + 3 charts + quick links)
- **Responsive**: Grid 4 cột KPI (desktop) → 2 cột (tablet) → 1 cột (mobile)

## Ghi chú

- **Recharts**: Line chart dùng `<LineChart>`, Bar dùng `<BarChart>`, Pie dùng `<PieChart>` từ `recharts` (đã có trong stack)
- **Mock data**: `useInvestorDashboard()` hook trả về hardcoded data khi `VITE_MOCK_API=true`
- **Currency format**: Dùng `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`
- **PDF Export**: Phase 1 có thể dùng `window.print()` với CSS print stylesheet; Phase 2 dùng `pdfmake` hoặc backend PDF generation
