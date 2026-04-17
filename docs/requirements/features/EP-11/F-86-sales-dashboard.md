# F-86 – Sales Dashboard (Bảng điều khiển Kinh doanh)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-86 |
| Epic | EP-11 - Role-based Dashboards |
| Độ ưu tiên | Must have ⭐ CRITICAL |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Dashboard dành riêng cho **Nhân viên Kinh doanh (Sale)** — trang landing sau khi đăng nhập. Tập trung vào pipeline khách hàng tiềm năng (leads), tỷ lệ chuyển đổi, tiến độ đạt mục tiêu tháng, và các hoạt động sales cần thực hiện (tours, meetings sắp tới). Sale cần biết ngay mình đang ở đâu so với target và khách nào cần được ưu tiên theo đuổi.

**Business Rationale:**
- **Target tracking**: Sale cần biết rõ mình đạt bao nhiêu % target để điều chỉnh nỗ lực
- **Pipeline visibility**: Funnel chart cho thấy điểm "rò rỉ" trong quá trình chuyển đổi
- **Lead prioritization**: Danh sách leads theo status giúp biết ai cần được liên hệ tiếp theo
- **Activity reminder**: Tours và meetings sắp tới không bị bỏ lỡ
- **Performance insight**: Xem conversion trend để tự đánh giá hiệu quả

**Business Rules:**
- Dashboard chỉ accessible cho role `sale`
- "My leads" = leads được gán cho user hiện tại (`assignedTo = currentUserId`)
- Monthly Target = số khách hàng mới đạt trạng thái `closed_won` trong tháng
- Conversion Rate = (Closed Won / Total Leads received this month) × 100
- Lead funnel: `inquiry → contacted → tour_scheduled → proposal_sent → closed_won`
- Lead không tiến thêm sau 7 ngày → cảnh báo "Stale lead" trong danh sách

**Out of Scope:**
- Quản lý commission/hoa hồng → Phase 3
- Email campaign automation → Phase 2
- Team-level leaderboard → EP-09/Phase 2
- Deep CRM features → EP-12

## User Story

> Là **Nhân viên Kinh doanh**, tôi muốn **xem pipeline lead, tỷ lệ chuyển đổi, tiến độ target tháng và lịch tours sắp tới** để **ưu tiên đúng lead, không bỏ lỡ cuộc hẹn, và đạt mục tiêu doanh số**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Routing & Access Control

- [ ] **AC1**: Route `/dashboard/sales` chỉ accessible cho role `sale`
- [ ] **AC2**: Sau khi login, user với role `sale` tự động redirect về `/dashboard/sales`
- [ ] **AC3**: Hiển thị tên nhân viên sale và tháng làm việc hiện tại trong header

### KPI Cards

- [ ] **AC4**: Hiển thị 4 KPI cards:
  - **Active Leads**: Tổng số leads đang active (chưa closed/lost) được gán cho user
  - **Conversion Rate (tháng)**: Tỷ lệ chuyển đổi closed_won tháng hiện tại (%)
  - **New Customers (tháng)**: Số khách hàng mới closed_won tháng hiện tại
  - **Monthly Target Progress**: `X / Y customers` + progress bar (% đạt được)
- [ ] **AC5**: KPI "Monthly Target Progress" hiển thị progress bar:
  - Xanh lá ≥ 100%
  - Xanh lam 60–99%
  - Vàng 40–59%
  - Đỏ < 40%
- [ ] **AC6**: Mỗi KPI hiển thị % change so với tháng trước (ngoại trừ Monthly Target Progress)

### Charts

- [ ] **AC7**: **Lead Funnel Chart** (Funnel chart hoặc Horizontal Bar):
  - Các stages theo thứ tự: Inquiry → Contacted → Tour Scheduled → Proposal Sent → Closed Won
  - Mỗi stage hiển thị số lượng lead + % so với stage đầu (conversion từ inquiry)
  - Màu sắc gradient từ xanh đến xanh đậm theo funnel
  - Stage "Closed Won" màu xanh lá
  - Hover tooltip: số lượng + % drop-off so với stage trước
- [ ] **AC8**: **Monthly Conversion Trend** (Line chart — 6 tháng):
  - X-axis: 6 tháng gần nhất
  - Y-axis: Số closed_won (cột trái) + Conversion Rate % (cột phải, dashed line)
  - Tháng hiện tại highlight
- [ ] **AC9**: **Lead Source Breakdown** (Pie chart):
  - Segments: Website (xanh lam) / Referral (xanh lá) / Ads (cam) / Walk-in (tím) / Event (vàng)
  - Legend hiện số lượng + % mỗi nguồn
  - Giúp sale biết kênh nào hiệu quả nhất

### Widgets

