# F-46B – Thanh toán đặt cọc (Deposit Payment Flow)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-46B |
| Epic | EP-06 - Payment & Invoicing |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Hỗ trợ thanh toán đặt cọc cho bookings với các mức **30%, 50%, 100%**. Khi booking yêu cầu đặt cọc, hệ thống tạo deposit invoice với `invoiceType = 'deposit'` và `depositPercent` tương ứng.

**Business Rationale:**
- Nhiều booking cần thu cọc trước để đảm bảo cam kết
- Linh hoạt mức cọc theo policy hoặc loại khách

**Business Rules:**
- `invoiceType = 'deposit'` với `depositPercent` ∈ {30, 50, 100}
- Tổng tiền deposit = Grand total × depositPercent%
- Sau khi thanh toán deposit → tạo balance invoice cho phần còn lại (nếu < 100%)
- Balance invoice link via `relatedInvoiceId`

## User Story

> Là **Kế toán**, tôi muốn **tạo invoice đặt cọc** để **thu cọc trước khi booking diễn ra**.

## Tiêu chí chấp nhận (Acceptance Criteria)

- [ ] **AC1**: Khi tạo invoice → chọn loại "Đặt cọc"
- [ ] **AC2**: Chọn mức đặt cọc: 30% / 50% / 100%
- [ ] **AC3**: Hệ thống tính: Final = Grand total × depositPercent%
- [ ] **AC4**: Hiển thị dòng chú thích: "Đặt cọc X% – [Grand total] × X%"
- [ ] **AC5**: Sau khi thanh toán deposit → có thể tạo balance invoice cho phần còn lại
- [ ] **AC6**: Balance invoice có `relatedInvoiceId` link tới deposit invoice
