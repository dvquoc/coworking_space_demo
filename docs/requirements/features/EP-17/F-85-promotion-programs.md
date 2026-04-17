# F-85: Promotion Programs (Chương trình khuyến mãi)

## Thông tin

| Trường | Giá trị |
|--------|---------|
| ID | F-85 |
| Epic | EP-17 – Pricing & Promotions Management |
| Phase | Phase 1 |
| Độ ưu tiên | Should have |
| Trạng thái | Draft |

## Mục tiêu

Cho phép Manager tạo và quản lý chương trình khuyến mãi theo thời gian, với vòng đời rõ ràng (draft → scheduled → active → expired) và cơ chế phê duyệt trước khi kích hoạt.

## Mô tả

- Tạo promotion với nhiều loại: giảm %, giảm tiền cố định, mua X tặng Y, tặng dịch vụ, nâng hạng.
- Mỗi promotion có thời gian hiệu lực (start/end date), giới hạn số lần dùng.
- Vòng đời: `draft` → `pending_approval` → `scheduled` → `active` → `expired` / `cancelled`.
- Auto-apply hoặc yêu cầu nhập voucher code.
- Kết hợp điều kiện áp dụng phức tạp (AND logic): loại space, tòa nhà, khung giờ, giá trị đơn hàng, loại khách hàng...

## Scope màn hình

- `/pricing/promotions` – Danh sách promotions, filter theo status
- Wizard tạo promotion (3 bước: Thông tin cơ bản → Điều kiện → Hành động giảm giá)
- Trang chi tiết promotion: thống kê sử dụng, danh sách applications

## Acceptance Criteria

- [ ] Tạo promotion với: tên, loại, mô tả, start/end date, max usage (total + per customer)
- [ ] Chọn loại giảm giá: `percent_off`, `fixed_amount`, `buy_x_get_y`, `free_service`, `upgrade`
- [ ] Thiết lập điều kiện (có thể kết hợp AND): space type, building, booking day/hour, order amount, customer type, customer tag, first booking
- [ ] Chọn auto-apply (không cần code) hoặc require voucher code
- [ ] Workflow phê duyệt: Manager tạo → Admin/Manager cấp cao hơn duyệt → Scheduled/Active
- [ ] Xem thống kê: đã dùng bao nhiêu lần, tiết kiệm được bao nhiêu tiền cho khách, tổng discount đã cho
- [ ] Pause / Resume promotion
- [ ] Không được sửa promotion đang `active` (chỉ được pause hoặc cancel)

## Data Model

```typescript
interface PromotionProgram {
  id: string
  code: string                          // "PROMO-2026-Q2-01"
  name: string
  description: string
  type: PromotionType
  status: 'draft' | 'pending_approval' | 'scheduled' | 'active' | 'paused' | 'expired' | 'cancelled'
  startDate: string
  endDate?: string
  conditions: PromotionCondition[]
  discountAction: DiscountAction
  maxUsageTotal?: number
  maxUsagePerCustomer?: number
  currentUsageCount: number
  stackable: boolean
  priority: number
  applicableChannels: ('admin' | 'customer_portal')[]
  requiresVoucherCode: boolean
  createdBy: string
  approvedBy?: string
  createdAt: string
  updatedAt: string
}
```

## Scenarios

### Scenario: Chương trình khai trương Building 2
```
Given Manager tạo promotion mới
When Cấu hình:
  Type = percent_off, value = 20%
  Condition: building_id = "building-2"
  Start = 01/05/2026, End = 31/05/2026
  Max usage = 100 lần
  Auto-apply = true
Then Promotion vào trạng thái "pending_approval"
When Admin duyệt
Then Status → "scheduled"
And Từ 01/05: mọi booking tại Building 2 → tự động giảm 20%
And Sau 100 lần hoặc 31/05 → status "expired", không auto-apply nữa
```

### Scenario: Buy 3 tháng tặng 1 tháng
```
Given Promotion "Thuê 3 tháng tặng 1 tháng" (loại buy_x_get_y)
  buyQuantity = 3, getQuantity = 1, getUnit = "month"
  Applies to: Dedicated Desk
When Khách book Dedicated Desk 3 tháng (7M/tháng = 21M)
Then Invoice hiển thị:
  3 × 7.000.000 = 21.000.000
  Tặng 1 tháng (trị giá 7.000.000) – MIỄN PHÍ
  Contract duration = 4 tháng, total = 21.000.000
```

### Scenario: Tặng dịch vụ in ấn cho khách mới
```
Given Promotion "Welcome – Tặng 100 trang in miễn phí"
  Type = free_service
  Condition: is_first_booking = true
  freeServiceCode = "SVC-005" (In A4 trắng đen), quantity = 100
When Khách mới tạo booking đầu tiên
Then Usage record tự động tạo: 100 trang in – 0 đồng (free)
And Ghi chú: "Áp dụng promotion PROMO-WELCOME"
```
