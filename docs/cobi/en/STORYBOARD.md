# STORYBOARD & WIREFRAME
# Coworking Space Management Software — Cobi

> **Project**: Coworking Space Operations Management System  
> **Client**: Cobi  
> **Date**: 18/04/2026  
> **Version**: 1.0

---

## 1. System Overview

The system consists of **45+ screens**, divided into **10 functional groups**, serving **6 user roles**:

| Role | Description | Primary Access |
|------|-------------|----------------|
| **Admin** | Full system administration | All modules |
| **Manager** | Daily operations management | Bookings, Contracts, Customers, CRM |
| **Sale** | Sales & business development | Bookings, CRM, Customers, Pricing |
| **Accountant** | Finance & accounting | Invoices, Payments, Credits, Reports |
| **Maintenance** | Maintenance & technical | Maintenance, Assets |
| **Investor** | Investor overview | Overview Dashboard, Reports |

---

## 2. Screen List by Module

### 2.1 Authentication & Login (4 screens)

| # | Screen | Description | Notes |
|---|--------|-------------|-------|
| 1 | **Login** | Email + password, demo account selector | Supports 6 roles |
| 2 | **Forgot Password** | Enter email to receive OTP code | OTP via email |
| 3 | **OTP Verification** | Enter 6-digit OTP code | Expires after 5 minutes |
| 4 | **Reset Password** | Enter new password | Strength validation |

**Flow**: Login → Dashboard (by role) · Forgot PW → OTP → Reset PW → Login

---

### 2.2 Dashboard — 6 Role-based Control Panels (7 screens)

| # | Screen | Role | Key KPIs |
|---|--------|------|----------|
| 5 | **Overview Dashboard** | Default | Quick overview, redirects by role |
| 6 | **Admin Dashboard** | Admin | Revenue, occupancy, customer count, assets |
| 7 | **Manager Dashboard** | Manager | Today's bookings, new customers, expiring contracts, occupancy |
| 8 | **Accountant Dashboard** | Accountant | Monthly revenue, unpaid invoices, overdue |
| 9 | **Maintenance Dashboard** | Maintenance | Assets needing maintenance, open tickets, schedule |
| 10 | **Sales Dashboard** | Sale | New leads, pipeline, sales figures, bookings created |
| 11 | **Investor Dashboard** | Investor | ROI, revenue, growth, trend charts |

> Each dashboard features charts (Recharts), KPI cards, and real-time data tables.

---

### 2.3 Building & Space Management (3 screens)

| # | Screen | Key Functions |
|---|--------|---------------|
| 12 | **Building List** | CRUD buildings, addresses, amenities, status |
| 13 | **Floor Management** | Floors by building, area, floor plan |
| 14 | **Space Management** | 8 space types, capacity, pricing, amenities, status |

**8 Space Types**: Hot Desk · Dedicated Desk · Private Office · Open Space · Meeting Room · Conference Room · Training Room · Event Space

---

### 2.4 Customer Management (2 screens)

| # | Screen | Key Functions |
|---|--------|---------------|
| 15 | **Customer List** | Search, filter by type/tag/status, statistics, create new |
| 16 | **Customer Details** | Info, employees (company), bookings, contracts, invoices, credits, history |

**3 Customer Types**: Individual · Company · Company Member (each with its own form)

---

### 2.5 Bookings (5 screens)

| # | Screen | Key Functions |
|---|--------|---------------|
| 17 | **Booking List** | Table view, filter by status/space type, quick stats |
| 18 | **Booking Calendar** | Week/day calendar, drag & drop, conflict detection |
| 19 | **Booking Board** | Kanban board by status (Pending → Confirmed → In-progress → Completed) |
| 20 | **Create/Edit Booking** | Select customer, space, time, add-on services, auto-pricing |
| 21 | **Booking Details** | Full information, timeline, actions (approve/reject/cancel) |

**Booking Flow**:
```
Select Customer → Select Space → Select Time → Conflict Detection → Add-on Services
  → Calculate Price (apply promotions/voucher) → Confirm → Create Deposit Invoice → Payment
```

---

### 2.6 Contracts (8 screens)

