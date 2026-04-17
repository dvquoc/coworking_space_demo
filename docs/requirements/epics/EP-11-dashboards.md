# EP-11 – Role-based Dashboards

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-11 |
| Người tạo | BA |
| Ngày tạa | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |
| Độ ưu tiên | Must have ⭐ CRITICAL |

## Mô tả

Mỗi user role (Investor, Admin, Manager, Bảo trì, Kế toán, Sale) có dashboard riêng với KPIs, charts, shortcuts phù hợp với trách nhiệm. Dashboard là landing page sau khi login.

## Features thuộc Epic này

### Phase 1 - Basic Dashboards

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-81 | Investor Dashboard | Revenue, occupancy rate, ROI metrics | Draft |
| F-82 | Admin Dashboard | System overview, user activity, alerts | Draft |
| F-83 | Manager Dashboard | Operations: bookings, customers, spaces | Draft |
| F-84 | Maintenance Dashboard | Asset status, maintenance tasks, issues | Draft |
| F-85 | Accounting Dashboard | Invoices, payments, revenue, AR aging | Draft |
| F-86 | Sales Dashboard | Leads, conversions, pipeline, targets | Draft |

### Phase 2 - Advanced Features
- F-87: Customizable widgets
- F-88: Dashboard data export
- F-89: Real-time notifications panel

## Dashboard Designs

### 1. Investor Dashboard (Role: Nhà đầu tư)

**Purpose**: High-level business metrics, financial performance

**KPIs (4 cards)**:
- Total Revenue (month): 450,000,000 VND (+12% vs last month)
- Occupancy Rate: 78% (85/109 spaces occupied)
- Active Customers: 142 (+8 this month)
- Monthly Profit Margin: 28%

**Charts**:
- Revenue trend (12 months) - Line chart
- Occupancy by building - Bar chart
- Revenue by space type - Pie chart

**Quick Links**:
- View Financial Reports
- Export Revenue Report (PDF)

---

### 2. Admin Dashboard (Role: Admin)

**Purpose**: System health, user management, security alerts

**KPIs**:
- Total Users: 45
- Active Sessions: 12
- System Uptime: 99.8%
- Pending Approvals: 3

**Widgets**:
- Recent user activities (audit log table)
- System alerts (low disk space, failed backups)
- User login statistics

**Quick Actions**:
- Manage Users
- View Audit Logs
- System Settings

---

### 3. Manager Dashboard (Role: Manager)

**Purpose**: Day-to-day operations monitoring

**KPIs**:
- Today's Bookings: 18
- Check-ins Today: 12
- Check-outs Today: 5
- Pending Requests: 7

**Charts**:
- Weekly booking trend - Line chart
- Space utilization by floor - Bar chart
- Top 5 customers (by revenue) - List

**Widgets**:
- Upcoming bookings (today + next 3 days)
- Expiring contracts (next 30 days)
- Recent customer inquiries

**Quick Actions**:
- Create Booking
- Add Customer
- View Calendar

---

### 4. Maintenance Dashboard (Role: Bảo trì)

**Purpose**: Asset health, maintenance tasks

**KPIs**:
- Total Assets: 342
- Assets in Maintenance: 8
- Broken Assets: 3
- Scheduled Tasks (this week): 12

**Widgets**:
- Maintenance task list (with due dates):
  - [Overdue] Fix AC in Room 205
  - [Today] Inspect fire extinguishers
  - [Tomorrow] Routine cleaning Meeting Room A
- Assets by status (chart: active/maintenance/broken)
- Recent maintenance logs

**Quick Actions**:
- Log Maintenance
- Report Broken Asset
- View Asset List

---

### 5. Accounting Dashboard (Role: Kế toán)

**Purpose**: Financial tracking, invoicing, AR/AP

**KPIs**:
- Invoices Issued (month): 156
- Total Receivable: 85,000,000 VND
- Overdue Invoices: 12 (8,500,000 VND)
- Payment Collection Rate: 92%

**Charts**:
- Monthly revenue vs target - Bar chart
- Invoice status breakdown - Pie chart (pending/paid/overdue)
- AR aging (0-30, 31-60, 61-90, 90+ days) - Stacked bar

**Widgets**:
- Recent payments (table)
- Overdue invoices list
- Upcoming service billings

**Quick Actions**:
- Create Invoice
- Record Payment
- View Reports

---

### 6. Sales Dashboard (Role: Sale)

**Purpose**: Lead pipeline, conversion tracking, targets

**KPIs**:
- Active Leads: 45
- Conversion Rate (month): 18%
- New Customers (month): 12
- Monthly Target: 15 customers (80% achieved)

**Charts**:
- Lead funnel (Inquiry → Tour → Proposal → Closed) - Funnel chart
- Monthly conversion trend - Line chart
- Lead source breakdown - Pie chart (website, referral, ads)

**Widgets**:
- My leads (status: new/contacted/tour_scheduled)
- Upcoming tours & meetings
- Recent closed deals

**Quick Actions**:
- Add Lead
- Schedule Tour
- Create Contract

---

## Data Models

### DashboardWidget (optional - for customization in Phase 2)
```typescript
interface DashboardWidget {
  id: string;
  userId: string;
  role: UserRole;
  widgetType: 'kpi_card' | 'chart' | 'table' | 'list';
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;  // Widget-specific config
  isVisible: boolean;
}
```

## User Stories

### US-81: Investor views dashboard
> Là **Nhà đầu tư**, tôi muốn **xem dashboard với revenue và occupancy** để **monitor business performance**

