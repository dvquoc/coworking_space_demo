# EP-07 – Service Management

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-07 |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |
| Độ ưu tiên | Must have |

## Mô tả

Quản lý các dịch vụ đi kèm coworking space: điện, nước, internet, in ấn/photocopy/scan, lễ tân/nhận thư, tủ locker cá nhân, pantry (cà phê, nước, snack). Theo dõi usage, tính phí, tích hợp vào invoices.

## Features thuộc Epic này

### Phase 1 - Basic Features

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-51 | Service catalog | Danh mục dịch vụ available | Draft |
| F-52 | Service packages | Gói dịch vụ theo contract | Draft |
| F-53 | Usage tracking | Theo dõi usage (kWh điện, m³ nước, số trang in) | Draft |
| F-54 | Service billing | Tính phí dịch vụ hàng tháng | Draft |

### Phase 2 - Advanced Features
- F-55: Meter reading integration (IoT sensors)
- F-56: Service usage analytics
- F-57: Add-on services on-demand

## Data Models

### Service
```typescript
interface Service {
  id: string;
  name: string;                 // "Electricity", "Water", "Internet", "Printing"
  category: ServiceCategory;
  billingType: 'usage_based' | 'flat_rate' | 'one_time';
  unitPrice: number;            // Giá per unit
  unit: string;                 // "kWh", "m³", "page", "month"
  status: 'active' | 'inactive';
  description: string;
}

enum ServiceCategory {
  UTILITIES = 'utilities',     // Điện, nước
  INTERNET = 'internet',
  PRINTING = 'printing',        // In ấn
  RECEPTION = 'reception',      // Lễ tân
  LOCKER = 'locker',
  PANTRY = 'pantry',
  OTHER = 'other'
}
```

### ServicePackage
```typescript
interface ServicePackage {
  id: string;
  name: string;                 // "Basic Package", "Premium Package"
  services: {
    serviceId: string;
    includedUnits?: number;     // FREE units, vượt quá sẽ charge thêm
  }[];
  monthlyFee: number;
  description: string;
}
```

### ServiceUsage
```typescript
interface ServiceUsage {
  id: string;
  customerId: string;
  serviceId: string;
  buildingId: string;
  
  // Usage Details
  usageMonth: string;           // "2026-04"
  unitsUsed: number;            // 150 (kWh, pages, m³, etc.)
  unitPrice: number;
  totalCharge: number;
  
  // Billing
  invoiceId?: string;           // Link to invoice sau khi bill
  billingStatus: 'pending' | 'invoiced' | 'paid';
  
  // Metadata
  notes?: string;
  recordedBy: string;
  recordedAt: Date;
  createdAt: Date;
}
```

## User Stories

### US-51: Service catalog
> Là **Manager**, tôi muốn **xem tất cả services available** để **inform customers**

**Acceptance Criteria**:
- [ ] List services với name, category, price, unit
- [ ] Add/edit/deactivate services (Admin only)
- [ ] Filter by category

### US-52: Assign service package to contract
> Là **Manager**, tôi muốn **assign service package cho contract** để **customers có dịch vụ đi kèm**

**Acceptance Criteria**:
- [ ] Khi tạo contract, chọn service package (Basic/Premium/Custom)
- [ ] Package includes services với included units
- [ ] Customers sử dụng vượt quá → charge thêm

### US-53: Record service usage
> Là **Bảo trì/Manager**, tôi muốn **ghi nhận usage hàng tháng** để **bill chính xác**

**Acceptance Criteria**:
- [ ] Nhập usage cho customer: electricity (kWh), water (m³), printing (pages)
- [ ] Calculate charge = usage × unit price
- [ ] Usage record saved cho customer/month

### US-54: Generate service invoice
> Là **Kế toán**, tôi muốn **tạo invoice hàng tháng cho services** để **thu phí**

**Acceptance Criteria**:
- [ ] Mỗi tháng, tổng hợp usage của customers
- [ ] Generate invoice với items: "Electricity - 150 kWh - 450,000 VND"
- [ ] Link invoice to serviceUsage records
- [ ] Send invoice to customers

## Scenarios

### Scenario 1: Record electricity usage
```
Given Customer "CUS-001" sử dụng điện tháng 04/2026
When Bảo trì nhập usage: 150 kWh
And Unit price: 3,000 VND/kWh
And System calculate: 150 × 3,000 = 450,000 VND
Then ServiceUsage record created, status pending
```

### Scenario 2: Service package với included units
```
Given Customer "CUS-005" có package "Premium" (includes 100 kWh free)
When Usage tháng = 150 kWh
Then Charge chỉ cho 50 kWh vượt quá: 50 × 3,000 = 150,000 VND
```

### Scenario 3: Monthly service billing
```
Given Cuối tháng 04/2026, có 50 customers với service usage
When Kế toán click "Generate Service Invoices"
Then System tạo 50 invoices với service charges
And Mark serviceUsage.billingStatus → invoiced
```

## Phụ thuộc

**Phụ thuộc vào**:
- EP-03: Customer
- EP-05: Contract (service packages link to contracts)
- EP-06: Payment (service charges vào invoices)

## Out of Scope Phase 1
- IoT meter integration (auto-read usage)
- Service usage analytics & predictions
- Real-time usage monitoring

## Technical Notes

### Cronjobs
- **Monthly billing**: Tự động tạo service invoices vào ngày 1 hàng tháng

### Business Rules
- Services với flat_rate: Charge cố định mỗi tháng
- Services với usage_based: Charge theo actual usage
- Included units: Free quota, vượt quá mới charge

## Ghi chú
- Phase 1: Manual meter reading, basic billing
- Phase 2: IoT integration, real-time monitoring