| # | Screen | Key Functions |
|---|--------|---------------|
| 22 | **Contract List** | Table, filter status/type, stats (active, expiring, occupancy%) |
| 23 | **Create/Edit Contract** | Select customer, space, duration, template, terms, pricing |
| 24 | **Contract Details** | Full info, timeline, related invoices, renew/terminate |
| 25 | **Contract Created** | Confirmation, next steps (create invoice, remind customer to sign) |
| 26 | **Template List** | Manage contract templates, preview, duplicate |
| 27 | **Template Form** | Create template with placeholders ({{customer_name}}, {{space_name}}, ...) |
| 28 | **Terms List** | Shared terms library |
| 29 | **Terms Form** | Create/edit individual terms |

**Contract Flow**:
```
Select Customer → Select Space → Select Template → Fill Information → Preview
  → Send to Customer → Customer Accepts Terms → Contract Active → Auto-generate Invoices
```

---

### 2.7 Invoices & Payments (1 screen, 3 modals)

| # | Screen | Key Functions |
|---|--------|---------------|
| 30 | **Invoice Management** | Tabs by status, KPIs, table, filter by source (Booking/Contract/Top-up) |
| — | *Modal: Invoice Details* | Items, subtotal, VAT, discounts, total, payment history |
| — | *Modal: Record Payment* | Amount, method (VNPay/MoMo/ZaloPay/Transfer/Cash), notes |
| — | *Modal: Create Invoice* | Select source → Customer → Items → Discount → VAT → Confirm |

**Invoice Statuses**: Unpaid · Partially Paid · Paid · Overdue · Cancelled

---

### 2.8 Pricing & Promotions (4 screens)

| # | Screen | Key Functions |
|---|--------|---------------|
| 31 | **Service Pricing** | Price by space type, add-on services, surcharges |
| 32 | **Promotions** | Create promo campaigns, conditions, duration, limits |
| 33 | **Vouchers** | Create voucher codes, usage limits, expiry dates, statistics |
| 34 | **Price Calculator** | Quick pricing: select space + time → price + surcharges + promos |

---

### 2.9 CRM — Lead Management (4 screens)

| # | Screen | Key Functions |
|---|--------|---------------|
| 35 | **Lead List** | Table, filter by source/status/assigned staff |
| 36 | **Lead Kanban** | Pipeline: New → Contacted → Qualified → Proposal → Negotiation → Won/Lost |
| 37 | **Lead Details** | Full info, activity timeline, notes, appointments |
| 38 | **Campaigns** | Marketing campaign management, lead source tracking |

---

### 2.10 Other Modules (6+ screens)

| # | Screen | Module | Key Functions |
|---|--------|--------|---------------|
| 39 | **Credits** | Credit | Customer wallet, top-up/spend history, bonus campaigns |
| 40 | **Maintenance** | Maintenance | Maintenance tickets, status, timeline |
| 41 | **Asset Management** | Inventory | Asset list, serial numbers, location, condition |
| 42 | **Reports** | Reports | Revenue, occupancy, CLV, PDF/Excel export |
| 43 | **403 Page** | Error | Access denied |
| 44 | **404 Page** | Error | Page not found |

---

## 3. Core Business Flows

### 3.1 Booking & Payment Flow (End-to-End)

```
Customer contacts
        │
        ▼
┌─────────────────┐
│ Create Customer  │ ← Sale/Manager enters information
│                 │   (Individual/Company/Member)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Create Booking   │ ← Select customer, space, time
│                 │   Auto conflict detection
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────────┐
│ Create Invoice   │────▶│ Payment              │
│ (Deposit/Full)   │     │ VNPay/MoMo/ZaloPay   │
└────────┬────────┘     │ Transfer/Cash/Credits │
         │              └──────────────────────┘
         ▼
┌─────────────────┐
│ Confirm Booking  │ ← Auto after payment
│                 │   or manual Manager approval
└─────────────────┘
```

### 3.2 Long-term Contract Flow

```
Long-term tenant customer
        │
        ▼
┌─────────────────┐
│ Create Contract  │ ← Select template, fill details
│                 │   Preview contract content
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Send for Approval│ ← Customer views & accepts terms
│                 │   Electronic contract
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────────┐
│ Contract Active  │────▶│ Recurring Invoices    │
│                 │     │ Automatically monthly │
└────────┬────────┘     └──────────────────────┘
         │
         ▼
┌─────────────────┐
│ Renew/Terminate  │ ← Alert 30 days before expiry
│                 │
└─────────────────┘
```

