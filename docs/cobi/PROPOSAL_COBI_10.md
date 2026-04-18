# ĐỀ XUẤT DỰ ÁN
# Phần mềm Quản lý Coworking Space — Cobi

> **Dự án**: Hệ thống quản lý vận hành Coworking Space  
> **Khách hàng**: Cobi  
> **Ngày lập**: 18/04/2026  
> **Phiên bản**: 1.0  
> **Tính chất**: Tài liệu đề xuất dự án

---

## 1. Giới thiệu

Chúng tôi xin gửi đến Cobi đề xuất phát triển **Phần mềm quản lý Coworking Space** — một hệ thống toàn diện giúp quản lý vận hành, đặt chỗ, hợp đồng, thanh toán và chăm sóc khách hàng cho mô hình Coworking Space hiện đại.

### 1.1 Tầm nhìn

Xây dựng nền tảng số hóa toàn bộ quy trình vận hành Coworking Space, từ quản lý không gian, đặt chỗ, hợp đồng đến thanh toán và báo cáo — giúp Cobi tối ưu hiệu quả vận hành, nâng cao trải nghiệm khách hàng và tăng doanh thu.

### 1.2 Điểm nổi bật

- **Đa nền tảng**: Web App (Phase 1) + Mobile App khách thuê iOS & Android (Phase 2)
- **Đa ngôn ngữ**: Tiếng Việt, English, Korean — phục vụ khách hàng quốc tế
- **Thanh toán tích hợp**: VNPay, MoMo, ZaloPay, chuyển khoản, tiền mặt
- **6 vai trò quản lý**: Admin, Manager, Sale, Accountant, Maintenance, Investor
- **Dashboard thông minh**: 6 bảng điều khiển theo vai trò với KPI realtime
- **Customer Portal**: Khách hàng tự đặt chỗ, thanh toán, quản lý hợp đồng online

---

## 2. Phạm vi dự án

### 2.1 Quy mô tổng quan

| Tiêu chí | Chi tiết |
|----------|---------|
| Tổng module | 17 module nghiệp vụ |
| Tổng tính năng | 98+ tính năng |
| Vai trò người dùng | 6 vai trò (Admin, Manager, Sale, Accountant, Maintenance, Investor) |
| Loại không gian | 8 loại (Hot Desk, Dedicated Desk, Private Office, Open Space, Meeting Room, Conference Room, Training Room, Event Space) |
| Ngôn ngữ | 3 (Tiếng Việt, English, Korean) |
| Nền tảng | Web App + Mobile App khách thuê (iOS & Android) |

### 2.2 Các module chính

| # | Module | Mô tả chính |
|---|--------|-------------|
| 1 | **Xác thực & Phân quyền** | Đăng nhập bảo mật, 6 vai trò, quên mật khẩu qua OTP |
| 2 | **Quản lý Tòa nhà** | Tòa nhà, tầng, 8 loại không gian, tiện ích |
| 3 | **Quản lý Khách hàng** | Cá nhân, công ty, thành viên công ty, ví tín dụng |
| 4 | **Đặt chỗ** | Lịch realtime, phát hiện trùng, đặt ngay / yêu cầu duyệt, đặt cọc |
| 5 | **Hợp đồng** | Template có placeholder, hợp đồng điện tử, chấp nhận điều khoản |
| 6 | **Thanh toán** | VNPay/MoMo/ZaloPay, thanh toán cọc, thanh toán từng phần |
| 7 | **Hệ thống Tín dụng** | Nạp tiền trước (1 credit = 1,000 VNĐ), chiến dịch bonus |
| 8 | **Quản lý Tài sản** | Theo dõi tài sản, số serial, nhật ký bảo trì |
| 9 | **Quản lý Nhân sự** | Nhân viên, phân quyền chi tiết, nhật ký hoạt động |
| 10 | **Báo cáo** | Doanh thu, công suất, CLV khách hàng, xuất PDF/Excel |
| 11 | **Dashboard** | 6 bảng điều khiển theo vai trò với KPI và biểu đồ |
| 12 | **CRM** | Thu thập lead, Kanban pipeline, theo dõi chuyển đổi |
| 13 | **Kiểm soát Ra vào** | QR/RFID, quản lý khách thăm, check-in |
| 14 | **Sự kiện** | Tạo sự kiện, đăng ký, theo dõi tham dự |
| 15 | **Cổng Khách hàng** | Tự đặt chỗ, xem hóa đơn, thanh toán online, hỗ trợ |
| 16 | **Phản hồi** | Khảo sát NPS, đánh giá, báo cáo sự cố |
| 17 | **Bảng giá** | Quy tắc giá, dịch vụ bổ sung, khuyến mãi, voucher |

