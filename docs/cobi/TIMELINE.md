# TIMELINE DỰ ÁN
# Phần mềm Quản lý Coworking Space — Cobi

> **Dự án**: Hệ thống quản lý vận hành Coworking Space  
> **Khách hàng**: Cobi  
> **Ngày lập**: 18/04/2026  
> **Tổng thời gian**: 10 tháng (3 giai đoạn)

---

## 1. Tổng quan Timeline

```
         Phase 1                    Phase 2           Phase 3
    ┌──────────────────┐      ┌──────────────┐   ┌──────────┐
    │   5 tháng        │      │   3 tháng    │   │  2 tháng │
    │   Web App        │      │   Mobile     │   │  Nâng cao│
    │   20 tuần        │      │   12 tuần    │   │  8 tuần  │
    ├──────────────────┤      ├──────────────┤   ├──────────┤
T0 ─┤ Kickoff          │      │              │   │          ├── T10
    │ S1-S2: Nền tảng  │      │ Mobile App   │   │ Báo cáo  │
    │ S3-S4: KH & Giá  │      │ CRM          │   │ Nhân sự  │
    │ S5-S7: Nghiệp vụ │      │ Sự kiện      │   │ Portal   │
    │ S8-S9: Hỗ trợ    │      │ Phản hồi     │   │ i18n     │
    │ S10: UAT & Go-live│      │ Kiểm soát    │   │ Tối ưu   │
    └──────────────────┘      └──────────────┘   └──────────┘
```

| Giai đoạn | Thời gian | Nền tảng | Mức ưu tiên |
|-----------|-----------|----------|-------------|
| **Phase 1** — Vận hành cốt lõi | Tháng 1-5 | 🖥️ Web App | ⭐ Bắt buộc |
| **Phase 2** — Mở rộng & Mobile | Tháng 6-8 | 📱 Mobile + Web | Nên có |
| **Phase 3** — Nâng cao & Hoàn thiện | Tháng 9-10 | 🖥️ Web App | Có thì tốt |

---

## 2. Phase 1: Vận hành cốt lõi (5 tháng — 20 tuần)

> 🖥️ **Nền tảng Web** — Responsive (Desktop, Tablet, Mobile browser)

### Timeline chi tiết

```
Tháng 1              Tháng 2              Tháng 3              Tháng 4              Tháng 5
┌────┬────┐      ┌────┬────┐      ┌────┬────┐      ┌────┬────┐      ┌────┬────┐
│ T1 │ T2 │      │ T3 │ T4 │      │ T5 │ T6 │      │ T7 │ T8 │      │ T9 │T10 │
├────┴────┤      ├────┴────┤      ├────┴────┤      ├────┼────┤      ├────┴────┤
│ Kickoff │      │ Sprint  │      │ Sprint  │      │S5-6│ S7 │      │ Sprint  │
│ & Setup │      │  1—2    │      │  3—4    │      │    │    │      │  8—10   │
│         │      │Nền tảng │      │KH & Giá │      │Nghiệp vụ│      │Hỗ trợ  │
│ DB Design│     │Auth     │      │Customer │      │Booking  │      │+UAT     │
│ Infra   │      │Property │      │Pricing  │      │Contract │      │Go-live  │
│ CI/CD   │      │API      │      │Engine   │      │Payment  │      │Training │
└─────────┘      └─────────┘      └─────────┘      └─────────┘      └─────────┘
    📋               🔧               👥               💼               🚀
```

### Sprint-by-Sprint