- [ ] **AC10**: **My Leads** (Table — leads được gán cho user):
  - Columns: Tên/Công ty, Nguồn, Trạng thái, Ngày tạo, Ngày liên hệ cuối, Hành động
  - Status badge: `new` (xanh lam), `contacted` (vàng), `tour_scheduled` (cam), `proposal_sent` (tím), `closed_won` (xanh lá), `closed_lost` (đỏ xám)
  - Leads "stale" (không update > 7 ngày) highlight nền vàng nhạt + tooltip "Chưa cập nhật 7 ngày"
  - Filter: All / New / Contacted / Tour Scheduled / Proposal Sent
  - Nút "Cập nhật trạng thái" → inline select hoặc navigate to lead detail
  - Phân trang 10 items
- [ ] **AC11**: **Upcoming Tours & Meetings** (Timeline/List — 7 ngày tới):
  - Columns: Ngày giờ, Khách hàng/Lead, Loại (tour/meeting/call), Địa điểm, Trạng thái
  - Sắp xếp theo thời gian ASC (gần nhất lên trên)
  - Quá hạn highlight đỏ
  - Nút "Hoàn thành" → mark activity completed
  - Nút "Đặt lịch mới" → form tạo activity nhanh
- [ ] **AC12**: **Recent Closed Deals** (List — 5 deals gần nhất đã chốt):
  - Mỗi item: Tên khách hàng, Space, Giá trị hợp đồng, Ngày chốt
  - Dùng để motivate và làm reference cho deals tiếp theo
  - Link "Xem tất cả" → `/customers?status=active&source=sales`

### Quick Actions

- [ ] **AC13**: Button **"Thêm Lead"** → navigate to `/crm/leads/create`
- [ ] **AC14**: Button **"Đặt lịch Tour"** → navigate to `/crm/tours/create`
- [ ] **AC15**: Button **"Tạo Hợp đồng"** → navigate to `/contracts/create`

### Loading & Error States

- [ ] **AC16**: Skeleton loading khi trang khởi tạo
- [ ] **AC17**: Mỗi widget có error state độc lập + nút Retry
- [ ] **AC18**: Toast khi update lead status thành công: "Đã cập nhật trạng thái lead"

## Dữ liệu / Fields

| Trường | Kiểu | Nguồn | Ghi chú |
|--------|------|-------|---------|
| activeLeads | Number | COUNT(leads WHERE assignedTo=current AND status NOT IN [closed_won, closed_lost]) | |
| conversionRate | Number (%) | (closed_won this month / total leads received this month) × 100 | |
| newCustomers | Number | COUNT(leads WHERE status=closed_won AND closedAt month=current) | |
| monthlyTarget | Number | Config per user hoặc team target | |
| monthlyAchieved | Number | = newCustomers this month | |
| leadFunnel | Array<{stage, count, percent}> | GROUP BY status for current user | |
| conversionByMonth | Array<{month, closedWon, rate}> | 6 tháng gần nhất | |
| leadSourceBreakdown | Array<{source, count, percent}> | GROUP BY source, assignedTo=current | |
| myLeads | Array<Lead> | Paginated, assigned to current user | |
| upcomingActivities | Array<Activity> | assignedTo=current, due_in_7_days | |
| recentDeals | Array<Deal> | status=closed_won, assignedTo=current, LIMIT 5 | |

## API Contract

```
GET /api/dashboard/sales
Authorization: Bearer {token}
Role: sale

Response 200:
{
  "kpis": {
    "activeLeads": 45,
    "conversionRate": 18.0,
    "conversionRateChange": 2.5,
    "newCustomers": 12,
    "newCustomersChange": 3,
    "monthlyTarget": 15,
    "monthlyAchieved": 12,
    "targetPercent": 80.0
  },
  "charts": {
    "leadFunnel": [
      { "stage": "inquiry", "label": "Inquiry", "count": 67, "percent": 100 },
      { "stage": "contacted", "label": "Contacted", "count": 52, "percent": 77.6 },
      { "stage": "tour_scheduled", "label": "Tour Scheduled", "count": 31, "percent": 46.3 },
      { "stage": "proposal_sent", "label": "Proposal Sent", "count": 18, "percent": 26.9 },
      { "stage": "closed_won", "label": "Closed Won", "count": 12, "percent": 17.9 }
    ],
    "conversionByMonth": [
      { "month": "2025-11", "closedWon": 9, "rate": 15.0 },
      ...
      { "month": "2026-04", "closedWon": 12, "rate": 18.0 }
    ],
    "leadSourceBreakdown": [
      { "source": "website", "label": "Website", "count": 28, "percent": 41.8 },
      { "source": "referral", "label": "Giới thiệu", "count": 20, "percent": 29.9 },
      { "source": "ads", "label": "Quảng cáo", "count": 12, "percent": 17.9 },
      { "source": "walk_in", "label": "Ghé trực tiếp", "count": 7, "percent": 10.4 }
    ]
  },
  "myLeads": [
    {
      "id": "lead1",
      "name": "Nguyễn Thành Đạt",
      "company": "Startup ABC",
      "source": "website",
      "status": "tour_scheduled",
      "createdAt": "2026-04-10",
      "lastContactedAt": "2026-04-15",
      "isStale": false
    }
  ],
  "upcomingActivities": [
    {
      "id": "act1",
      "scheduledAt": "2026-04-18T10:00:00+07:00",
      "leadName": "Nguyễn Thành Đạt",
      "type": "tour",
      "location": "Cobi Tower A - Tầng 3",
      "status": "scheduled"
    }
  ],
  "recentDeals": [
    {
      "id": "deal1",
      "customerName": "Startup ABC",
      "spaceName": "Office 305",
      "contractValue": 18000000,
      "closedAt": "2026-04-14"
    }
  ]
}
```

