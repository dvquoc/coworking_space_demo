# F-64 – Vòng đời Tài sản (Asset Lifecycle)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-64 |
| Epic | EP-08 - Inventory & Asset Management |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Theo dõi và quản lý trạng thái (status) và tình trạng vật lý (condition) của asset qua từng giai đoạn sử dụng: từ khi nhập kho → phân bổ → bảo trì → hỏng → thanh lý. Admin có thể thay đổi status thủ công hoặc status tự động cập nhật theo các action.

**Lifecycle State Machine:**

```
available ──────────── assign ──────────▶ active
   ▲                                        │
   │ unassign                               │ report broken
   │                                        ▼
   │                                     broken
   │                                        │
   │               repair done             │ create repair log
   │            ◀──────────────────── maintenance
   │
   └──────────────── retire ──────────▶ retired
```

**Business Rules:**
- Transitions được phép:
  - available → active (assign to space)
  - active → available (unassign)
  - active/available → maintenance (create repair log)
  - maintenance → active (complete repair)
  - maintenance → broken (cancel/failed repair)
  - active/available/broken → retired (Admin thủ công)
  - broken → maintenance (tạo mới repair log)

## User Story

> Là **Manager**, tôi muốn **thay đổi trạng thái asset (báo hỏng, thanh lý)** để **phản ánh đúng tình trạng thực tế của tài sản**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Report Broken

- [ ] **AC1**: Từ asset list hoặc detail, action "Báo hỏng" (active/available → broken)
- [ ] **AC2**: Dialog: nhập mô tả sự cố (required)
- [ ] **AC3**: Sau khi confirm: asset.status = `broken`, asset.condition cập nhật → `poor` hoặc `broken`
- [ ] **AC4**: Tự động tạo maintenance log type `repair`, status `scheduled`

### Retire Asset

- [ ] **AC5**: Chỉ Admin có quyền Retire (thanh lý)
- [ ] **AC6**: Chỉ retire được asset không phải `active`
- [ ] **AC7**: Confirm dialog bắt buộc với reason (required)
- [ ] **AC8**: Sau retire: asset không còn hiện trong các dropdown assign/booking
- [ ] **AC9**: Retired assets vẫn xem được trong danh sách với filter

### Condition Tracking

- [ ] **AC10**: Condition: excellent → good → fair → poor → broken
- [ ] **AC11**: Condition cập nhật thủ công trong Edit Asset hoặc tự động khi hoàn thành maintenance
- [ ] **AC12**: Condition badge màu sắc: excellent (xanh lá) / good (xanh dương) / fair (vàng) / poor (cam) / broken (đỏ)

### Status History View

- [ ] **AC13**: Asset detail hiển thị status hiện tại nổi bật
- [ ] **AC14**: Badge trạng thái: active (xanh) / available (xám) / maintenance (vàng) / broken (đỏ) / retired (slate)