---

## 3. Trạng thái hiện tại

Chúng tôi đã hoàn thành **giao diện prototype** với đầy đủ chức năng demo:

| Đã hoàn thành | Mô tả |
|----------------|-------|
| ✅ 45 trang giao diện | Tất cả các màn hình quản lý đã có UI hoàn chỉnh |
| ✅ 6 Dashboard | Mỗi vai trò có dashboard riêng với KPI phù hợp |
| ✅ Đa ngôn ngữ | Hỗ trợ đầy đủ 3 ngôn ngữ (Việt, Anh, Hàn) |
| ✅ Responsive Design | Hoạt động tốt trên Desktop, Tablet, Mobile browser |
| ✅ Dữ liệu demo | Có dữ liệu mẫu để trải nghiệm đầy đủ chức năng |

> 💡 **Quý khách có thể trải nghiệm prototype ngay** để đánh giá giao diện và luồng nghiệp vụ trước khi phát triển chính thức.

---

## 4. Lộ trình triển khai

Dự án được chia thành **3 giai đoạn** (phase), triển khai trong **10 tháng**:

### Phase 1: Vận hành cốt lõi — 🖥️ Phiên bản Web (5 tháng)

> **Ưu tiên**: ⭐ BẮT BUỘC

**Kết quả đạt được sau Phase 1:**

- ✅ Admin quản lý tòa nhà, tầng, không gian với bảng giá linh hoạt
- ✅ Manager quản lý khách hàng, tạo booking và hợp đồng
- ✅ Khách hàng tự đặt chỗ online, thanh toán cọc, nhận xác nhận tự động
- ✅ Accountant tạo hóa đơn, ghi nhận thanh toán (bao gồm đặt cọc)
- ✅ Maintenance ghi nhận và theo dõi bảo trì tài sản
- ✅ 6 Dashboard hoạt động với dữ liệu thời gian thực
- ✅ Tích hợp thanh toán VNPay, MoMo, ZaloPay
- ✅ Hệ thống tín dụng (credit) và voucher khuyến mãi
- ✅ Luồng hoàn chỉnh: Đặt chỗ → Hợp đồng → Thanh toán

| Giai đoạn | Thời gian | Nội dung chính |
|-----------|-----------|---------------|
| Khởi động & Thiết kế | Tuần 1-2 | Thiết kế cơ sở dữ liệu, thiết lập hạ tầng, chuẩn bị môi trường |
| Nền tảng | Tuần 3-6 | Xác thực & phân quyền, Quản lý tòa nhà/không gian |
| Khách hàng & Giá | Tuần 7-10 | Quản lý khách hàng, Bảng giá & khuyến mãi |
| Nghiệp vụ chính | Tuần 11-16 | Đặt chỗ, Hợp đồng, Thanh toán tích hợp |
| Hỗ trợ & Dashboard | Tuần 17-18 | Tín dụng, Tài sản, Dashboard, Cổng khách hàng |
| UAT & Go-live | Tuần 19-20 | Kiểm thử nghiệm thu, sửa lỗi, triển khai production, đào tạo |

**Demo tiến độ**: Mỗi 2 tuần sẽ có buổi demo cho Cobi xem kết quả.

---

### Phase 2: Mở rộng & Mobile App — 📱 Phiên bản điện thoại (3 tháng)

> **Ưu tiên**: NÊN CÓ

**Kết quả đạt được sau Phase 2:**

- ✅ **Ứng dụng Mobile cho khách thuê** (iOS + Android):
  - Đặt chỗ, thanh toán, xem hợp đồng & hóa đơn
  - QR check-in, thông báo push
  - Đăng nhập vân tay / Face ID
