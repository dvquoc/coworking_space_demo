# F-46 – Tạo biên lai (Receipt Generation)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-46 |
| Epic | EP-06 - Payment & Invoicing |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Sau khi thanh toán thành công (manual hoặc online), hệ thống tự động tạo biên lai (receipt) và gửi cho customer qua **Zalo** và **email**.

**Business Rationale:**
- Khách hàng cần biên lai làm chứng từ
- Pháp lý yêu cầu phải có biên lai cho mỗi giao dịch

**Business Rules:**
- Receipt tự động generate sau khi `paymentStatus = 'paid'`
- Gửi qua 2 kênh: Zalo OA và email
- Receipt chứa: invoice code, customer, items, total, payment method, paid date

## User Story

> Là **Kế toán**, tôi muốn **hệ thống tự tạo biên lai sau thanh toán** để **gửi cho customer**.

## Tiêu chí chấp nhận (Acceptance Criteria)

- [ ] **AC1**: Sau payment success → auto-generate receipt
- [ ] **AC2**: Receipt chứa: mã hóa đơn, khách hàng, danh sách items, tổng tiền, phương thức TT, ngày TT
- [ ] **AC3**: Gửi receipt qua Zalo OA cho customer
- [ ] **AC4**: Gửi receipt qua email cho customer
- [ ] **AC5**: Kế toán có thể xem/in receipt từ invoice detail