## Scenarios

**Scenario 1: Sale kiểm tra tiến độ target đầu tháng**
```
Given User "sale@cobi.vn" đăng nhập ngày 01/04
When Redirect đến /dashboard/sales
Then KPI Monthly Target: "0 / 15 customers" — Progress bar 0% màu đỏ
And Funnel chart hiển thị leads tháng 4 (ban đầu là inquiry mới)
And Upcoming Activities gần như trống
And Recent Deals = 5 deals tháng 3 trước (để tham khảo)
```

**Scenario 2: Theo dõi stale lead**
```
Given Lead "Công ty XYZ" không được update từ 10 ngày trước
When My Leads list load
Then Row của lead đó có nền vàng nhạt
And Tooltip hover: "Chưa cập nhật trong 10 ngày"
And Status "contacted" nhưng không tiến triển
And Sale click "Cập nhật trạng thái" → chuyển sang "tour_scheduled"
```

**Scenario 3: Chốt deal — target tiến độ cập nhật**
```
Given Sale update lead "Nguyễn Thành Đạt" → status = closed_won
When Submit
Then Toast: "Chúc mừng! Đã chốt deal thành công 🎉"
And KPI New Customers tháng này: 12 → 13
And KPI Monthly Target: 13/15 (87%)
And Progress bar màu xanh lam
And Deal xuất hiện đầu tiên trong "Recent Closed Deals"
```

**Scenario 4: Channel hiệu quả nhất từ chart**
```
Given Lead Source Breakdown chart
When Website = 41.8%, Referral = 29.9%
Then Sale thấy website là kênh chính
And Phối hợp marketing tăng cường SEO/content
And Click segment "Referral" → tooltip: "20 leads từ giới thiệu — conversion cao nhất (25%)"
```

**Scenario 5: Tour sắp diễn ra — đặt lịch nhắc**
```
Given Upcoming Activity: "Tour - Nguyễn Thành Đạt - 18/04 lúc 10:00 - Tầng 3 Tower A"
When 1 ngày trước tour
Then Activity vẫn hiển thị trong list
And Sau khi dẫn tour xong, click "Hoàn thành"
And Confirm: "Xác nhận hoàn thành tour?"
And Submit → activity marked completed, biến khỏi upcoming list
```

**Scenario 6: Target 100% đạt được trước cuối tháng**
```
Given New Customers = 15 (= target)
When Dashboard load
Then KPI "Monthly Target Progress" = "15 / 15 customers" — 100%
And Progress bar màu xanh lá
And Nếu > 100%: hiển thị "Vượt target! 16/15 (107%)" với confetti animation nhỏ
```

## Phụ thuộc (Dependencies)

**Phụ thuộc vào:**
- EP-01: Authentication & role-based routing
- EP-12: Lead Management & CRM (leads, activities, funnel data)
- EP-03: Customer data (new customers, recent deals)
- EP-05: Contract (deal value từ contracts)

**Được sử dụng bởi:**
- `/crm/leads/create` — Quick action target
- `/crm/tours/create` — Quick action target
- `/contracts/create` — Quick action target

## Out of Scope

- Leaderboard/ranking với đồng nghiệp → Phase 2
- Commission tracking → Phase 3
- Email merge/send tới lead từ dashboard → EP-12 extension
- Forecast tháng tiếp theo → EP-10 / Phase 3
- A/B test tracking → Phase 3

## Màn hình / Luồng liên quan

- **Route**: `/dashboard/sales`
- **Layout**: Personal header + 4 KPIs (với progress bar) → 3 charts (Funnel | Trend | Source) → 3 widgets (My Leads | Upcoming Activities | Recent Deals) → Quick Actions
- **Funnel chart**: Có thể implement bằng Recharts `<BarChart layout="vertical">` với độ rộng bars giảm dần theo funnel effect

## Ghi chú

- **Funnel chart với Recharts**: Không có built-in Funnel chart — dùng horizontal BarChart với custom shape hoặc CSS clip-path để tạo hiệu ứng funnel
- **Stale lead**: Tính từ `MAX(lead.updatedAt, lastActivity.scheduledAt)` — nếu delta > 7 ngày → stale
- **Mock data**: `useSalesDashboard()` hook khi `VITE_MOCK_API=true`
- **Dual Y-axis chart**: Recharts `<ComposedChart>` với `<Bar>` và `<Line>` + 2 `<YAxis>` để vẽ closed_won + conversion rate cùng 1 chart
- **Progress bar**: `<div>` với `width: ${percent}%` và màu conditional, không cần thư viện ngoài