- ✅ CRM quản lý lead và pipeline bán hàng
- ✅ Kiểm soát ra vào bằng QR/RFID
- ✅ Quản lý sự kiện cộng đồng
- ✅ Thu thập phản hồi và khảo sát NPS

> 📱 *Lưu ý: Mobile App chỉ dành cho khách thuê. Admin/nhân viên sử dụng Web App.*

| Module | Nội dung |
|--------|---------|
| Mobile App | Ứng dụng khách thuê (iOS & Android) – đặt chỗ, thanh toán, QR check-in |
| CRM | Quản lý lead, pipeline, theo dõi chuyển đổi |
| Kiểm soát ra vào | QR/RFID, quản lý khách thăm, check-in |
| Sự kiện | Tạo sự kiện, đăng ký, điểm danh |
| Phản hồi | Khảo sát NPS, đánh giá dịch vụ |

---

### Phase 3: Nâng cao & Hoàn thiện (2 tháng)

> **Ưu tiên**: CÓ THÌ TỐT

**Kết quả đạt được sau Phase 3:**

- ✅ Báo cáo nâng cao: Doanh thu, công suất, CLV, xuất PDF/Excel
- ✅ Quản lý nhân sự chi tiết
- ✅ Cổng khách hàng đầy đủ (xem hóa đơn, thanh toán, hỗ trợ)
- ✅ Hoàn thiện đa ngôn ngữ (Việt, Anh, Hàn)
- ✅ Tối ưu hiệu năng toàn hệ thống

---

## 5. Báo giá

### 5.1 Chi phí theo giai đoạn

| Giai đoạn | Thời gian | Nền tảng | Báo giá (VNĐ) |
|-----------|-----------|----------|---------------|
| **Phase 1** — Vận hành cốt lõi | 5 tháng | 🖥️ Web App | **1.15 – 1.65 tỷ** |
| **Phase 2** — Mở rộng & Mobile | 3 tháng | 📱 Mobile App khách thuê + Web | **440 – 620 triệu** |
| **Phase 3** — Nâng cao & Hoàn thiện | 2 tháng | 🖥️ Web App | **160 – 220 triệu** |

### 5.2 Tổng báo giá

| | Min (VNĐ) | Max (VNĐ) |
|--|-----------|----------|
| **Cả 3 giai đoạn** | **1.75 tỷ** | **2.50 tỷ** |

> **Bao gồm**: Phát triển phần mềm, hosting (staging + production), tích hợp thanh toán, testing, deployment, đào tạo sử dụng.

### 5.3 Điều khoản thanh toán (đề xuất)

| Mốc | Tỷ lệ | Thời điểm |
|-----|--------|-----------|
| Đợt 1 | 30% | Ký hợp đồng, bắt đầu Phase 1 |
| Đợt 2 | 25% | Hoàn thành Sprint 5 (tuần 10) — Demo nghiệp vụ chính |
| Đợt 3 | 25% | Go-live Phase 1 (tuần 20) |
| Đợt 4 | 10% | Hoàn thành Phase 2 (Mobile App) |
| Đợt 5 | 10% | Hoàn thành Phase 3 |

---

## 6. Bảo hành & Hỗ trợ

| Hạng mục | Nội dung |
|----------|---------|
| **Bảo hành** | 6 tháng sau go-live mỗi phase — sửa lỗi miễn phí |
| **Hỗ trợ kỹ thuật** | Trong giờ hành chính (T2–T6, 9h–18h) |
| **Bảo trì hàng tháng** (sau bảo hành) | Gói hỗ trợ + hosting + cập nhật bảo mật |
| **SLA** | Bug nghiêm trọng: xử lý trong 4h · Bug thường: 24h · Yêu cầu mới: theo CR |

---

## 7. Bàn giao

### Sau Phase 1 (Web App)

1. Mã nguồn đầy đủ (Frontend + Backend)
2. Cơ sở dữ liệu + scripts migration
3. Tài liệu API (Swagger/OpenAPI)
4. Hướng dẫn sử dụng cho 6 vai trò
5. Hướng dẫn triển khai (Deployment Guide)
6. **2 buổi đào tạo** cho nhân viên Cobi