| Sprint | Tuần | Thời gian | Module phát triển | Kết quả bàn giao |
|--------|------|-----------|-------------------|-------------------|
| **S0** Kickoff | 1—2 | 2 tuần | — | Thiết kế DB (40+ entities), CI/CD, môi trường staging |
| **S1** Foundation I | 3—4 | 2 tuần | Auth, Property (Buildings) | Đăng nhập 6 vai trò, CRUD tòa nhà |
| **S2** Foundation II | 5—6 | 2 tuần | Property (Floors, Spaces) | CRUD tầng + không gian, 8 loại không gian, tích hợp FE |
| **S3** Customer | 7—8 | 2 tuần | Khách hàng | 3 loại KH, ví tín dụng, import/export |
| **S4** Pricing | 9—10 | 2 tuần | Bảng giá, Khuyến mãi | Pricing engine, promotions, voucher, calculator |
| **S5** Booking | 11—12 | 2 tuần | Đặt chỗ | Calendar, conflict detection, instant/request-to-book |
| **S6** Contract | 13—14 | 2 tuần | Hợp đồng | Template, e-contract, điều khoản, preview |
| **S7** Payment | 15—16 | 2 tuần | Thanh toán | VNPay/MoMo/ZaloPay, hóa đơn, deposit, partial payment |
| **S8** Support I | 17 | 1 tuần | Credit, Inventory | Hệ thống tín dụng, quản lý tài sản |
| **S9** Support II | 18 | 1 tuần | Dashboard, Portal | 6 dashboard, cổng KH (đặt chỗ, xem booking) |
| **S10** UAT | 19—20 | 2 tuần | — | UAT, bug fix, performance, deploy production, đào tạo |

### Demo & Mốc quan trọng

| Mốc | Tuần | Nội dung | Thanh toán |
|-----|------|----------|------------|
| 🎯 Demo 1 | T4 | Auth + Property hoạt động | — |
| 🎯 Demo 2 | T6 | Tích hợp FE + Backend | — |
| 🎯 Demo 3 | T8 | Khách hàng + Bảng giá | — |
| 💰 **Milestone 1** | **T10** | **Nghiệp vụ chính demo** (Booking + Contract) | **Đợt thanh toán 2** |
| 🎯 Demo 5 | T14 | Thanh toán VNPay/MoMo tích hợp | — |
| 🎯 Demo 6 | T18 | Toàn bộ module Phase 1 | — |
| 🚀 **Go-live P1** | **T20** | **Production deployment + Đào tạo** | **Đợt thanh toán 3** |

---

## 3. Phase 2: Mở rộng & Mobile App (3 tháng — 12 tuần)

> 📱 **Mobile App cho khách thuê** (iOS + Android) + Web modules mới

### Timeline chi tiết

```
Tháng 6              Tháng 7              Tháng 8
┌────┬────┐      ┌────┬────┐      ┌────┬────┐
│T21 │T22 │      │T23 │T24 │      │T25 │T26 │
├────┴────┤      ├────┴────┤      ├────┴────┤
│ Sprint  │      │ Sprint  │      │ Sprint  │
│  11—12  │      │  13—14  │      │  15—16  │
│         │      │         │      │         │
│Mobile   │      │CRM &    │      │Sự kiện  │
│App Core │      │Access   │      │Phản hồi │
│Setup    │      │Control  │      │UAT P2   │
└─────────┘      └─────────┘      └─────────┘
    📱               👥               🎪
```

### Sprint-by-Sprint

| Sprint | Tuần | Module | Kết quả |
|--------|------|--------|---------|
| **S11** Mobile I | 21—22 | Mobile App setup | App skeleton, auth, booking flow trên mobile |
| **S12** Mobile II | 23—24 | Mobile App features | Thanh toán, QR check-in, push notification |
| **S13** CRM | 25—26 | CRM Web | Lead management, Kanban pipeline |
| **S14** Access | 27—28 | Kiểm soát ra vào | QR/RFID, visitor management |
| **S15** Events | 29—30 | Sự kiện, Phản hồi | Event management, NPS survey |
| **S16** UAT P2 | 31—32 | — | UAT Mobile + Web, submit App Store & Google Play |

### Mốc quan trọng

| Mốc | Tuần | Nội dung | Thanh toán |
|-----|------|----------|------------|
| 🎯 Demo Mobile | T24 | Mobile App alpha (booking + payment) | — |
| 🎯 Demo CRM | T28 | CRM + Access Control | — |
| 📱 **Go-live P2** | **T32** | **App Store + Google Play + Web modules** | **Đợt thanh toán 4** |

---

## 4. Phase 3: Nâng cao & Hoàn thiện (2 tháng — 8 tuần)