**Acceptance Criteria**:
- [ ] Login → redirect to Investor Dashboard
- [ ] 4 KPI cards: Revenue, Occupancy, Customers, Profit Margin
- [ ] Charts: Revenue trend, Occupancy by building
- [ ] Quick link: "View Financial Reports"

### US-82: Admin monitors system health
> Là **Admin**, tôi muốn **xem system status và user activities** để **ensure smooth operations**

**Acceptance Criteria**:
- [ ] KPIs: Total Users, Active Sessions, Uptime
- [ ] Audit log widget (last 20 activities)
- [ ] System alerts visible
- [ ] Quick action: "Manage Users"

### US-83: Manager checks daily operations
> Là **Manager**, tôi muốn **xem bookings, check-ins hôm nay** để **plan workload**

**Acceptance Criteria**:
- [ ] KPIs: Today's Bookings, Check-ins, Check-outs, Pending Requests
- [ ] Widget: Upcoming bookings (next 3 days)
- [ ] Widget: Expiring contracts (next 30 days)
- [ ] Quick actions: Create Booking, Add Customer

### US-84: Maintenance views tasks
> Là **Bảo trì**, tôi muốn **xem danh sách maintenance tasks** để **prioritize work**

**Acceptance Criteria**:
- [ ] KPIs: Total Assets, In Maintenance, Broken
- [ ] Task list sorted by due date
- [ ] Overdue tasks highlighted red
- [ ] Quick action: "Log Maintenance"

### US-85: Accounting tracks invoices
> Là **Kế toán**, tôi muốn **xem invoices và payments** để **monitor cash flow**

**Acceptance Criteria**:
- [ ] KPIs: Invoices Issued, Receivable, Overdue, Collection Rate
- [ ] Chart: Invoice status breakdown
- [ ] Widget: Overdue invoices list
- [ ] Quick action: "Create Invoice"

### US-86: Sales monitors pipeline
> Là **Sale**, tôi muốn **xem lead pipeline và conversion** để **track targets**

**Acceptance Criteria**:
- [ ] KPIs: Active Leads, Conversion Rate, Monthly Target progress
- [ ] Funnel chart: Inquiry → Tour → Proposal → Closed
- [ ] Widget: My leads (assigned to me)
- [ ] Quick action: "Add Lead"

## Scenarios

### Scenario 1: Manager login → dashboard
```
Given User "john@cobi.vn" with role Manager
When Login successful
Then Redirect to /dashboard/manager
And Display:
  - KPIs: Today's bookings (18), Check-ins (12)
  - Chart: Weekly booking trend
  - Widget: Upcoming bookings table
And Quick actions visible: "Create Booking", "Add Customer"
```

### Scenario 2: Kế toán sees overdue invoices alert
```
Given User "accounting@cobi.vn" role Kế toán
When Open dashboard
Then See KPI: Overdue Invoices = 12 (highlighted red)
And Widget "Overdue Invoices" shows:
  - INV-1024: Customer ABC, 2,500,000 VND, 15 days overdue
  - INV-1031: Customer XYZ, 1,200,000 VND, 8 days overdue
And Click invoice → open invoice details for follow-up
```

### Scenario 3: Investor exports revenue report
```
Given Investor views dashboard
When Click "Export Revenue Report"
Then System generates PDF with:
  - Revenue summary (last 12 months)
  - Occupancy rate trend
  - Top 10 customers
And Download file: "revenue-report-2026-04.pdf"
```

## Phụ thuộc

**Phụ thuộc vào**: Tất cả Epics khác
- EP-01: Auth (role-based routing)
- EP-02: Property (occupancy data)
- EP-03: Customer (customer count)
- EP-04: Booking (booking stats)
- EP-05: Contract (contract expiry)
- EP-06: Payment (revenue, invoices, AR)
- EP-07: Service (service revenue)
- EP-08: Asset (asset status)
- EP-12: CRM (lead pipeline for Sales dashboard)

## Out of Scope Phase 1
- Customizable widgets (drag-and-drop layout)
- Real-time data refresh (websockets)
- Dashboard sharing/snapshots

## Technical Notes

### Implementation Strategy
1. **Shared components**: KPI Card, Chart Wrapper (Recharts)
2. **Dashboard routes**:
   - `/dashboard/investor` → InvestorDashboard.tsx
   - `/dashboard/admin` → AdminDashboard.tsx
   - `/dashboard/manager` → ManagerDashboard.tsx
   - `/dashboard/maintenance` → MaintenanceDashboard.tsx
   - `/dashboard/accounting` → AccountingDashboard.tsx
   - `/dashboard/sales` → SalesDashboard.tsx
3. **Data fetching**: TanStack Query hooks per dashboard
   - `useInvestorDashboard()` fetches revenue, occupancy, etc.
   - Each hook calls `/api/dashboard/{role}` endpoint
4. **Access control**: ProtectedRoute checks `user.role`, redirects to correct dashboard

### API Endpoints
```
GET /api/dashboard/investor
GET /api/dashboard/admin
GET /api/dashboard/manager
GET /api/dashboard/maintenance
GET /api/dashboard/accounting
GET /api/dashboard/sales
```

### Database Queries Optimization
- **Revenue aggregation**: `SUM(amount) WHERE status=paid GROUP BY month`
- **Occupancy rate**: `COUNT(spaces WHERE status=occupied) / COUNT(spaces)`
- **Cache**: Dashboard data cached 5 minutes (React Query)

## Ghi chú
- Dashboard là first impression → UI phải clean, fast, informative
- Phase 1: Static layout, basic charts
- Phase 2: Customizable widgets, real-time updates
- **Critical**: Must implement all 6 dashboards in Phase 1 để demo đầy đủ cho stakeholders
