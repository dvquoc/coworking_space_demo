# F-78 – Customer Analytics

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-78 |
| Epic | EP-10 - Reporting & Analytics |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 3 - Advanced Features |

## Mô tả nghiệp vụ

Phân tích hành vi và giá trị khách hàng: tăng trưởng, retention, churn, và Customer Lifetime Value. Hỗ trợ **Manager và Sale** hiểu rõ dữ liệu khách hàng để đưa ra chiến lược giữ chân khách hàng và tập trung vào nhóm giá trị cao.

**Business Rules:**
- CLV (Customer Lifetime Value) = tổng paidAmount của tất cả invoices từ khách hàng đó (toàn bộ lịch sử)
- Retention Rate = (KH có booking/contract trong kỳ này VÀ kỳ trước) / (Tổng KH đã từng active) × 100%
- Churned = KH active kỳ trước nhưng không có giao dịch trong kỳ này (90+ ngày không hoạt động)
- New customer = KH tạo tài khoản trong kỳ filter

## User Story

> Là **Manager / Sale**, tôi muốn **xem phân tích khách hàng** để **cải thiện retention và tập trung vào khách có giá trị cao**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Summary Cards

- [ ] **AC1**: 6 summary cards:
  - Tổng khách hàng (toàn bộ)
  - Khách hàng mới (trong kỳ) + % so kỳ trước
  - Khách hàng active (có giao dịch trong kỳ)
  - Churned trong kỳ
  - Retention Rate (%) + so kỳ trước
  - Avg CLV (VND) — tính trên toàn bộ KH active

### Charts

- [ ] **AC2**: **Acquisition & Retention Trend** (combo chart): bar = mới, line = retention % theo tháng
- [ ] **AC3**: **Breakdown theo loại khách hàng** (pie): Individual vs Enterprise — count và revenue
- [ ] **AC4**: **CLV Distribution** (bar chart): nhóm CLV < 5M | 5–20M | 20–50M | > 50M

### Bảng Top Customers

- [ ] **AC5**: Top 20 khách hàng theo CLV: Tên | Loại | Tổng chi tiêu | Số booking | Số HĐ | Thành viên từ
- [ ] **AC6**: Click vào tên KH → navigate tới CustomerDetailsPage
- [ ] **AC7**: Sort được theo CLV, số booking, số HĐ

### Bộ lọc

- [ ] **AC8**: Filter date range (áp dụng cho "mới", "churned", "active" — không áp dụng cho CLV vì CLV là toàn lịch sử)
- [ ] **AC9**: Filter theo loại khách hàng (Individual / Enterprise / All)

### Export

- [ ] **AC10**: Export Excel danh sách Top Customers kèm đủ metrics (F-82)

## Phụ thuộc

- EP-03: Customer data (type, createdAt, status)
- EP-06: Invoice data (paidAmount) → CLV
- EP-04: Booking data → activity tracking
- EP-05: Contract data → activity tracking
