# F-84 – Maintenance Dashboard (Bảng điều khiển Bảo trì)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-84 |
| Epic | EP-11 - Role-based Dashboards |
| Độ ưu tiên | Must have ⭐ CRITICAL |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Dashboard dành riêng cho **Nhân viên Bảo trì** — trang landing sau khi đăng nhập. Tập trung vào danh sách công việc bảo trì cần thực hiện theo ngày, trạng thái tài sản, và các tài sản hỏng hóc cần xử lý gấp. Nhân viên bảo trì không cần thông tin tài chính, chỉ cần biết "hôm nay cần làm gì, tài sản nào đang có vấn đề".

**Business Rationale:**
- **Task prioritization**: Hiển thị quá hạn trước, giúp nhân viên ưu tiên đúng việc
- **Asset health overview**: Nắm số lượng tài sản hỏng/đang bảo trì để báo cáo kịp thời
- **Accountability**: Log maintenance giúp theo dõi ai làm gì, lúc nào
- **Quick reporting**: Nút báo cáo tài sản hỏng ngay từ dashboard — giảm thời gian chuyển màn hình

**Business Rules:**
- Dashboard chỉ accessible cho role `maintenance`
- Task list sắp xếp: Overdue → Today → Tomorrow → This Week
- Task "Overdue" = deadline < today và chưa completed
- Task highlight đỏ nếu overdue, vàng nếu due today, trắng nếu upcoming
- Tài sản "Broken" cần được xử lý trong 24h
- Nhân viên chỉ xem được tasks được gán cho mình (hoặc toàn bộ tasks nếu trưởng nhóm)

**Out of Scope:**
- Quản lý nhân sự bảo trì → EP-09
- Asset procurement/purchasing → EP-08 extension
- Maintenance schedule generation tự động → Phase 2
- Mobile-native app → Future

## User Story

> Là **Nhân viên Bảo trì**, tôi muốn **xem danh sách công việc bảo trì hôm nay, trạng thái tài sản và tài sản đang hỏng** để **biết ngay cần làm gì và ưu tiên việc nào trước**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Routing & Access Control

- [ ] **AC1**: Route `/dashboard/maintenance` chỉ accessible cho role `maintenance`
- [ ] **AC2**: Sau khi login, user với role `maintenance` tự động redirect về `/dashboard/maintenance`
- [ ] **AC3**: Hiển thị tên nhân viên và ngày hiện tại trong header của dashboard

### KPI Cards

- [ ] **AC4**: Hiển thị 4 KPI cards:
  - **Total Assets**: Tổng số tài sản trong hệ thống đang quản lý
  - **Assets in Maintenance**: Số tài sản đang trong quá trình bảo trì
  - **Broken Assets**: Số tài sản đang hỏng (badge đỏ nếu > 0)
  - **Scheduled Tasks (this week)**: Số task bảo trì trong tuần hiện tại
- [ ] **AC5**: Click "Broken Assets" card → scroll đến hoặc highlight danh sách tài sản hỏng
- [ ] **AC6**: Click "Scheduled Tasks (this week)" → scroll đến task list widget

### Widgets

- [ ] **AC7**: **Maintenance Task List** (Danh sách việc cần làm):
  - Hiển thị tất cả tasks được gán cho nhân viên hiện tại
  - Sắp xếp: Overdue (đỏ, icon ⚠️) → Today (vàng, icon 📅) → Upcoming (trắng)
  - Mỗi task: Tên task, Vị trí (tầng/phòng), Deadline, Status badge, nút "Hoàn thành"
  - Nút **"Hoàn thành"**: click → confirm dialog → mark task as `completed` → task biến mất khỏi list
  - Filter: All / Today / Overdue / This Week
  - Empty state: "✅ Không có task nào — làm tốt lắm!"
- [ ] **AC8**: **Assets by Status Chart** (Donut chart):
  - Phân loại: Active (xanh lá) / In Maintenance (vàng) / Broken (đỏ) / Retired (xám)
  - Click vào segment → filter danh sách assets theo status đó
  - Legend hiển thị số lượng và % mỗi loại
