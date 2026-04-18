# F-42B – Tạo hóa đơn thủ công (Manual Invoice Creation)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-42B |
| Epic | EP-06 - Payment & Invoicing |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép **Kế toán / Admin** tạo hóa đơn mới trực tiếp từ giao diện admin. Chọn nguồn (booking / contract / credit top-up), chọn khách hàng, nhập line items, thiết lập loại invoice (full / deposit / balance), chiết khấu, thuế VAT.

**Business Rationale:**
- Hỗ trợ tạo invoice cho các trường hợp đặc biệt (dịch vụ phát sinh, phí bổ sung)
- Cho phép tạo deposit invoice hoặc balance invoice thủ công
- Linh hoạt khi hệ thống auto-generate chưa cover hết các case

**Business Rules:**
- Phải chọn customer (bắt buộc)
- Nếu nguồn là booking/contract → phải link tới booking/contract cụ thể
- Nếu nguồn là `credit_topup` → không cần link source
- Line items phải có ít nhất 1 dòng với `totalPrice > 0`
- Sau khi tạo → mở modal Record Payment để thu tiền ngay

## User Story

> Là **Kế toán**, tôi muốn **tạo hóa đơn thủ công** để **xử lý các khoản thu ngoài quy trình tự động**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Create Invoice Modal

- [ ] **AC1**: Button "Tạo hóa đơn" trên trang danh sách invoice
- [ ] **AC2**: Modal form gồm:
  - Nguồn hóa đơn (Đặt chỗ / Hợp đồng / Nạp credit)
  - Khách hàng (dropdown, required)
  - Booking/Contract link (dropdown, filtered theo customer)
  - Loại invoice (full / deposit / balance)
  - Nếu deposit → chọn % đặt cọc (30% / 50% / 100%)
  - Ngày tạo, hạn thanh toán
  - Line items (description, quantity, unit price)
  - Chiết khấu, thuế VAT %
  - Ghi chú (optional)

### Validation

- [ ] **AC3**: Customer bắt buộc, hiển thị error nếu chưa chọn
- [ ] **AC4**: Source link bắt buộc (trừ credit_topup), hiển thị error nếu chưa chọn
- [ ] **AC5**: Hạn thanh toán bắt buộc
- [ ] **AC6**: Ít nhất 1 line item hợp lệ (description + totalPrice > 0)

### Tính toán

- [ ] **AC7**: Subtotal = SUM(line items totalPrice)
- [ ] **AC8**: Tax = (Subtotal - Discount) × VAT%
- [ ] **AC9**: Grand total = Subtotal - Discount + Tax
- [ ] **AC10**: Nếu deposit → Final = Grand total × depositPercent%

### After Create

- [ ] **AC11**: Đóng modal Create → mở modal Record Payment cho invoice vừa tạo
- [ ] **AC12**: Invoice mới có `paymentStatus = 'unpaid'`
