# F-46D – Tự động tạo invoice đặt cọc (Auto-generate Deposit Invoice)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-46D |
| Epic | EP-06 - Payment & Invoicing |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Tự động tạo deposit invoice sau khi booking được duyệt (approved), nếu booking có `depositRequired = true`. Hệ thống tạo invoice với `invoiceType = 'deposit'` và `depositPercent` theo cấu hình booking.

**Business Rules:**
- Trigger: booking status → `confirmed` && `depositRequired = true`
- Auto-create invoice: `invoiceType = 'deposit'`, `depositPercent` = booking config
- Gửi email payment link cho customer

## User Story

> Là **Hệ thống**, tôi muốn **tự động tạo deposit invoice khi booking approved** để **thu cọc nhanh**.

## Tiêu chí chấp nhận (Acceptance Criteria)

- [ ] **AC1**: Booking confirmed + depositRequired → auto-create deposit invoice
- [ ] **AC2**: Invoice items lấy từ booking (space, duration, price)
- [ ] **AC3**: `depositPercent` lấy từ booking config
- [ ] **AC4**: `dueDate` = booking start date hoặc booking confirm date + 1 ngày
- [ ] **AC5**: Gửi email thông báo + payment link cho customer