- [ ] **AC9**: **Recent Maintenance Logs** (Table — 10 records gần nhất):
  - Columns: Thời gian, Tài sản, Mô tả, Người thực hiện, Kết quả
  - Link "Xem tất cả" → navigate to `/assets/maintenance-logs`
- [ ] **AC10**: **Broken Assets List** (Alert list):
  - Liệt kê tất cả tài sản có status `broken`
  - Mỗi item: Tên tài sản, Vị trí, Thời gian phát hiện, Mức độ (critical/normal)
  - Item `critical` lên đầu, màu đỏ đậm
  - Nút "Báo cáo đã xử lý" → mở form log maintenance nhanh

### Quick Actions

- [ ] **AC11**: Button **"Ghi nhận Bảo trì"** → navigate to `/assets/maintenance/create`
- [ ] **AC12**: Button **"Báo cáo Tài sản Hỏng"** → mở modal báo cáo nhanh với field: Tài sản (select), Mô tả, Mức độ (critical/normal)
- [ ] **AC13**: Button **"Xem Danh sách Tài sản"** → navigate to `/assets`

### Loading & Error States

- [ ] **AC14**: Skeleton loading khi trang khởi tạo
- [ ] **AC15**: Sau khi mark task "Hoàn thành" thành công: toast "Task đã được đánh dấu hoàn thành" + task animate out
- [ ] **AC16**: Nếu API lỗi khi mark task: toast lỗi "Không thể cập nhật task, vui lòng thử lại"

## Dữ liệu / Fields

| Trường | Kiểu | Nguồn | Ghi chú |
|--------|------|-------|---------|
| totalAssets | Number | COUNT(assets) | Tất cả trừ retired |
| assetsInMaintenance | Number | COUNT(assets WHERE status=in_maintenance) | |
| brokenAssets | Number | COUNT(assets WHERE status=broken) | |
| scheduledTasksThisWeek | Number | COUNT(tasks WHERE deadline IN [Mon-Sun this week]) | |
| tasks | Array<MaintenanceTask> | tasks WHERE assignedTo=currentUser AND status!=completed | Sort by priority |
| assetsByStatus | Array<{status, count, percent}> | GROUP BY status | Donut chart |
| recentLogs | Array<MaintenanceLog> | ORDER BY createdAt DESC LIMIT 10 | |
| brokenAssetList | Array<Asset> | assets WHERE status=broken ORDER BY severity | |

## API Contract

```
GET /api/dashboard/maintenance
Authorization: Bearer {token}
Role: maintenance

Response 200:
{
  "kpis": {
    "totalAssets": 342,
    "assetsInMaintenance": 8,
    "brokenAssets": 3,
    "scheduledTasksThisWeek": 12
  },
  "tasks": [
    {
      "id": "task1",
      "name": "Fix AC in Room 205",
      "location": "Tầng 2 - Cobi Tower A - Phòng 205",
      "deadline": "2026-04-16",
      "status": "overdue",
      "priority": "critical"
    },
    {
      "id": "task2",
      "name": "Inspect fire extinguishers",
      "location": "Tầng 1 - Cobi Tower A",
      "deadline": "2026-04-17",
      "status": "pending",
      "priority": "normal"
    }
  ],
  "assetsByStatus": [
    { "status": "active", "label": "Hoạt động", "count": 325, "percent": 95.0 },
    { "status": "in_maintenance", "label": "Đang bảo trì", "count": 8, "percent": 2.3 },
    { "status": "broken", "label": "Hỏng", "count": 3, "percent": 0.9 },
    { "status": "retired", "label": "Ngừng sử dụng", "count": 6, "percent": 1.8 }
  ],
  "recentLogs": [
    {
      "id": "log1",
      "timestamp": "2026-04-16T15:30:00+07:00",
      "assetName": "Máy lạnh PK-205",
      "description": "Thay lọc gió",
      "performedBy": "Trần Văn C",
      "result": "completed"
    }
  ],
  "brokenAssets": [
    {
      "id": "ast1",
      "name": "Máy chiếu MR-A101",
      "location": "Tầng 1 - Meeting Room A",
      "detectedAt": "2026-04-15T09:00:00+07:00",
      "severity": "critical"
    }
  ]
}
```

## Scenarios

