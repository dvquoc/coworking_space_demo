# F-85 – Accounting Dashboard (Bảng điều khiển Kế toán)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-85 |
| Epic | EP-11 - Role-based Dashboards |
| Độ ưu tiên | Must have ⭐ CRITICAL |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Dashboard dành riêng cho **Kế toán (Accounting)** — trang landing sau khi đăng nhập. Tập trung vào theo dõi dòng tiền, hóa đơn, công nợ phải thu (AR) và tỷ lệ thu tiền. Kế toán cần xử lý nhanh các hóa đơn quá hạn, theo dõi thanh toán mới nhất, và chuẩn bị billing định kỳ cho khách hàng.

**Business Rationale:**
- **Cash flow visibility**: Biết ngay tổng phải thu, đã thu, còn lại để quản lý dòng tiền
- **Overdue follow-up**: Hóa đơn quá hạn là rủi ro tài chính — cần xử lý ưu tiên cao
- **AR Aging**: Phân tích công nợ theo nhóm tuổi (0-30, 31-60, 61-90, 90+ ngày) để đánh giá rủi ro
- **Billing preparation**: Xem trước các dịch vụ sắp đến hạn thanh toán để chuẩn bị invoice

**Business Rules:**
- Dashboard chỉ accessible cho role `accounting`
- Revenue tháng hiện tại = SUM(invoices.amount WHERE status=paid AND month=current month)
- Total Receivable = SUM(invoices.amount WHERE status IN [pending, overdue])
- Overdue Invoices = invoices WHERE due_date < today AND status != paid
- Collection Rate = (Tổng đã thu / Tổng phải thu) × 100, tính trong tháng hiện tại
- AR Aging groups: 0-30 ngày / 31-60 ngày / 61-90 ngày / 90+ ngày kể từ invoice date

**Out of Scope:**
- Nhập sổ sách kế toán (double-entry) → Phần mềm kế toán chuyên dụng
- Báo cáo thuế VAT → EP-10 extension Phase 2
- Tích hợp ngân hàng tự động → EP-06 Phase 2
- Quản lý accounts payable (AP) → Phase 3

## User Story

> Là **Kế toán**, tôi muốn **xem tổng quan hóa đơn, công nợ phải thu và tỷ lệ thu tiền** để **theo dõi dòng tiền, ưu tiên xử lý hóa đơn quá hạn và chuẩn bị báo cáo tài chính**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Routing & Access Control

- [ ] **AC1**: Route `/dashboard/accounting` chỉ accessible cho role `accounting`
- [ ] **AC2**: Sau khi login, user với role `accounting` tự động redirect về `/dashboard/accounting`
- [ ] **AC3**: Hiển thị kỳ báo cáo hiện tại (tháng/năm) ở đầu trang

### KPI Cards

- [ ] **AC4**: Hiển thị 4 KPI cards:
  - **Invoices Issued (tháng)**: Tổng số hóa đơn phát hành trong tháng hiện tại
  - **Total Receivable**: Tổng giá trị phải thu (VND) — tất cả invoices chưa thanh toán
  - **Overdue Invoices**: Số hóa đơn quá hạn + tổng giá trị quá hạn (badge đỏ nếu > 0)
  - **Payment Collection Rate**: Tỷ lệ thu tiền tháng hiện tại (%) — badge xanh ≥ 90%, vàng 70-89%, đỏ < 70%
- [ ] **AC5**: Mỗi KPI card hiển thị % change so với tháng trước
- [ ] **AC6**: Click "Overdue Invoices" card → scroll xuống widget "Overdue Invoices List"

### Charts

- [ ] **AC7**: **Monthly Revenue vs Target** (Bar chart):
  - 2 bars mỗi tháng: Revenue thực tế (xanh lam) vs Target (xám/đứt nét)
  - 6 tháng gần nhất
  - Hover: tooltip hiện Revenue, Target, chênh lệch (+ hoặc -)
  - Tháng hiện tại bar có viền nổi bật
- [ ] **AC8**: **Invoice Status Breakdown** (Pie chart / Donut):
  - Segments: Paid (xanh lá) / Pending (vàng) / Overdue (đỏ) / Draft (xám)
  - Legend hiện số lượng + % + giá trị VND mỗi nhóm
- [ ] **AC9**: **AR Aging Analysis** (Stacked Bar chart):
  - X-axis: Tháng (6 tháng gần nhất) — hoặc 1 snapshot tháng hiện tại
  - Mỗi bar stack theo nhóm: 0-30 ngày (xanh) / 31-60 (vàng) / 61-90 (cam) / 90+ ngày (đỏ)
  - Y-axis: Giá trị VND (format: `xxxM`)
  - Tooltip đầy đủ giá trị từng bucket
- [ ] **AC10**: Charts responsive trên các screen size

### Widgets

