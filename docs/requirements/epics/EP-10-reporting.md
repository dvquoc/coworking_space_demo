# EP-10 – Reporting & Analytics

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-10 |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 3 - Advanced Features |
| Độ ưu tiên | Should have |

## Mô tả

Hệ thống báo cáo nâng cao cho nền tảng Coworking Space, cung cấp cái nhìn toàn diện về doanh thu, tỷ lệ lấp đầy, hiệu quả vận hành và giá trị khách hàng. Báo cáo phục vụ nhiều role khác nhau (Investor, Manager, Accounting, Admin) với khả năng lọc linh hoạt, visualize bằng charts và export PDF/Excel.

> **Lưu ý phân biệt với EP-11**: EP-11 cung cấp **Dashboard với KPIs realtime** cho từng role (landing page sau login). EP-10 cung cấp **Báo cáo chuyên sâu** với filter phức tạp, drill-down, time range tùy chọn và export — dành cho phân tích nghiệp vụ.

**Data sources**:
- Doanh thu → EP-06 (Payment), EP-07 (Credit)
- Lấp đầy → EP-04 (Booking), EP-02 (Property)
- Khách hàng → EP-03 (Customer), EP-05 (Contract)
- Tài sản → EP-08 (Inventory)
- Nhân sự → EP-09 (Staff)
- Dịch vụ → EP-07 (Service usage)

## Features thuộc Epic này

### Phase 3 – Core Reports

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-76 | Revenue Report | Doanh thu theo tháng/quý/năm, breakdown theo loại | Draft |
| F-77 | Occupancy Analytics | Tỷ lệ lấp đầy, peak/off-peak, trends theo tòa nhà | Draft |
| F-78 | Customer Analytics | CLV, retention rate, churn, top customers | Draft |
| F-79 | Service Usage Report | Dịch vụ bán chạy, doanh thu theo dịch vụ | Draft |
| F-80 | Asset & Maintenance Report | Tài sản theo trạng thái, chi phí bảo trì | Draft |
| F-81 | Staff Performance Report | Số hợp đồng, booking xử lý theo nhân viên | Draft |
| F-82 | Report Export | Export PDF/Excel cho tất cả reports | Draft |

### Phase 4 – Advanced (tương lai)
- F-83: Scheduled/automated reports (gửi email định kỳ)
- F-84: Custom report builder (kéo thả chọn metrics)
- F-85: Multi-building consolidated report (cho chain)
- F-86: Forecast & prediction (ML-based)

## Data Models

### ReportFilter (shared)
```typescript
interface ReportFilter {
  dateFrom: Date;
  dateTo: Date;
  buildingId?: string;          // null = tất cả tòa nhà
  floorId?: string;
  spaceType?: SpaceType;
  granularity: 'day' | 'week' | 'month' | 'quarter' | 'year';
}
```

### RevenueReport
```typescript
interface RevenueReport {
  filter: ReportFilter;
  summary: {
    totalRevenue: number;
    totalInvoices: number;
    paidAmount: number;
    unpaidAmount: number;
    overdueAmount: number;
    avgRevenuePerBooking: number;
    revenueGrowth: number;        // % so với kỳ trước
  };
  byPeriod: { period: string; revenue: number; invoiceCount: number }[];
  byPaymentMethod: { method: PaymentMethod; amount: number; percent: number }[];
  bySpaceType: { type: SpaceType; revenue: number; percent: number }[];
  byBuilding: { buildingId: string; buildingName: string; revenue: number }[];
}
```

### OccupancyReport
```typescript
interface OccupancyReport {
  filter: ReportFilter;
  summary: {
    avgOccupancyRate: number;     // %
    totalSpaces: number;
    avgOccupiedSpaces: number;
    peakRate: number;             // highest rate in period
    offPeakRate: number;          // lowest rate in period
  };
  byPeriod: { period: string; occupancyRate: number; occupiedSpaces: number }[];
  bySpaceType: { type: SpaceType; occupancyRate: number }[];
  byBuilding: { buildingId: string; buildingName: string; occupancyRate: number }[];
  peakHours: { hour: number; avgOccupancy: number }[];  // 0-23
}
```

