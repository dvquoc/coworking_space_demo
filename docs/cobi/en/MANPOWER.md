# PROJECT MANPOWER From POPOPLUS
# Coworking Space Management Software — Cobi

> **Project**: Coworking Space Operations Management System  
> **Client**: Cobi  
> **Vendor**: POPOPLUS  
> **Date**: 18/04/2026  
> **Version**: 1.0

---

## 1. Manpower Overview

| Phase | Duration | Headcount | Platform |
|-------|----------|-----------|----------|
| **Phase 1** — Core Operations | 5 months | **6 people** | 🖥️ Web App |
| **Phase 2** — Expansion & Mobile | 3 months | **4 people** | 📱 Mobile + Web |
| **Phase 3** — Advanced & Finalization | 2 months | **2.5 people** | 🖥️ Web App |

---

## 2. Phase 1: Core Operations (6 people — 5 months)

### Team Composition

| # | Role | Qty | Duration | Key Responsibilities |
|---|------|-----|----------|---------------------|
| 1 | **Project Manager** | 1 | Full-time 5 months | Project management, Cobi communication, progress tracking, Scrum Master |
| 2 | **Business Analyst** | 0.5 | Part-time 5 months | Detailed requirements, specs writing, UAT support |
| 3 | **Backend Developer (Senior)** | 1 | Full-time 5 months | DB design (40+ entities), API architecture, payment gateway integration |
| 4 | **Backend Developer (Mid)** | 1 | Full-time 5 months | API development, business logic, unit tests |
| 5 | **Frontend Developer (Senior)** | 1 | Full-time 5 months | Complete UI, API integration (prototype 95% ready) |
| 6 | **QA/Tester** | 1 | Full-time 5 months | Test plan, manual + automation testing, regression |
| 7 | **DevOps** | 0.5 | Part-time 5 months | CI/CD, Docker, monitoring, infrastructure |

### Phase 1 Staffing Chart

```
Role                  M1    M2    M3    M4    M5
──────────────────   ────  ────  ────  ────  ────
Project Manager      ████  ████  ████  ████  ████  (100%)
Business Analyst     ██──  ██──  ────  ────  ██──  (50%, focus start + UAT)
Backend Sr. Dev      ████  ████  ████  ████  ████  (100%)
Backend Mid Dev      ████  ████  ████  ████  ████  (100%)
Frontend Sr. Dev     ████  ████  ████  ████  ████  (100%)
QA/Tester            ──██  ████  ████  ████  ████  (90%, starts M1.5)
DevOps               ████  ██──  ──██  ──██  ────  (50%, focus early)
```

### Sprint Assignments

| Sprint | Week | Backend Sr. | Backend Mid | Frontend Sr. | QA |
|--------|------|-------------|-------------|--------------|-----|
| S0 Kickoff | 1-2 | DB Design, API conventions | Setup project, seed data | FE API layer setup | Test plan |
| S1-2 Foundation | 3-6 | Auth API, RBAC | Property API (CRUD) | Integrate Auth + Property | Test Auth flows |
| S3-4 Customer | 7-10 | Customer API (3 types) | Pricing engine | Integrate Customer + Pricing | Test Customer + Pricing |
| S5-7 Booking | 11-16 | Booking + Contract API | Payment integration | Integrate Booking + Contract + Payment | Test E2E flows |
| S8-9 Support | 17-18 | Dashboard APIs | Credit + Inventory | Dashboard + Portal | Regression testing |
| S10 UAT | 19-20 | Bug fix, performance | Bug fix, migration | Bug fix, polish | UAT coordination |

---

## 3. Phase 2: Expansion & Mobile (4 people — 3 months)

### Team Composition

| # | Role | Qty | Duration | Key Responsibilities |
|---|------|-----|----------|---------------------|
| 1 | **Project Manager** | 1 | Full-time 3 months | Project management, continued Cobi communication |
| 2 | **Backend Developer (Fullstack)** | 1 | Full-time 3 months | API for mobile + new web modules (CRM, Events) |
| 3 | **Mobile Developer** | 1 | Full-time 3 months | React Native / Flutter — tenant iOS & Android app |
| 4 | **QA/Tester** | 1 | Full-time 3 months | Web + mobile app testing, regression |

### Phase 2 Staffing Chart

```
Role                  M6    M7    M8
──────────────────   ────  ────  ────
Project Manager      ████  ████  ████  (100%)
Backend Fullstack    ████  ████  ████  (100%)
Mobile Developer     ████  ████  ████  (100%)
QA/Tester            ████  ████  ████  (100%)
```

> 📱 **Mobile App is for tenants only**. Admin/staff use the Web App.

### Sprint Assignments