- [ ] **AC11**: **Recent Payments** (Table — 10 thanh toán gần nhất):
  - Columns: Ngày thanh toán, Mã HĐ, Khách hàng, Số tiền, Phương thức, Trạng thái
  - Trạng thái: `completed` (xanh), `pending` (vàng), `failed` (đỏ)
  - Link "Xem tất cả" → navigate to `/payments`
- [ ] **AC12**: **Overdue Invoices List** (Alert list, sort by ngày quá hạn lâu nhất):
  - Columns: Mã HĐ, Khách hàng, Số tiền, Ngày hạn, Số ngày quá hạn
  - Số ngày quá hạn: < 30 ngày màu vàng, ≥ 30 ngày màu đỏ đậm
  - Button "Nhắc nợ" → ghi nhận liên hệ khách về công nợ
  - Button "Ghi nhận thanh toán" → mở modal ghi nhận payment nhanh
- [ ] **AC13**: **Upcoming Service Billings** (List — billing trong 7 ngày tới):
  - Liệt kê các dịch vụ định kỳ sắp đến hạn tạo invoice
  - Columns: Khách hàng, Dịch vụ, Chu kỳ, Ngày billing, Giá trị ước tính
  - Button "Tạo Invoice" → navigate to `/invoices/create?customerId=...&serviceId=...`

### Quick Actions

- [ ] **AC14**: Button **"Tạo Hóa đơn"** → navigate to `/invoices/create`
- [ ] **AC15**: Button **"Ghi nhận Thanh toán"** → navigate to `/payments/record`
- [ ] **AC16**: Button **"Xem Báo cáo"** → navigate to `/reports/financial`

### Loading & Error States

- [ ] **AC17**: Skeleton loading khi trang khởi tạo
- [ ] **AC18**: Mỗi widget lỗi hiển thị error state độc lập + nút Retry
- [ ] **AC19**: Toast feedback khi "Nhắc nợ" hoặc "Ghi nhận thanh toán" thành công/thất bại

## Dữ liệu / Fields

| Trường | Kiểu | Nguồn | Ghi chú |
|--------|------|-------|---------|
| invoicesIssuedCount | Number | COUNT(invoices WHERE month=current) | |
| invoicesIssuedChange | Number (%) | So với tháng trước | |
| totalReceivable | Number (VND) | SUM(amount WHERE status IN [pending, overdue]) | |
| overdueCount | Number | COUNT(invoices WHERE due_date < today AND status != paid) | |
| overdueAmount | Number (VND) | SUM(amount WHERE overdue) | |
| collectionRate | Number (%) | (paid_amount / billed_amount) × 100, tháng hiện tại | |
| revenueByMonth | Array<{month, actual, target}> | 6 tháng gần nhất | Bar chart |
| invoiceStatusBreakdown | Array<{status, count, amount, percent}> | current snapshot | Pie chart |
| arAging | Array<{bucket, amount}> | Grouped by aging bucket | Stacked bar |
| recentPayments | Array<Payment> | ORDER BY paidAt DESC LIMIT 10 | |
| overdueInvoices | Array<Invoice> | ORDER BY dueDate ASC | |
| upcomingBillings | Array<ServiceBilling> | due_in_7_days | |

## API Contract

```
GET /api/dashboard/accounting
Authorization: Bearer {token}
Role: accounting

Response 200:
{
  "kpis": {
    "invoicesIssuedCount": 156,
    "invoicesIssuedChange": 8.3,
    "totalReceivable": 85000000,
    "overdueCount": 12,
    "overdueAmount": 8500000,
    "collectionRate": 92.0,
    "collectionRateChange": -2.1
  },
  "charts": {
    "revenueByMonth": [
      { "month": "2025-11", "actual": 380000000, "target": 400000000 },
      ...
      { "month": "2026-04", "actual": 450000000, "target": 420000000 }
    ],
    "invoiceStatusBreakdown": [
      { "status": "paid", "label": "Đã thanh toán", "count": 132, "amount": 396000000, "percent": 84.6 },
      { "status": "pending", "label": "Chờ thanh toán", "count": 12, "amount": 36000000, "percent": 7.7 },
      { "status": "overdue", "label": "Quá hạn", "count": 12, "amount": 8500000, "percent": 7.7 }
    ],
    "arAging": [
      { "bucket": "0-30", "label": "0-30 ngày", "amount": 20000000 },
      { "bucket": "31-60", "label": "31-60 ngày", "amount": 12000000 },
      { "bucket": "61-90", "label": "61-90 ngày", "amount": 5000000 },
      { "bucket": "90+", "label": "> 90 ngày", "amount": 3000000 }
    ]
  },
  "recentPayments": [
    {
      "id": "pmt1",
      "paidAt": "2026-04-17T09:30:00+07:00",
      "invoiceCode": "INV-1125",
      "customerName": "Công ty ABC",
      "amount": 15000000,
      "method": "bank_transfer",
      "status": "completed"
    }
  ],
  "overdueInvoices": [
    {
      "id": "inv1",
      "code": "INV-1024",
      "customerName": "Công ty ABC",
      "amount": 2500000,
      "dueDate": "2026-04-02",
      "daysOverdue": 15
    }
  ],
  "upcomingBillings": [
    {
      "customerId": "c1",
      "customerName": "Công ty XYZ",
      "serviceName": "Office 302 - Tháng 5",
      "billingCycle": "monthly",
      "billingDate": "2026-04-20",
      "estimatedAmount": 18000000
    }
  ]
}
```

