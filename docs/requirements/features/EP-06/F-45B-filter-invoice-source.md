# F-45B – Filter theo nguồn hóa đơn (Invoice Source Filter)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-45B |
| Epic | EP-06 - Payment & Invoicing |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép lọc danh sách invoice theo nguồn phát sinh: **Đặt chỗ (Booking)**, **Hợp đồng (Contract)**, hoặc **Nạp credit (Credit Top-up)**.

**Business Rationale:**
- Kế toán cần xem riêng invoice từng nguồn để đối soát
- Phân tích doanh thu theo kênh

## User Story

> Là **Kế toán**, tôi muốn **filter invoices theo nguồn** để **xem riêng từng loại hóa đơn**.

## Tiêu chí chấp nhận (Acceptance Criteria)

- [ ] **AC1**: Dropdown filter "Nguồn" trên toolbar: Tất cả / Đặt chỗ / Hợp đồng / Nạp credit
- [ ] **AC2**: Kết hợp được với status tabs (filter đồng thời)
- [ ] **AC3**: Mỗi invoice row hiển thị badge nguồn (xanh dương = booking, tím = contract, xanh lá = credit)
- [ ] **AC4**: Hiển thị mã nguồn (booking code / contract code) bên dưới badge