### Sau Phase 2 (Mobile App)

1. Mã nguồn Mobile App khách thuê
2. Ứng dụng trên **App Store** (iOS) và **Google Play** (Android)
3. Tài liệu cập nhật
4. **1 buổi đào tạo** tính năng mới

### Sau Phase 3 (Hoàn thiện)

1. Mã nguồn cập nhật
2. Báo cáo hoàn thành dự án
3. Bàn giao toàn bộ tài liệu

---

## 8. Quy trình làm việc

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Sprint      │    │   Demo       │    │   Feedback   │
│   2 tuần      │───▶│   Thứ 6     │───▶│   Cobi       │
│   phát triển  │    │   cuối sprint│    │   review     │
└──────────────┘    └──────────────┘    └──────────────┘
        │                                       │
        ▼                                       ▼
┌──────────────┐                        ┌──────────────┐
│   Testing    │                        │  Sprint mới  │
│   QA kiểm thử│                        │  bắt đầu    │
└──────────────┘                        └──────────────┘
```

- **Demo 2 tuần/lần**: Cobi xem trực tiếp tiến độ và phản hồi
- **Báo cáo tiến độ**: Weekly report qua email/Slack
- **Change Request**: Có quy trình đánh giá tác động trước khi thực hiện
- **Chất lượng đảm bảo**: Code review + Unit test + QA test trước mỗi lần release

---

## 9. Công nghệ sử dụng

### Web App

| Thành phần | Công nghệ |
|------------|-----------|
| Giao diện | React 19 + TypeScript |
| Backend | NestJS (TypeScript) |
| Cơ sở dữ liệu | PostgreSQL |
| Bộ nhớ đệm | Redis |
| Thanh toán | VNPay, MoMo, ZaloPay |
| Lưu trữ file | AWS S3 |
| Email | SendGrid |
| Triển khai | Docker + Cloud (AWS/VPS) |
| CI/CD | GitHub Actions |
| Giám sát | Sentry + Grafana |

### Mobile App (Phase 2)

| Thành phần | Công nghệ |
|------------|-----------|
| Framework | React Native / Flutter |
| Thông báo đẩy | Firebase Cloud Messaging |
| QR Scanner | Camera SDK |
| Bảo mật | Vân tay / Face ID |
| Phân phối | App Store + Google Play |

---

## 10. Tại sao chọn chúng tôi?

| Lý do | Chi tiết |
|-------|---------|
| 🎯 **Prototype sẵn sàng** | 45 trang giao diện đã hoàn thành — Cobi có thể trải nghiệm ngay trước khi quyết định |
| 🛡️ **Bảo mật** | JWT authentication, RBAC 6 vai trò, mã hóa dữ liệu |
| 🌍 **Đa ngôn ngữ** | Sẵn sàng phục vụ khách hàng Việt Nam, Hàn Quốc, quốc tế |
| 📱 **Đa nền tảng** | Web + Mobile App khách thuê đồng bộ dữ liệu realtime |
| 💳 **Thanh toán đa dạng** | VNPay, MoMo, ZaloPay, chuyển khoản, tiền mặt, credit |
| 📊 **Dashboard thông minh** | 6 bảng điều khiển tùy chỉnh theo vai trò |
| 🔄 **Agile** | Demo 2 tuần/lần, Cobi luôn nắm tiến độ |
| 🔧 **Bảo hành dài hạn** | 6 tháng bảo hành miễn phí sau mỗi phase |

---

## 11. Bước tiếp theo

1. **Cobi xem demo prototype** — Trải nghiệm giao diện và luồng nghiệp vụ
2. **Họp kick-off** — Xác nhận yêu cầu chi tiết, ưu tiên tính năng
3. **Ký hợp đồng** — Thống nhất scope, timeline, điều khoản
4. **Bắt đầu Phase 1** — Sprint 0: Thiết kế database & setup hạ tầng

---

> 📧 **Liên hệ**: [Thông tin liên hệ đội phát triển]  
> 📅 **Ngày lập**: 18/04/2026  
> 📋 **Hiệu lực báo giá**: 30 ngày kể từ ngày lập
