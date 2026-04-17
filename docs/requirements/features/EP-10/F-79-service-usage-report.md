# F-79 – Service Usage Report

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-79 |
| Epic | EP-10 - Reporting & Analytics |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 3 - Advanced Features |

## Mô tả nghiệp vụ

Theo dõi mức độ sử dụng các dịch vụ bổ sung (add-on services: in ấn, đồ uống, phòng họp theo giờ, v.v.) để **Manager** xác định dịch vụ nào đang được ưa chuộng và dịch vụ nào cần điều chỉnh hoặc loại bỏ.

**Business Rules:**
- "Dịch vụ" ở đây = các line items trong invoices có type = service (không phải thuê không gian)
- Doanh thu từ dịch vụ = paidAmount của các invoice items đó
- Số lần sử dụng = số invoice items thuộc dịch vụ đó (không phải số unique customers)

## User Story

> Là **Manager**, tôi muốn **biết dịch vụ nào được sử dụng nhiều nhất** để **tối ưu danh mục dịch vụ và định giá**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Summary Cards

- [ ] **AC1**: 3 summary cards:
  - Tổng doanh thu từ dịch vụ trong kỳ
  - Tổng lượt sử dụng dịch vụ
  - Số loại dịch vụ đang active

### Charts

- [ ] **AC2**: **Top 5 dịch vụ theo doanh thu** (bar chart ngang): tên | doanh thu | lượt dùng
- [ ] **AC3**: **Trend sử dụng theo tháng** (line chart, multi-line cho top 3 dịch vụ)
- [ ] **AC4**: **Cơ cấu doanh thu dịch vụ** (pie chart)

### Bảng chi tiết

- [ ] **AC5**: Bảng đầy đủ tất cả dịch vụ: Tên dịch vụ | Lượt sử dụng | Doanh thu | % trên tổng DT dịch vụ | So kỳ trước (%)
- [ ] **AC6**: Sort được theo từng cột
- [ ] **AC7**: Filter theo khoảng thời gian và tòa nhà

### Export

- [ ] **AC8**: Export Excel (F-82)

## Phụ thuộc

- EP-07: Service usage data (service charges trong credit/invoice)
- EP-06: Invoice line items data