**Scenario 1: Nhân viên bắt đầu ca làm việc**
```
Given User "maintenance@cobi.vn" đăng nhập lúc 07:30
When Redirect đến /dashboard/maintenance
Then Hiển thị: "Chào Trần Văn C — Thứ Sáu, 17/04/2026"
And Task list hiển thị:
  - [OVERDUE 🔴] Fix AC in Room 205 — quá hạn 1 ngày
  - [HÔM NAY 🟡] Inspect fire extinguishers — hôm nay
  - [TOMORROW] Routine cleaning Meeting Room A
And KPI Broken Assets = 3 (badge đỏ)
```

**Scenario 2: Hoàn thành task**
```
Given Task "Inspect fire extinguishers" đang hiển thị
When Nhân viên click "Hoàn thành"
Then Confirm dialog: "Xác nhận hoàn thành task này?"
And Nhập ghi chú (optional): "Đã kiểm tra 12/12 bình, đạt chuẩn"
And Submit → API PATCH /api/tasks/{id} status=completed
And Task animate slide-out khỏi danh sách
And Toast: "Task đã hoàn thành"
And KPI "Scheduled Tasks This Week" giảm 1
```

**Scenario 3: Báo cáo tài sản hỏng nhanh**
```
Given Nhân viên phát hiện máy in P-3F hỏng
When Click "Báo cáo Tài sản Hỏng" → mở modal
Then Form có: Tài sản (select → tìm "máy in P-3F"), Mô tả, Mức độ (Critical/Normal)
And Submit → API POST /api/assets/{id}/report-broken
And Toast: "Đã báo cáo. Manager sẽ được thông báo."
And KPI "Broken Assets" tăng 1
And Tài sản xuất hiện trong "Broken Assets List"
```

**Scenario 4: Filter task theo "Overdue"**
```
Given Task list có mix các loại task
When Nhân viên click filter "Overdue"
Then Chỉ hiển thị các task overdue
And Count badge: "3 tasks quá hạn"
And Filter button "Overdue" active (filled style)
```

**Scenario 5: Không có task hôm nay**
```
Given Tất cả tasks đã completed hoặc không có task được gán
When Dashboard load
Then Task list hiển thị: "✅ Không có task nào — làm tốt lắm!"
And KPI "Scheduled Tasks This Week" = 0
And Nhân viên vẫn thấy Asset charts và Broken Assets list
```

**Scenario 6: Tài sản hỏng mức Critical**
```
Given Broken Assets list có "Máy chiếu MR-A101" severity=critical
When Widget load
Then Item xuất hiện đầu tiên với màu đỏ đậm và icon 🚨
And Tooltip: "Tài sản critical cần xử lý trong 24h"
And Click "Báo cáo đã xử lý" → pre-fill form với tài sản đó
```

## Phụ thuộc (Dependencies)

**Phụ thuộc vào:**
- EP-01: Authentication & role-based routing
- EP-08: Asset & Inventory management (assets, maintenance tasks, logs)

**Được sử dụng bởi:**
- `/assets/maintenance/create` — Quick action target
- `/assets` — Quick action target

## Out of Scope

- Tạo lịch bảo trì định kỳ → EP-08 extension Phase 2
- Quản lý spare parts/vật tư → Phase 2
- Chỉ định task cho nhân viên khác → EP-09 (Manager role)
- Thống kê MTTR (Mean Time To Repair) → EP-10 Reporting

## Màn hình / Luồng liên quan

- **Route**: `/dashboard/maintenance`
- **Layout**: Header cá nhân + 4 KPI → 2-column (Task List | Asset Donut Chart) → Broken Assets + Recent Logs → Quick Actions
- **Mobile**: Stack single column, task list ưu tiên lên đầu

## Ghi chú

- **Overdue logic**: So sánh `task.deadline < today` theo timezone `Asia/Ho_Chi_Minh`
- **Task sort**: `[OVERDUE] → [TODAY] → [UPCOMING]` + trong mỗi nhóm sort by `priority DESC`
- **Severity colors**: Critical = `rose-700`, Normal = `amber-600`
- **Mock data**: `useMaintenanceDashboard()` hook khi `VITE_MOCK_API=true`
- **Recharts**: Donut chart dùng `<PieChart>` với `innerRadius` để tạo doughnut effect
