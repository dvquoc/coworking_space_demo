# PROJECT TIMELINE From POPOPLUS
# Coworking Space Management Software — Cobi

> **Project**: Coworking Space Operations Management System  
> **Client**: Cobi  
> **Vendor**: POPOPLUS  
> **Date**: 18/04/2026  
> **Total Duration**: 10 months (3 phases)

---

## 1. Timeline Overview

```
         Phase 1                    Phase 2           Phase 3
    ┌──────────────────┐      ┌──────────────┐   ┌──────────┐
    │   5 months       │      │   3 months   │   │  2 months│
    │   Web App        │      │   Mobile     │   │  Advanced│
    │   20 weeks       │      │   12 weeks   │   │  8 weeks │
    ├──────────────────┤      ├──────────────┤   ├──────────┤
T0 ─┤ Kickoff          │      │              │   │          ├── T10
    │ S1-S2: Foundation│      │ Mobile App   │   │ Reports  │
    │ S3-S4: Cust&Price│      │ CRM          │   │ Staff    │
    │ S5-S7: Business  │      │ Events       │   │ Portal   │
    │ S8-S9: Support   │      │ Feedback     │   │ i18n     │
    │ S10: UAT&Go-live │      │ Access Ctrl  │   │ Optimize │
    └──────────────────┘      └──────────────┘   └──────────┘
```

| Phase | Duration | Platform | Priority |
|-------|----------|----------|----------|
| **Phase 1** — Core Operations | Month 1-5 | 🖥️ Web App | ⭐ Required |
| **Phase 2** — Expansion & Mobile | Month 6-8 | 📱 Mobile + Web | Recommended |
| **Phase 3** — Advanced & Finalization | Month 9-10 | 🖥️ Web App | Nice to have |

---

## 2. Phase 1: Core Operations (5 months — 20 weeks)

> 🖥️ **Web Platform** — Responsive (Desktop, Tablet, Mobile browser)

### Detailed Timeline

```
Month 1              Month 2              Month 3              Month 4              Month 5
┌────┬────┐      ┌────┬────┐      ┌────┬────┐      ┌────┬────┐      ┌────┬────┐
│ W1 │ W2 │      │ W3 │ W4 │      │ W5 │ W6 │      │ W7 │ W8 │      │ W9 │W10 │
├────┴────┤      ├────┴────┤      ├────┴────┤      ├────┼────┤      ├────┴────┤
│ Kickoff │      │ Sprint  │      │ Sprint  │      │S5-6│ S7 │      │ Sprint  │
│ & Setup │      │  1—2    │      │  3—4    │      │    │    │      │  8—10   │
│         │      │Foundation│     │Cust&Price│     │ Business │      │Support  │
│ DB Design│     │Auth     │      │Customer │      │Booking  │      │+UAT     │
│ Infra   │      │Property │      │Pricing  │      │Contract │      │Go-live  │
│ CI/CD   │      │API      │      │Engine   │      │Payment  │      │Training │
└─────────┘      └─────────┘      └─────────┘      └─────────┘      └─────────┘
    📋               🔧               👥               💼               🚀
```

### Sprint-by-Sprint

| Sprint | Week | Duration | Modules | Deliverables |
|--------|------|----------|---------|--------------|
| **S0** Kickoff | 1—2 | 2 weeks | — | DB design (40+ entities), CI/CD, staging environment |
| **S1** Foundation I | 3—4 | 2 weeks | Auth, Property (Buildings) | 6-role login, building CRUD |
| **S2** Foundation II | 5—6 | 2 weeks | Property (Floors, Spaces) | Floor + space CRUD, 8 space types, FE integration |
| **S3** Customer | 7—8 | 2 weeks | Customer | 3 customer types, credit wallet, import/export |
| **S4** Pricing | 9—10 | 2 weeks | Pricing, Promotions | Pricing engine, promotions, vouchers, calculator |
| **S5** Booking | 11—12 | 2 weeks | Bookings | Calendar, conflict detection, instant/request-to-book |
| **S6** Contract | 13—14 | 2 weeks | Contracts | Templates, e-contract, terms, preview |
| **S7** Payment | 15—16 | 2 weeks | Payments | VNPay/MoMo/ZaloPay, invoices, deposits, partial payment |
| **S8** Support I | 17 | 1 week | Credit, Inventory | Credit system, asset management |
| **S9** Support II | 18 | 1 week | Dashboard, Portal | 6 dashboards, customer portal (booking, view) |
| **S10** UAT | 19—20 | 2 weeks | — | UAT, bug fix, performance, deploy production, training |

### Demos & Milestones

| Milestone | Week | Content | Payment |
|-----------|------|---------|---------|
| 🎯 Demo 1 | W4 | Auth + Property working | — |
| 🎯 Demo 2 | W6 | FE + Backend integration | — |
| 🎯 Demo 3 | W8 | Customer + Pricing | — |
| 💰 **Milestone 1** | **W10** | **Core business demo** (Booking + Contract) | **Payment 2** |
| 🎯 Demo 5 | W14 | VNPay/MoMo payment integration | — |
| 🎯 Demo 6 | W18 | All Phase 1 modules | — |
| 🚀 **Go-live P1** | **W20** | **Production deployment + Training** | **Payment 3** |

