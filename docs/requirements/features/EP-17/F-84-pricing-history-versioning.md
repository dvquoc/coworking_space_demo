# F-84: Pricing History & Versioning (Lịch sử thay đổi giá)

## Thông tin

| Trường | Giá trị |
|--------|---------|
| ID | F-84 |
| Epic | EP-17 – Pricing & Promotions Management |
| Phase | Phase 1 |
| Độ ưu tiên | Should have |
| Trạng thái | Draft |

## Mục tiêu

Lưu toàn bộ lịch sử thay đổi giá (audit trail), đảm bảo tính minh bạch và cho phép xem lại giá đã áp dụng tại bất kỳ thời điểm nào trong quá khứ.

## Mô tả

- Mỗi pricing rule có version history: giá cũ → giá mới, ngày thay đổi, người thay đổi.
- Bookings và contracts luôn lưu `unitPrice` tại thời điểm tạo – không bị ảnh hưởng khi giá thay đổi về sau.
- Admin có thể xem: "Giá của Hot Desk vào ngày 15/03/2026 là bao nhiêu?"
- Filter lịch sử theo: rule, người thay đổi, khoảng thời gian.

## Scope màn hình

- Tab "Lịch sử" trong trang chi tiết pricing rule
- Trang `/pricing/history` – timeline toàn bộ thay đổi giá

## Acceptance Criteria

- [ ] Mỗi lần tạo/sửa/vô hiệu hóa pricing rule → ghi audit log với: người dùng, timestamp, diff (giá trước/sau)
- [ ] Booking/contract lưu `snapshotPrice` tại thời điểm tạo, không update khi giá thay đổi
- [ ] Query "giá tại thời điểm T": system tìm rule active vào thời điểm T
- [ ] Lịch sử hiển thị dạng timeline, có thể expand để xem chi tiết thay đổi fields nào
- [ ] Không được phép xóa pricing rule đã có lịch sử áp dụng (chỉ deactivate)
- [ ] Export lịch sử giá (CSV) cho mục đích kiểm toán

## Data Model

```typescript
interface PricingRuleVersion {
  id: string
  pricingRuleId: string
  versionNumber: number             // 1, 2, 3...
  changedBy: string
  changedAt: string
  changeType: 'created' | 'updated' | 'deactivated' | 'reactivated'
  previousValues?: Partial<SpacePricingRule>
  newValues: Partial<SpacePricingRule>
  note?: string                     // Lý do thay đổi
}
```

## Scenarios

### Scenario: Xem lịch sử thay đổi giá
```
Given Pricing rule "Hot Desk – Standard" đã thay đổi giá 3 lần
When Admin vào chi tiết rule → Tab "Lịch sử"
Then Hiển thị timeline:
  v3 (01/04/2026 – Nguyễn A): pricePerMonth 4,800,000 → 5,000,000
  v2 (01/01/2026 – Trần B): pricePerMonth 4,500,000 → 4,800,000
  v1 (15/10/2025 – Lê C): Tạo mới với pricePerMonth = 4,500,000
```

### Scenario: Booking cũ không bị ảnh hưởng
```
Given Booking #BK-001 tạo ngày 01/03/2026 với Hot Desk giá 4.800.000/tháng
When Admin tăng giá Hot Desk lên 5.000.000/tháng từ 01/04/2026
Then Booking #BK-001 vẫn hiển thị 4.800.000/tháng (snapshot giá cũ)
And Booking mới từ 01/04/2026 → 5.000.000/tháng
```
