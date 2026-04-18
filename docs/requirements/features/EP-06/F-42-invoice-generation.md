# F-42 – Tạo hóa đơn (Invoice Generation)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-42 |
| Epic | EP-06 - Payment & Invoicing |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Tự động tạo hóa đơn (invoice) khi booking được xác nhận hoặc khi contract cần thu phí hàng tháng. Hệ thống auto-generate `invoiceCode` theo format `INV-YYYYMM-XXX`, gán customer, items, tính thuế VAT và tổng tiền.

**Business Rationale:**
- Giảm thao tác thủ công cho kế toán
- Đảm bảo mọi booking/contract đều có invoice tương ứng
- Đồng bộ trạng thái thanh toán từ đầu

**Business Rules:**
- `invoiceCode` auto-generate: `INV-202604-001`, không trùng lặp
- Mỗi booking confirmed → tạo 1 invoice (hoặc deposit invoice nếu `depositRequired = true`)
- Invoice items lấy từ booking details (space, duration, price) hoặc contract (monthly fee)
- VAT mặc định 10%, có thể điều chỉnh
- Trạng thái ban đầu luôn là `unpaid`

## User Story

> Là **Kế toán**, tôi muốn **hệ thống tự động tạo invoice khi booking confirmed** để **thu tiền nhanh chóng**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Auto-generate từ Booking

- [ ] **AC1**: Khi booking status → `confirmed`, hệ thống auto-create invoice
- [ ] **AC2**: Invoice items = booking details (space name, duration, price)
- [ ] **AC3**: `dueDate` = booking start date
- [ ] **AC4**: `paymentStatus` = `unpaid`
- [ ] **AC5**: Gửi email invoice cho customer

### Auto-generate từ Contract

- [ ] **AC6**: Contract monthly billing cycle → tạo invoice hàng tháng
- [ ] **AC7**: Invoice items = contract line items (space, monthly fee)
- [ ] **AC8**: `dueDate` = ngày đầu tháng hoặc theo quy định trong contract

### Deposit Invoice (F-46D integration)

- [ ] **AC9**: Nếu `booking.depositRequired = true` → tạo deposit invoice thay vì full invoice
- [ ] **AC10**: `invoiceType = 'deposit'`, `depositPercent` = 30/50/100

### Invoice Code Generation

- [ ] **AC11**: Format: `INV-YYYYMM-XXX` (ví dụ: `INV-202604-001`)
- [ ] **AC12**: Tự increment, không trùng lặp
