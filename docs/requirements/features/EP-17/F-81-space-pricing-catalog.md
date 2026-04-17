# F-81: Space Pricing Catalog (Bảng giá không gian)

## Thông tin

| Trường | Giá trị |
|--------|---------|
| ID | F-81 |
| Epic | EP-17 – Pricing & Promotions Management |
| Phase | Phase 1 |
| Độ ưu tiên | Must have |
| Trạng thái | Draft |

## Mục tiêu

Cho phép Admin/Kế toán thiết lập và quản lý bảng giá thuê cho từng loại không gian (SpaceType) với đa dạng đơn vị thời gian, hỗ trợ override giá theo tòa nhà/tầng/space cụ thể.

## Mô tả

- Tạo pricing rule cho 8 loại SpaceType: Hot Desk, Dedicated Desk, Private Office, Meeting Room, Conference Room, Training Room, Event Space, Open Space.
- Mỗi rule hỗ trợ nhiều đơn vị: giá/giờ, giá/ngày, giá/tuần, giá/tháng, giá/năm (điền tùy chọn).
- Override giá theo phạm vi hẹp hơn (building > spaceType, floor > building, space > floor).
- Set effective date: giá mới áp dụng từ ngày X, không ảnh hưởng bookings/contracts đã có.
- Hỗ trợ discount tự động: weekend, off-peak, long-term (theo tháng/tuần).

## Scope màn hình

- `/pricing/spaces` – Danh sách tất cả space pricing rules
- Modal tạo/chỉnh sửa pricing rule
- Tab "Lịch sử thay đổi giá" (audit log)

## Acceptance Criteria

- [ ] Tạo pricing rule cho SpaceType với: giá/giờ, giá/ngày, giá/tuần, giá/tháng, giá/năm (không bắt buộc điền đủ)
- [ ] Mỗi rule có thể scope: toàn bộ (spaceType) → theo building → theo floor → theo space cụ thể
- [ ] Priority: space > floor > building > spaceType (override ưu tiên cao hơn default)
- [ ] Set `minBookingHours` hoặc `minBookingDays`
- [ ] Set `weekendDiscount` (%) và `offPeakDiscount` (%)
- [ ] Set long-term discount: ví dụ 3 tháng → 5%, 6 tháng → 10%, 12 tháng → 20%
- [ ] Set `effectiveFrom` (required) và `effectiveTo` (optional)
- [ ] Hiển thị trạng thái rule: `scheduled` (chưa đến ngày) / `active` / `expired`
- [ ] Bookings/contracts hiện tại không bị ảnh hưởng khi thay đổi giá
- [ ] View lịch sử thay đổi (ai thay đổi, lúc nào, từ giá nào → giá nào)
- [ ] Chỉ role Admin và Accountant được tạo/sửa pricing rule

## Data Model

```typescript
interface SpacePricingRule {
  id: string
  name: string                      // "Hot Desk – Standard", "Private Office – Building 2"
  spaceType?: SpaceType             // Áp dụng chung cho loại space
  buildingId?: string               // Override cho tòa nhà
  floorId?: string                  // Override cho tầng
  spaceId?: string                  // Override cho space cụ thể

  pricePerHour?: number             // VND
  pricePerDay?: number
  pricePerWeek?: number
  pricePerMonth?: number
  pricePerYear?: number

  minBookingHours?: number
  minBookingDays?: number

  weekendDiscount?: number          // %
  offPeakDiscount?: number          // %
  longTermDiscounts: LongTermDiscount[]

  effectiveFrom: string             // "2026-05-01"
  effectiveTo?: string
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface LongTermDiscount {
  unit: 'month' | 'week'
  minQuantity: number
  discountPercent: number
}
```

## Scenarios

### Scenario 1: Tạo bảng giá Hot Desk
```
Given Admin vào Pricing → Space Pricing → Click "Thêm pricing rule"
When Chọn SpaceType = Hot Desk
And Set: Giá/giờ = 50.000, Giá/ngày = 300.000, Giá/tháng = 5.000.000
And Set: Min booking = 2 giờ, Weekend discount = 10%
And Set long-term: 3 tháng = 5%, 6 tháng = 10%, 12 tháng = 20%
And Effective From = 01/05/2026
Then Rule được lưu với status "scheduled"
And Từ 01/05/2026 tất cả Hot Desk booking tự động dùng giá này
```

### Scenario 2: Override riêng cho Building 2
```
Given Đã có rule: Private Office → 15.000.000/tháng
When Tạo rule mới: Private Office + Building 2 → 12.000.000/tháng
Then Booking Private Office – Building 1 → 15 triệu
And Booking Private Office – Building 2 → 12 triệu (override)
```

## UI Notes

- Filter rule theo SpaceType, building, trạng thái (scheduled/active/expired)
- Highlight rules sắp hết hạn (trong 30 ngày)
- So sánh giá cũ vs giá mới trong lịch sử
- Badge "Override" cho rules có scope hẹp hơn spaceType