### 3.3 CRM Flow (Lead → Customer)

```
Leads from multiple sources
  (Website, Referrals, Events, etc.)
        │
        ▼
┌─────────────────┐
│ New Lead         │ ← Enter lead info
│                 │   Assign to Sales rep
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Kanban Pipeline  │ ← Drag & drop through stages
│ Contacted       │   New → Contacted → Qualified
│ → Qualified     │   → Proposal → Negotiation
│ → Proposal      │   → Won / Lost
│ → Won ✅        │
└────────┬────────┘
         │ (Won)
         ▼
┌─────────────────┐
│ Convert to       │ ← Auto-create customer profile
│ Customer         │   → Create Booking or Contract
└─────────────────┘
```

---

## 4. UI Design

### 4.1 Design System

| Component | Value |
|-----------|-------|
| **Primary Color** | `#b11e29` (Cobi red) |
| **Hover Color** | `#8f1820` |
| **Font** | Inter (System Font) |
| **Border Radius** | `rounded-xl` (12px) for cards, `rounded-lg` (8px) for inputs |
| **Shadow** | `shadow-sm` for cards |
| **Background** | `slate-50` (page), `white` (cards) |
| **CSS Framework** | Tailwind CSS v4 |
| **Icons** | Lucide React |
| **Charts** | Recharts v3 |

### 4.2 General Layout

```
┌───────────────────────────────────────────────────────┐
│ Header: Logo ── Breadcrumb ── Language ── User Menu   │
├──────────┬────────────────────────────────────────────┤
│          │                                            │
│ Sidebar  │  Main Content Area                         │
│          │                                            │
│ ● Dashboard  │  ┌──────────────────────────────────┐  │
│ ● Buildings  │  │  Page Header + Actions          │  │
│ ● Customers  │  ├──────────────────────────────────┤  │
│ ● Bookings   │  │                                  │  │
│ ● Contracts  │  │  KPI Cards / Filters             │  │
│ ● Invoices   │  │                                  │  │
│ ● Pricing    │  ├──────────────────────────────────┤  │
│ ● Credits    │  │                                  │  │
│ ● CRM        │  │  Table / Grid / Calendar          │  │
│ ● Maintenance│  │                                  │  │
│ ● Assets     │  │                                  │  │
│ ● Reports    │  │                                  │  │
│              │  └──────────────────────────────────┘  │
│              │                                        │
├──────────┴────────────────────────────────────────────┤
│ 📱 Responsive: Sidebar hidden on mobile, hamburger    │
└───────────────────────────────────────────────────────┘
```

### 4.3 Design Patterns

| Pattern | Used In |
|---------|---------|
| **KPI Cards** | Dashboard, Booking List, Invoice, Contract List |
| **Data Table** | All list pages |
| **Filter Bar** | Search + Select + Date range + Create button |
| **Modal Form** | Create invoice, record payment, create customer, small forms |
| **Full-page Form** | Create booking, contract, template |
| **Detail Page** | Customer, booking, contract details |
| **Kanban Board** | Booking Status, Lead Pipeline |
| **Calendar View** | Booking Calendar (week/day) |
| **Tab Navigation** | Invoice status tabs, Customer detail tabs |
| **Badge/Chip** | Status, tags, customer type |

---

## 5. Multi-language

The entire interface supports **3 languages** with real-time switching:

| Language | Code | Status |
|----------|------|--------|
| 🇻🇳 Vietnamese | `vi` | Default |
| 🇬🇧 English | `en` | Complete |
| 🇰🇷 한국어 | `ko` | Complete |

**14 translation namespaces**: common, auth, dashboard, properties, customers, bookings, contracts, invoices, pricing, credits, crm, inventory, maintenance, reports

---

## 6. Summary

| Criteria | Count |
|----------|-------|
| Total Screens | **45+** |
| Dashboards | **6** (role-based) |
| Business Modules | **17** |
| Features | **98+** |
| Languages | **3** |
| Roles | **6** |
| Space Types | **8** |

> 💡 **UI prototype is 95% complete** — Cobi can experience the demo now to evaluate before backend development.
