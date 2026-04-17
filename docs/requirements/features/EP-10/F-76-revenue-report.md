# F-76 – Revenue Report

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-76 |
| Epic | EP-10 - Reporting & Analytics |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 3 - Advanced Features |

## Mô tả nghiệp vụ

Cho phép **Nhà đầu tư, Kế toán, Admin và Manager** xem báo cáo doanh thu chi tiết theo khoảng thời gian tùy chọn. Báo cáo tổng hợp từ dữ liệu hóa đơn (EP-06) với breakdown theo phương thức thanh toán, loại không gian và tòa nhà.

**Business Rationale:**
- Revenue report là báo cáo được truy cập thường xuyên nhất để đánh giá hiệu quả kinh doanh
- Cần biết doanh thu thực thu vs chưa thu vs quá hạn để quản lý dòng tiền
- So sánh với kỳ trước để đánh giá tăng trưởng

**Business Rules:**
- Tối đa query 24 tháng một lần (performance)
- Chỉ tính invoices từ bookings và contracts đã confirmed
- "Doanh thu" = paidAmount của invoices (thực thu), không phải tổng invoice
- Revenue growth = (kỳ này - kỳ trước) / kỳ trước × 100%

## User Story

> Là **Nhà đầu tư / Kế toán**, tôi muốn **xem báo cáo doanh thu chi tiết** để **phân tích lợi nhuận và quản lý dòng tiền**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Bộ lọc (Filter)

- [ ] **AC1**: Filter date range với presets: Tháng này, Quý này, Năm nay, 6 tháng qua, 12 tháng qua, Custom
- [ ] **AC2**: Filter theo tòa nhà (dropdown, default = Tất cả)
- [ ] **AC3**: Filter theo loại không gian (dropdown, default = Tất cả)
- [ ] **AC4**: Granularity: Theo ngày / Theo tuần / Theo tháng (default = Theo tháng)

### Summary Cards

- [ ] **AC5**: 4 summary cards hiển thị:
  - **Tổng doanh thu**: tổng paidAmount trong kỳ + % thay đổi so kỳ trước
  - **Đã thu**: tổng invoices có status = paid
  - **Chưa thu**: tổng invoices có status = unpaid + partial
  - **Quá hạn**: tổng invoices có status = overdue

### Charts

- [ ] **AC6**: **Revenue Trend** (line chart): trục X = kỳ theo granularity, trục Y = doanh thu (VND)
- [ ] **AC7**: **Breakdown theo phương thức thanh toán** (bar chart hoặc pie): VNPay, MoMo, ZaloPay, Tiền mặt, Chuyển khoản, Credit
- [ ] **AC8**: **Breakdown theo loại không gian** (pie chart): Hot Desk, Fixed Desk, Private Office, Meeting Room, Event Space, Virtual Office

### Bảng chi tiết

- [ ] **AC9**: Bảng "Doanh thu theo tòa nhà": Building | Tổng doanh thu | % trên tổng | So kỳ trước
- [ ] **AC10**: Bảng "Hóa đơn gần đây": Invoice Code | Khách hàng | Ngày | Số tiền | Trạng thái
- [ ] **AC11**: Pagination cho bảng hóa đơn (10 rows/page)

### Export

- [ ] **AC12**: Nút Export PDF và Export Excel (liên kết F-82)
- [ ] **AC13**: Khi không có dữ liệu → hiển thị empty state, disable nút export

## Màn hình & Layout

```
[Tab: Doanh thu | Lấp đầy | Khách hàng | Dịch vụ | Tài sản]

Filter: [Tháng này ▼] [Tất cả tòa nhà ▼] [Tất cả loại ▼] [Theo tháng ▼]  [Export PDF] [Export Excel]

┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ Tổng DT        │ │ Đã thu         │ │ Chưa thu       │ │ Quá hạn        │
│ 450,000,000đ   │ │ 380,000,000đ   │ │ 50,000,000đ    │ │ 20,000,000đ    │
│ +12% vs tháng T│ │                │ │                │ │                │
└────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘

[Revenue Trend - Line Chart (full width)]

[Breakdown phương thức TT - Bar]   [Breakdown loại KG - Pie]

[Bảng: Doanh thu theo tòa nhà]

[Bảng: Hóa đơn gần đây + Pagination]
```

## Phụ thuộc

- EP-06: Invoice data (paidAmount, paymentMethod, status)
- EP-04: Booking data (spaceType)
- EP-02: Building data
