# F-44 – Ghi nhận thanh toán thủ công (Manual Payment Recording)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-44 |
| Epic | EP-06 - Payment & Invoicing |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép **Kế toán** ghi nhận thanh toán bằng tiền mặt (cash) hoặc chuyển khoản ngân hàng (bank transfer) cho invoice. Bao gồm nhập số tiền, chọn phương thức, ghi chú, và tùy chọn xuất hóa đơn điện tử.

**Business Rationale:**
- Nhiều khách hàng vẫn thanh toán tiền mặt hoặc chuyển khoản
- Cần ghi nhận chính xác để đối soát

**Business Rules:**
- Chỉ invoice có `paymentStatus` là `unpaid`, `partial`, hoặc `overdue` mới cho phép Record Payment
- Số tiền thanh toán phải > 0 và ≤ số tiền còn nợ
- Nếu thanh toán đủ → `paymentStatus = 'paid'`
- Nếu thanh toán một phần → `paymentStatus = 'partial'`
- Phiếu thu sẽ được gửi qua Zalo và email của khách thuê

## User Story

> Là **Kế toán**, tôi muốn **ghi nhận thanh toán cash/bank transfer** để **cập nhật trạng thái invoice**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Record Payment Modal

- [ ] **AC1**: Chọn invoice → click "Ghi nhận thanh toán" → mở modal
- [ ] **AC2**: Modal hiển thị thông tin invoice: code, khách hàng, số tiền còn nợ
- [ ] **AC3**: Nhập số tiền thanh toán (mặc định = số tiền còn nợ)
- [ ] **AC4**: Chọn phương thức thanh toán: Cash, Chuyển khoản, VNPay, MoMo, ZaloPay
- [ ] **AC5**: Nếu chọn "Chuyển khoản" → hiển thị QR code ngân hàng (VietQR)
- [ ] **AC6**: Ghi chú (mã giao dịch, biên lai...) – optional
- [ ] **AC7**: Checkbox "Xuất hóa đơn điện tử" – optional

### Xác nhận thanh toán

- [ ] **AC8**: Click "Xác nhận" → cập nhật invoice:
  - `paidAmount += amount`
  - `paymentMethod = selected method`
  - `paidAt = now`
  - `paymentStatus` = `paid` (nếu đủ) hoặc `partial` (nếu một phần)
- [ ] **AC9**: Hiển thị success screen với thông tin invoice

### Thông báo

- [ ] **AC10**: Phiếu thu được gửi qua Zalo và email của khách thuê
- [ ] **AC11**: Hiển thị chú ý trước khi xác nhận: "Phiếu thu sẽ được gửi qua Zalo và email của khách thuê"