### CustomerAnalyticsReport
```typescript
interface CustomerAnalyticsReport {
  filter: ReportFilter;
  summary: {
    totalCustomers: number;
    newCustomers: number;
    activeCustomers: number;
    churnedCustomers: number;
    retentionRate: number;        // %
    avgCLV: number;               // Customer Lifetime Value (VND)
  };
  topCustomers: {
    customerId: string;
    name: string;
    totalSpend: number;
    bookingCount: number;
    contractCount: number;
    clv: number;
  }[];
  byType: { type: CustomerType; count: number; revenue: number }[];
  acquisitionTrend: { period: string; newCustomers: number; churned: number }[];
}
```

### AssetReport
```typescript
interface AssetReport {
  filter: { buildingId?: string; category?: AssetCategory };
  summary: {
    totalAssets: number;
    activeAssets: number;
    inMaintenanceAssets: number;
    brokenAssets: number;
    retiredAssets: number;
    totalMaintenanceCost: number;
    avgMaintenanceCostPerAsset: number;
  };
  byCategory: { category: AssetCategory; count: number; totalValue: number; maintenanceCost: number }[];
  maintenanceLogs: {
    period: string;
    scheduledCount: number;
    completedCount: number;
    totalCost: number;
  }[];
  depreciation: {
    assetId: string;
    name: string;
    purchaseCost: number;
    estimatedCurrentValue: number;
    depreciationPercent: number;
  }[];
}
```

## User Stories

### US-76: Xem Revenue Report
> Là **Nhà đầu tư / Kế toán**, tôi muốn **xem báo cáo doanh thu chi tiết** để **phân tích lợi nhuận và dòng tiền**

**Acceptance Criteria**:
- [ ] Chọn date range (preset: tháng này, quý này, năm nay; custom range)
- [ ] Filter theo tòa nhà, loại không gian
- [ ] Summary cards: Tổng doanh thu, Đã thu, Chưa thu, Quá hạn, Tăng trưởng so kỳ trước (%)
- [ ] Chart: Revenue trend theo granularity được chọn (line chart)
- [ ] Bảng breakdown: theo phương thức thanh toán, theo loại không gian, theo tòa nhà
- [ ] Có thể export PDF/Excel (F-82)
- [ ] Giới hạn query: tối đa 24 tháng (performance)

### US-77: Xem Occupancy Analytics
> Là **Manager**, tôi muốn **xem tỷ lệ lấp đầy và xu hướng** để **tối ưu pricing và hoạt động**

**Acceptance Criteria**:
- [ ] Chọn date range và granularity (ngày/tuần/tháng)
- [ ] Filter theo tòa nhà, loại không gian
- [ ] Summary cards: Avg occupancy rate, Số không gian TB được thuê, Peak rate, Off-peak rate
- [ ] Chart: Occupancy trend (line chart)
- [ ] Heatmap giờ cao điểm (0-23h) trong ngày
- [ ] Bảng so sánh giữa các loại không gian (Hot Desk vs Private Office vs Meeting Room)
- [ ] Bảng so sánh giữa các tòa nhà
- [ ] Export PDF/Excel (F-82)

### US-78: Xem Customer Analytics
> Là **Manager / Sale**, tôi muốn **xem phân tích khách hàng** để **cải thiện retention và tập trung vào khách có giá trị cao**

**Acceptance Criteria**:
- [ ] Summary: Tổng KH, KH mới, KH active, KH churn, Retention rate (%), Avg CLV
- [ ] Chart: Acquisition & churn trend theo kỳ
- [ ] Danh sách Top 10 khách hàng theo tổng chi tiêu
- [ ] Breakdown theo loại khách hàng (Individual vs Enterprise)
- [ ] CLV = tổng doanh thu từ KH đó trong toàn bộ lịch sử
- [ ] Export danh sách khách hàng kèm metrics (Excel)

### US-79: Xem Service Usage Report
> Là **Manager**, tôi muốn **biết dịch vụ nào được sử dụng nhiều nhất** để **tối ưu danh mục dịch vụ**