> 🖥️ **Web App** — Tính năng nâng cao

### Sprint-by-Sprint

| Sprint | Tuần | Module | Kết quả |
|--------|------|--------|---------|
| **S17** Reports | 33—34 | Báo cáo nâng cao | Doanh thu, công suất, CLV, xuất PDF/Excel |
| **S18** Staff | 35—36 | Nhân sự | Staff CRUD, phân quyền chi tiết, activity log |
| **S19** Portal | 37—38 | Cổng KH đầy đủ | Xem hóa đơn, thanh toán online, support ticket |
| **S20** Polish | 39—40 | Hoàn thiện | i18n polish, performance tuning, bug fix cuối |

### Mốc quan trọng

| Mốc | Tuần | Nội dung | Thanh toán |
|-----|------|----------|------------|
| 🎯 Demo Reports | T36 | Báo cáo + Nhân sự | — |
| ✅ **Hoàn thành dự án** | **T40** | **Bàn giao toàn bộ, nghiệm thu** | **Đợt thanh toán 5** |

---

## 5. Tổng hợp mốc thanh toán

| Đợt | Thời điểm | Mốc | Tỷ lệ |
|-----|-----------|-----|--------|
| 1 | T0 (Ký HĐ) | Ký hợp đồng, bắt đầu Phase 1 | **30%** |
| 2 | T10 (Tuần 10) | Demo nghiệp vụ chính (Booking + Contract + Payment) | **25%** |
| 3 | T20 (Tuần 20) | Go-live Phase 1 — Web App production | **25%** |
| 4 | T32 (Tuần 32) | Go-live Phase 2 — Mobile App trên App Store/Google Play | **10%** |
| 5 | T40 (Tuần 40) | Hoàn thành Phase 3 — Nghiệm thu toàn bộ | **10%** |

---

## 6. Quy trình làm việc theo Sprint

```
  ┌──────────────────────────────────────────────────────────────┐
  │                      Sprint 2 tuần                           │
  │                                                              │
  │  Tuần 1                              Tuần 2                  │
  │  ┌──────────────────────┐  ┌──────────────────────────────┐  │
  │  │ Planning → Dev → Test│  │ Dev → Test → Review → Demo   │  │
  │  └──────────────────────┘  └──────────────────────────────┘  │
  │                                                              │
  │  📋 Sprint Planning (Thứ 2)          🎯 Demo cho Cobi (T6) │
  │  💻 Phát triển + Testing              📊 Weekly report (T5) │
  │  🧪 QA kiểm thử liên tục             📝 Sprint Retrospective│
  └──────────────────────────────────────────────────────────────┘
```

- **Demo 2 tuần/lần**: Cobi trực tiếp xem tiến độ, phản hồi ngay
- **Báo cáo hàng tuần**: Email/Slack update tiến độ, blockers, kế hoạch
- **Change Request**: Đánh giá tác động (scope/timeline/cost) trước khi thực hiện
- **Bảo hành**: 6 tháng miễn phí sửa lỗi sau Go-live mỗi Phase

---

## 7. Rủi ro & Biện pháp

| Rủi ro | Xác suất | Tác động | Biện pháp |
|--------|----------|----------|-----------|
| Yêu cầu thay đổi scope | Trung bình | Chậm timeline | Quy trình CR rõ ràng, đánh giá tác động |
| Tích hợp thanh toán phức tạp | Thấp | Chậm 1-2 tuần | Bắt đầu sandbox sớm từ S5, buffer trong S10 |
| App Store review kéo dài | Trung bình | Chậm release Mobile | Submit sớm, tuân thủ guidelines Apple/Google |
| Nhân sự thay đổi | Thấp | Giảm tốc độ | Knowledge sharing, tài liệu nội bộ đầy đủ |

---

> 📅 **Tổng thời gian**: 10 tháng (40 tuần)  
> 🔄 **Demo**: 20 buổi demo (2 tuần/lần)  
> 🚀 **Go-live**: Phase 1 (T20), Phase 2 (T32), Phase 3 (T40)
