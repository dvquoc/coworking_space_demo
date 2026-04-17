# F-86: Discount Rules Engine (Engine quy tắc giảm giá)

## Thông tin

| Trường | Giá trị |
|--------|---------|
| ID | F-86 |
| Epic | EP-17 – Pricing & Promotions Management |
| Phase | Phase 1 |
| Độ ưu tiên | Should have |
| Trạng thái | Draft |

## Mục tiêu

Xây dựng engine tính giá linh hoạt: đánh giá các điều kiện của promotion, xếp chồng (stack) nhiều promotion nếu được phép, và tính giá cuối cùng chính xác.

## Mô tả

Discount Rules Engine là lớp logic nằm phía sau, được gọi mỗi khi:
1. Staff tính giá preview trong Pricing Calculator (F-88)
2. Khách/Staff tạo booking (EP-04) hoặc hợp đồng (EP-05)
3. Áp dụng voucher code (F-87)

Engine thực hiện:
- Collect tất cả promotions đang `active` hoặc `scheduled` trong thời điểm booking
- Evaluate điều kiện (ConditionField + operator + value)
- Lọc ra promotions match
- Sắp xếp theo priority, xử lý stackable
- Tính discount amount cho từng loại (%, fixed, buy-x-get-y...)
- Giới hạn discount tối đa (maxDiscountAmount)
- Trả về breakdown chi tiết: giá gốc, từng khoản giảm, giá cuối

## Acceptance Criteria

- [ ] Engine evaluate đúng tất cả ConditionFields: space_type, building_id, booking_day, booking_hour, duration_months, order_amount, customer_type, customer_tag, is_first_booking, customer_id
- [ ] Kết hợp điều kiện: AND (tất cả điều kiện phải thỏa)
- [ ] Stack: nếu cả 2 promotions có `stackable = true` → áp dụng cả hai
- [ ] Nếu có promotion `stackable = false` và priority cao hơn → chỉ dùng promotion đó
- [ ] Giới hạn `maxUsageTotal` và `maxUsagePerCustomer` được check trước khi apply
- [ ] Output breakdown: `{ subtotal, discounts: [{promotionId, name, amount}], total }`
- [ ] Lưu `appliedPromotions` vào booking/invoice record
- [ ] Performance: tính giá trong < 200ms với ≤ 50 active promotions

## Data Model

```typescript
interface PricingResult {
  subtotal: number                    // Giá trước giảm
  discounts: AppliedDiscount[]
  total: number                       // Giá sau giảm
  breakdown: PricingBreakdown
}

interface AppliedDiscount {
  promotionId: string
  promotionName: string
  promotionCode: string
  discountType: PromotionType
  discountAmount: number              // VND đã giảm
  isAutoApplied: boolean
  voucherCode?: string
}

interface PricingBreakdown {
  spaceFee: number
  serviceFees: ServiceFeeItem[]
  totalDiscount: number
  final: number
}
```

## Scenarios

### Scenario: Xếp chồng 2 promotions stackable
```
Given Promotion A: Giảm 10% (stackable = true, priority = 1)
And Promotion B: Giảm 50.000đ cố định (stackable = true, priority = 2)
When Booking có subtotal = 5.000.000
Then Engine áp dụng cả 2:
  A: 5.000.000 × 10% = 500.000
  B: 50.000
  Total discount = 550.000
  Final = 4.450.000
```

### Scenario: Non-stackable promotion ưu tiên cao hơn
```
Given Promotion X: Giảm 20% (stackable = false, priority = 1)
And Promotion Y: Giảm 10% (stackable = true, priority = 2)
When Booking match cả X và Y
Then Engine chỉ áp dụng X (priority 1, non-stackable)
And Y bị bỏ qua
And Breakdown hiển thị: "Không thể kết hợp với khuyến mãi hiện tại"
```

### Scenario: maxUsagePerCustomer đã đạt giới hạn
```
Given Promotion "Khách mới – 30%" có maxUsagePerCustomer = 1
And Customer CUS-001 đã dùng 1 lần
When CUS-001 book lần 2 và promotion này match
Then Engine skip promotion này
And Hiển thị: "Bạn đã dùng hết lượt khuyến mãi này"
```