**Acceptance Criteria**:
- [ ] Chọn date range
- [ ] Bảng: Tên dịch vụ, Số lần sử dụng, Tổng doanh thu, % trên tổng
- [ ] Chart: Top 5 dịch vụ theo doanh thu (bar chart)
- [ ] Trend số lần sử dụng theo tháng
- [ ] Export Excel

### US-80: Xem Asset & Maintenance Report
> Là **Admin / Manager**, tôi muốn **xem tình trạng tài sản và chi phí bảo trì** để **lập kế hoạch ngân sách**

**Acceptance Criteria**:
- [ ] Summary: Tổng tài sản, Active, Đang bảo trì, Hỏng, Tổng chi phí bảo trì kỳ
- [ ] Breakdown tài sản theo danh mục (bảng + pie chart)
- [ ] Trend chi phí bảo trì theo tháng (bar chart)
- [ ] Bảng tài sản cần chú ý: broken + scheduled maintenance sắp tới
- [ ] Khấu hao tài sản: tính toán estimated current value dựa trên ngày mua
- [ ] Export Excel danh sách tài sản kèm thông tin khấu hao

### US-81: Xem Staff Performance Report
> Là **Admin / Manager**, tôi muốn **xem hiệu suất nhân viên** để **đánh giá và phân công công việc**

**Acceptance Criteria**:
- [ ] Chọn date range
- [ ] Bảng: Nhân viên, Số booking xử lý, Số hợp đồng ký, Doanh thu mang lại, Số task bảo trì hoàn thành
- [ ] Filter theo phòng ban / role
- [ ] Export Excel

### US-82: Export báo cáo
> Là **Kế toán / Investor**, tôi muốn **export báo cáo ra PDF hoặc Excel** để **lưu trữ và trình bày**

**Acceptance Criteria**:
- [ ] Nút Export PDF và Export Excel xuất hiện trên mọi báo cáo
- [ ] PDF: logo công ty, tiêu đề báo cáo, filter đã áp dụng, bảng số liệu, charts (nếu có)
- [ ] Excel: mỗi breakdown là 1 sheet; có sheet Summary
- [ ] File name format: `[ReportType]-[YYYY-MM]-export.[ext]` (VD: `revenue-2026-04-export.pdf`)
- [ ] Với báo cáo lớn (> 6 tháng, > 1000 rows): xử lý async, thông báo khi xong (hoặc download trực tiếp nếu < 5s)
- [ ] Không export được nếu không có dữ liệu trong khoảng thời gian đã chọn

## Phụ thuộc

| Phụ thuộc vào | Lý do |
|---------------|-------|
| EP-06 Payment | Nguồn dữ liệu doanh thu, invoices |
| EP-07 Credit | Doanh thu từ credit top-up, service charges |
| EP-04 Booking | Dữ liệu lấp đầy, số booking |
| EP-02 Property | Thông tin tòa nhà, loại không gian |
| EP-03 Customer | Dữ liệu khách hàng, CLV |
| EP-05 Contract | Hợp đồng, giá trị hợp đồng |
| EP-08 Inventory | Dữ liệu tài sản, chi phí bảo trì |
| EP-09 Staff | Dữ liệu nhân viên, performance |

## Non-functional Requirements

| NFR | Yêu cầu |
|-----|---------|
| Performance | Query báo cáo ≤ 5s với range ≤ 3 tháng; ≤ 15s với range ≤ 12 tháng |
| Date range limit | Tối đa 24 tháng cho 1 query; khuyến nghị dùng granularity phù hợp |
| Caching | Cache kết quả báo cáo 15 phút (invalidate khi có giao dịch mới) |
| Export timeout | File > 5MB hoặc > 10,000 rows → xử lý async, notify khi xong |
| Access control | Revenue/Customer report: chỉ admin, manager, investor, accountant; Asset report: thêm maintenance |

## Ghi chú
- Phase 3 vì Phase 1 Dashboards (EP-11) đã cung cấp đủ KPIs cơ bản cho vận hành hàng ngày
- Nên implement F-76 (Revenue) và F-77 (Occupancy) trước vì đây là 2 báo cáo được hỏi nhiều nhất
- F-82 (Export) implement song song với F-76, F-77 để tránh refactor sau
