# F-87: Voucher & Coupon Codes (Mã giảm giá)

## Thông tin

| Trường | Giá trị |
|--------|---------|
| ID | F-87 |
| Epic | EP-17 – Pricing & Promotions Management |
| Phase | Phase 1 |
| Độ ưu tiên | Should have |
| Trạng thái | Draft |

## Mục tiêu

Cho phép Manager tạo và phân phối mã giảm giá (voucher/coupon codes) gắn với các chương trình promotion, hỗ trợ cả public codes và targeted codes dành riêng cho khách hàng cụ thể.

## Mô tả

- Voucher code gắn với một PromotionProgram (F-85).
- Có thể tạo 1 hoặc bulk (nhiều code cùng lúc).
- Assigned voucher: chỉ một khách hàng cụ thể được dùng.
- Public voucher: bất kỳ khách nào cũng dùng được (trong giới hạn).
- Track số lần sử dụng, ai đã dùng, dùng vào booking nào.
- Revoke (thu hồi) code nếu cần.

## Scope màn hình

- `/pricing/vouchers` – Danh sách tất cả vouchers
- Tab "Vouchers" trong trang chi tiết promotion
- Modal tạo voucher (single hoặc bulk)
- Chi tiết voucher: usage history

## Acceptance Criteria

- [ ] Tạo voucher code: tự định nghĩa (VD: "WELCOME2026") hoặc auto-generate (random 8 ký tự)
- [ ] Gắn voucher vào một promotion program
- [ ] Bulk create: nhập số lượng → system generate nhiều codes
- [ ] Assigned voucher: gắn với customerId → chỉ customer đó mới dùng được
- [ ] Public voucher: không gắn customer → ai cũng dùng được (trong `maxUsageTotal`)
- [ ] Set expiry date riêng cho voucher (có thể khác với promotion end date, lấy cái nào đến trước)
- [ ] Khi apply: validate code hợp lệ, chưa hết hạn, chưa vượt giới hạn, đúng customer (nếu assigned)
- [ ] Revoke: deactivate code, usage history vẫn được giữ nguyên
- [ ] Track: danh sách bookings đã dùng code này
- [ ] Export danh sách vouchers (CSV)

## Data Model

```typescript
interface VoucherCode {
  id: string
  code: string                      // "WELCOME2026", "VIP-ABC-50"
  promotionId: string
  assignedCustomerId?: string       // null = public voucher
  assignedAt?: string
  maxUsageTotal?: number
  maxUsagePerCustomer?: number
  currentUsageCount: number
  isActive: boolean
  expiresAt?: string
  usageHistory: VoucherUsage[]
  createdAt: string
  createdBy: string
}

interface VoucherUsage {
  bookingId: string
  customerId: string
  customerName: string
  usedAt: string
  discountAmount: number
}
```

## Scenarios

### Scenario: Tạo voucher VIP cho khách ABC Tech
```
Given Manager muốn tặng voucher cho CUS-006 (ABC Technology)
When Tạo voucher:
  Code = "VIP-ABC-50"
  Gắn promotion "50% off tháng đầu"
  Assign customer = CUS-006
  Expires = 30/06/2026
Then Khi CUS-006 booking và nhập "VIP-ABC-50"
  → Validation pass: đúng customer, còn hạn
  → Apply: -50% tháng đầu
And Nếu CUS-007 nhập code "VIP-ABC-50"
  → "Mã giảm giá không áp dụng cho tài khoản của bạn"
```

### Scenario: Bulk generate codes cho chiến dịch email
```
Given Manager tạo campaign Black Friday cho 200 khách
When Tạo bulk vouchers:
  Số lượng = 200, auto-generate code
  Gắn promotion "Black Friday – 15%"
  maxUsagePerCode = 1, Expires = 30/11/2026
Then System generate 200 codes dạng "BF26-XXXXXX"
And Export CSV để dán vào email marketing
And Mỗi code chỉ dùng được 1 lần
```

### Scenario: Revoke voucher bị lộ
```
Given Voucher "PROMO-SECRET" bị lan truyền ra ngoài công ty
When Manager revoke code "PROMO-SECRET"
Then Code bị deactivate, không dùng được nữa
And 3 lần đã dùng trước đó vẫn được ghi nhận (không rollback)
And Log: "Revoked by [user] at [time], reason: misuse"
```