---

## 3. Phase 2: Expansion & Mobile App (3 months — 12 weeks)

> 📱 **Tenant Mobile App** (iOS + Android) + New web modules

### Detailed Timeline

```
Month 6              Month 7              Month 8
┌────┬────┐      ┌────┬────┐      ┌────┬────┐
│W21 │W22 │      │W23 │W24 │      │W25 │W26 │
├────┴────┤      ├────┴────┤      ├────┴────┤
│ Sprint  │      │ Sprint  │      │ Sprint  │
│  11—12  │      │  13—14  │      │  15—16  │
│         │      │         │      │         │
│Mobile   │      │CRM &    │      │Events   │
│App Core │      │Access   │      │Feedback │
│Setup    │      │Control  │      │UAT P2   │
└─────────┘      └─────────┘      └─────────┘
    📱               👥               🎪
```

### Sprint-by-Sprint

| Sprint | Week | Module | Deliverables |
|--------|------|--------|--------------|
| **S11** Mobile I | 21—22 | Mobile App setup | App skeleton, auth, booking flow on mobile |
| **S12** Mobile II | 23—24 | Mobile App features | Payment, QR check-in, push notifications |
| **S13** CRM | 25—26 | CRM Web | Lead management, Kanban pipeline |
| **S14** Access | 27—28 | Access Control | QR/RFID, visitor management |
| **S15** Events | 29—30 | Events, Feedback | Event management, NPS surveys |
| **S16** UAT P2 | 31—32 | — | UAT Mobile + Web, submit to App Store & Google Play |

### Milestones

| Milestone | Week | Content | Payment |
|-----------|------|---------|---------|
| 🎯 Demo Mobile | W24 | Mobile App alpha (booking + payment) | — |
| 🎯 Demo CRM | W28 | CRM + Access Control | — |
| 📱 **Go-live P2** | **W32** | **App Store + Google Play + Web modules** | **Payment 4** |

---

## 4. Phase 3: Advanced & Finalization (2 months — 8 weeks)

> 🖥️ **Web App** — Advanced features

### Sprint-by-Sprint

| Sprint | Week | Module | Deliverables |
|--------|------|--------|--------------|
| **S17** Reports | 33—34 | Advanced Reports | Revenue, occupancy, CLV, PDF/Excel export |
| **S18** Staff | 35—36 | Staff Management | Staff CRUD, granular permissions, activity log |
| **S19** Portal | 37—38 | Full Customer Portal | View invoices, online payment, support tickets |
| **S20** Polish | 39—40 | Finalization | i18n polish, performance tuning, final bug fix |

### Milestones

| Milestone | Week | Content | Payment |
|-----------|------|---------|---------|
| 🎯 Demo Reports | W36 | Reports + Staff Management | — |
| ✅ **Project Complete** | **W40** | **Full handover, final acceptance** | **Payment 5** |

---

## 5. Payment Milestone Summary

| Payment | Timing | Milestone | Rate |
|---------|--------|-----------|------|
| 1 | T0 (Signing) | Contract signing, Phase 1 begins | **30%** |
| 2 | W10 (Week 10) | Core business demo (Booking + Contract + Payment) | **25%** |
| 3 | W20 (Week 20) | Phase 1 Go-live — Web App in production | **25%** |
| 4 | W32 (Week 32) | Phase 2 Go-live — Mobile App on App Store/Google Play | **10%** |
| 5 | W40 (Week 40) | Phase 3 Complete — Full acceptance | **10%** |

---

## 6. Sprint Work Process

```
  ┌──────────────────────────────────────────────────────────────┐
  │                      2-Week Sprint                            │
  │                                                              │
  │  Week 1                              Week 2                  │
  │  ┌──────────────────────┐  ┌──────────────────────────────┐  │
  │  │ Planning → Dev → Test│  │ Dev → Test → Review → Demo   │  │
  │  └──────────────────────┘  └──────────────────────────────┘  │
  │                                                              │
  │  📋 Sprint Planning (Monday)       🎯 Demo for Cobi (Fri)  │
  │  💻 Development + Testing          📊 Weekly report (Thu)   │
  │  🧪 Continuous QA testing          📝 Sprint Retrospective  │
  └──────────────────────────────────────────────────────────────┘
```

- **Bi-weekly Demos**: Cobi directly reviews progress and provides immediate feedback
- **Weekly Reports**: Email/Slack update on progress, blockers, plans
- **Change Requests**: Impact assessment (scope/timeline/cost) before implementation
- **Warranty**: 6 months free bug fixes after each Phase Go-live

---

## 7. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Scope change requests | Medium | Timeline delay | Clear CR process, impact assessment |
| Complex payment integration | Low | 1-2 week delay | Start sandbox early from S5, buffer in S10 |
| App Store review delays | Medium | Mobile release delay | Submit early, follow Apple/Google guidelines |
| Staff changes | Low | Reduced velocity | Knowledge sharing, thorough internal documentation |

---

> 📅 **Total Duration**: 10 months (40 weeks)  
> 🔄 **Demos**: 20 demo sessions (bi-weekly)  
> 🚀 **Go-live**: Phase 1 (W20), Phase 2 (W32), Phase 3 (W40)