## Scenarios

**Scenario 1: Kế toán xem tổng quan đầu ngày**
```
Given User "accounting@cobi.vn" đăng nhập
When Redirect đến /dashboard/accounting
Then KPI: Invoices 156, Receivable 85M VND, Overdue 12 (badge đỏ), Collection Rate 92%
And Overdue Invoices list hiển thị ngay bên dưới với INV-1024 — 15 ngày quá hạn
And AR Aging chart: bucket 90+ ngày màu đỏ = 3M VND
```

**Scenario 2: Nhắc nợ khách hàng quá hạn**
```
Given Overdue Invoice "INV-1024 - Công ty ABC - 2,500,000 VND - 15 ngày"
When Kế toán click "Nhắc nợ"
Then Modal: confirm "Ghi nhận liên hệ nhắc nợ Công ty ABC về INV-1024?"
And Có field ghi chú tùy chọn
And Submit → tạo note liên kết với customer
And Toast: "Đã ghi nhận liên hệ nhắc nợ"
```

**Scenario 3: Ghi nhận thanh toán nhanh**
```
Given Overdue Invoice "INV-1031 - Công ty XYZ - 1,200,000 VND"
When Click "Ghi nhận thanh toán"
Then Modal pre-fill: Mã HĐ = INV-1031, Khách hàng = Công ty XYZ, Số tiền = 1,200,000
And Kế toán chọn phương thức (cash/bank_transfer/card), nhập ngày, ghi chú
And Submit → PATCH invoice status=paid + tạo payment record
And Toast: "Đã ghi nhận thanh toán thành công"
And KPI: Overdue giảm 1, Collection Rate tăng
```

**Scenario 4: Revenue vượt target tháng hiên tại**
```
Given Revenue chart tháng 4/2026: Actual = 450M, Target = 420M
When Kế toán nhìn vào chart
Then Bar "Actual" cao hơn đường target
And Tooltip: "Tháng 4/2026: Đạt 450,000,000 VND (+7.1% vs target)"
And Bar tháng 4 có viền xanh highlight
```

**Scenario 5: Tạo invoice cho billing sắp đến**
```
Given Upcoming Billings có "Công ty XYZ - Office 302 - Billing 20/04"
When Click "Tạo Invoice"
Then Navigate to /invoices/create với query params ?customerId=c1&serviceId=s5
And Form pre-fill: Customer = Công ty XYZ, Service = Office 302, Amount = 18,000,000
And Kế toán review và submit để tạo invoice
```

**Scenario 6: Collection Rate thấp — cảnh báo**
```
Given Collection Rate = 65% (dưới 70%)
When Dashboard load
Then KPI "Collection Rate" badge màu ĐỎ
And Tooltip: "Tỷ lệ thu tiền thấp — cần tăng cường nhắc nợ"
And Overdue count cao tương ứng
```

## Phụ thuộc (Dependencies)

**Phụ thuộc vào:**
- EP-01: Authentication & role-based routing
- EP-06: Payment & Invoicing (invoices, payments, AR data)
- EP-05: Contract (service billing schedules)
- EP-07: Service (service billing)

**Được sử dụng bởi:**
- `/invoices/create` — Quick action + upcoming billings CTA
- `/payments/record` — Quick action
- `/reports/financial` — Quick action target

## Out of Scope

- Nhập bút toán kế toán (journal entries) → phần mềm kế toán riêng
- Xuất báo cáo thuế → EP-10 extension Phase 2
- Auto-send invoice qua email → EP-06 Phase 2
- Accounts Payable (mua hàng/chi phí) → Phase 3
- Multi-currency → Phase 3

## Màn hình / Luồng liên quan

- **Route**: `/dashboard/accounting`
- **Layout**: Period header + 4 KPIs → 3 charts (Revenue bar | Invoice pie | AR Aging) → 3 widgets (Payments | Overdue | Upcoming Billings) → Quick Actions
- **Responsive**: Charts 3 cột (desktop) → 1 cột (mobile)

## Ghi chú

- **AR Aging**: Tính từ `invoice.issuedDate`, không phải `dueDate`
- **Currency format**: `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`
- **Recharts**: Stacked bar cho AR Aging dùng `<BarChart>` với nhiều `<Bar>` stack
- **Collection Rate formula**: Chỉ tính trong tháng hiện tại để tránh nhầm lẫn với AR cũ
- **Mock data**: `useAccountingDashboard()` hook khi `VITE_MOCK_API=true`
- **Ghi nhận thanh toán modal**: Tái sử dụng component từ EP-06 nếu đã có