| Sprint | Backend Fullstack | Mobile Developer | QA |
|--------|-------------------|------------------|-----|
| S11-12 | Mobile API endpoints | App skeleton, Auth, Booking UI | Test mobile flows |
| S13-14 | CRM + Access Control API | Payment, QR check-in, Push | Test CRM + mobile |
| S15-16 | Events + Feedback API | Polish, submit to stores | UAT mobile + web |

---

## 4. Phase 3: Advanced & Finalization (2.5 people — 2 months)

### Team Composition

| # | Role | Qty | Duration | Key Responsibilities |
|---|------|-----|----------|---------------------|
| 1 | **Backend Developer** | 1 | Full-time 2 months | Advanced reports, Staff API, Portal API |
| 2 | **Frontend Developer** | 1 | Full-time 2 months | Reports UI, Staff UI, Portal, i18n polish |
| 3 | **QA/Tester** | 0.5 | Part-time 2 months | Regression, final UAT |

### Phase 3 Staffing Chart

```
Role                  M9    M10
──────────────────   ────  ────
Backend Developer    ████  ████  (100%)
Frontend Developer   ████  ████  (100%)
QA/Tester            ██──  ████  (Part-time → Full-time UAT)
```

---

## 5. Project-wide Manpower Summary

### 5.1 Headcount by Phase

```
People
  7 ┤
  6 ┤  ██████████████████████████
  5 ┤  ██████████████████████████
  4 ┤  ██████████████████████████  ████████████████
  3 ┤  ██████████████████████████  ████████████████
  2 ┤  ██████████████████████████  ████████████████  ████████████
  1 ┤  ██████████████████████████  ████████████████  ████████████
  0 ┼──────────────────────────────────────────────────────────────
     M1   M2   M3   M4   M5    M6   M7   M8    M9   M10
     ├────── Phase 1 ──────┤   ├── Phase 2 ──┤  ├─ Phase 3─┤
     │      6 people       │   │   4 people  │  │2.5 people│
```

### 5.2 Total Man-months

| Role | Phase 1 | Phase 2 | Phase 3 | **Total (man-months)** |
|------|---------|---------|---------|----------------------|
| Project Manager | 5 | 3 | — | **8** |
| Business Analyst | 2.5 | — | — | **2.5** |
| Backend Sr. Developer | 5 | — | — | **5** |
| Backend Mid/Fullstack | 5 | 3 | 2 | **10** |
| Frontend Sr. Developer | 5 | — | 2 | **7** |
| Mobile Developer | — | 3 | — | **3** |
| QA/Tester | 5 | 3 | 1 | **9** |
| DevOps | 2.5 | — | — | **2.5** |
| **TOTAL** | **30** | **12** | **5** | **47 man-months** |

---

## 6. Skill Requirements

| Role | Key Skills | Experience |
|------|-----------|-----------|
| **Project Manager** | Agile/Scrum, stakeholder management, IT project delivery | 3+ years PM |
| **Business Analyst** | Requirements analysis, wireframes, acceptance criteria | 2+ years BA |
| **Backend Sr. Developer** | NestJS, PostgreSQL, Redis, Payment gateways (VNPay, MoMo) | 4+ years Backend |
| **Backend Mid Developer** | NestJS/Node.js, TypeORM/Prisma, REST API | 2+ years Backend |
| **Frontend Sr. Developer** | React 19, TypeScript, TanStack Query, Tailwind CSS | 3+ years Frontend |
| **Mobile Developer** | React Native or Flutter, mobile payments, push notifications | 2+ years Mobile |
| **QA/Tester** | Manual + automation testing, API testing, mobile testing | 2+ years QA |
| **DevOps** | Docker, CI/CD (GitHub Actions), AWS/VPS, monitoring | 2+ years DevOps |

---

## 7. Team Strengths

| Advantage | Details |
|-----------|---------|
| 🎯 **Ready Prototype** | Frontend 95% complete → Frontend Sr. focuses on API integration instead of building from scratch |
| 🔧 **Fullstack Capability** | Backend Mid can flexibly support frontend when needed |
| 📱 **Dedicated Mobile** | Mobile Dev specialized in React Native/Flutter, not shared with web |
| 🧪 **Early QA** | QA participates from Sprint 1, writes test plan in parallel with development |
| 📋 **Regular Demos** | PM organizes bi-weekly demos, Cobi always stays informed |

---

## 8. Quality Commitment

- **Code Review**: All code reviewed by Senior before merging
- **Automation Testing**: Unit tests + integration tests for APIs
- **QA Testing**: Manual + regression testing every sprint
- **UAT**: Cobi acceptance testing before each go-live
- **Warranty**: 6 months free bug fixes after each Phase go-live
