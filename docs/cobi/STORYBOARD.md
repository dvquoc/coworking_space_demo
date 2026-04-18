# STORYBOARD & WIREFRAME
# Phần mềm Quản lý Coworking Space — Cobi

> **Dự án**: Hệ thống quản lý vận hành Coworking Space  
> **Khách hàng**: Cobi  
> **Ngày lập**: 18/04/2026  
> **Phiên bản**: 1.0

---

## 1. Tổng quan hệ thống

Hệ thống gồm **45+ màn hình**, chia thành **10 nhóm chức năng** chính, phục vụ **6 vai trò** người dùng:

| Vai trò | Mô tả | Truy cập chính |
|---------|-------|----------------|
| **Admin** | Quản trị toàn hệ thống | Tất cả module |
| **Manager** | Quản lý vận hành hàng ngày | Booking, Hợp đồng, Khách hàng, CRM |
| **Sale** | Kinh doanh, bán hàng | Booking, CRM, Khách hàng, Báo giá |
| **Accountant** | Kế toán, tài chính | Hóa đơn, Thanh toán, Tín dụng, Báo cáo |
| **Maintenance** | Bảo trì, kỹ thuật | Bảo trì, Tài sản |
| **Investor** | Nhà đầu tư | Dashboard tổng quan, Báo cáo |

---

## 2. Danh sách màn hình theo module

### 2.1 Xác thực & Đăng nhập (4 màn hình)

| # | Màn hình | Mô tả | Ghi chú |
|---|----------|-------|---------|
| 1 | **Đăng nhập** | Email + mật khẩu, chọn tài khoản demo | Hỗ trợ 6 vai trò |
| 2 | **Quên mật khẩu** | Nhập email để nhận mã OTP | Gửi OTP qua email |
| 3 | **Xác thực OTP** | Nhập mã OTP 6 số | Hết hạn sau 5 phút |
| 4 | **Đặt lại mật khẩu** | Nhập mật khẩu mới | Kiểm tra độ mạnh |

**Luồng**: Đăng nhập → Dashboard (theo vai trò) · Quên MK → OTP → Đặt lại MK → Đăng nhập

---

### 2.2 Dashboard — 6 bảng điều khiển theo vai trò (7 màn hình)

| # | Màn hình | Vai trò | KPI chính |
|---|----------|---------|-----------|
| 5 | **Dashboard Tổng** | Mặc định | Tổng quan nhanh, chuyển hướng theo vai trò |
| 6 | **Dashboard Admin** | Admin | Doanh thu, công suất, số KH, tài sản |
| 7 | **Dashboard Manager** | Manager | Booking hôm nay, KH mới, hợp đồng sắp hết, occupancy |
| 8 | **Dashboard Kế toán** | Accountant | Doanh thu tháng, hóa đơn chưa thanh toán, quá hạn |
| 9 | **Dashboard Bảo trì** | Maintenance | Tài sản cần bảo trì, ticket mở, lịch bảo trì |
| 10 | **Dashboard Kinh doanh** | Sale | Lead mới, pipeline, doanh số, booking tạo |
| 11 | **Dashboard Nhà đầu tư** | Investor | ROI, doanh thu, tăng trưởng, biểu đồ xu hướng |

> Mỗi dashboard có biểu đồ (Recharts), KPI cards, bảng dữ liệu realtime.

---

### 2.3 Quản lý Tòa nhà & Không gian (3 màn hình)

| # | Màn hình | Chức năng chính |
|---|----------|----------------|
| 12 | **Danh sách Tòa nhà** | CRUD tòa nhà, địa chỉ, tiện ích, trạng thái |
| 13 | **Quản lý Tầng** | Tầng theo tòa nhà, diện tích, mặt bằng |
| 14 | **Quản lý Không gian** | 8 loại không gian, sức chứa, giá, tiện nghi, trạng thái |

**8 loại không gian**: Hot Desk · Dedicated Desk · Private Office · Open Space · Meeting Room · Conference Room · Training Room · Event Space

---

### 2.4 Quản lý Khách hàng (2 màn hình)

| # | Màn hình | Chức năng chính |
|---|----------|----------------|
| 15 | **Danh sách Khách hàng** | Tìm kiếm, lọc theo loại/tag/trạng thái, thống kê, tạo mới |
| 16 | **Chi tiết Khách hàng** | Thông tin, nhân viên (công ty), booking, hợp đồng, hóa đơn, tín dụng, lịch sử |

**3 loại khách hàng**: Cá nhân · Công ty · Thành viên công ty (mỗi loại có form riêng)

---

### 2.5 Đặt chỗ — Booking (5 màn hình)

| # | Màn hình | Chức năng chính |
|---|----------|----------------|
| 17 | **Danh sách Booking** | Bảng, lọc theo trạng thái/loại không gian, thống kê nhanh |
| 18 | **Lịch Booking** | Lịch tuần/ngày, kéo thả, phát hiện trùng lịch |
| 19 | **Trạng thái Booking** | Kanban Board theo trạng thái (Pending → Confirmed → In-progress → Completed) |
| 20 | **Form Tạo/Sửa Booking** | Chọn KH, không gian, thời gian, dịch vụ bổ sung, tính giá tự động |
| 21 | **Chi tiết Booking** | Thông tin đầy đủ, timeline, hành động (duyệt/từ chối/hủy) |

**Luồng Booking**:
```
Chọn KH → Chọn không gian → Chọn thời gian → Phát hiện trùng → Chọn dịch vụ bổ sung
  → Tính giá (áp dụng khuyến mãi/voucher) → Xác nhận → Tạo hóa đơn cọc (nếu có) → Thanh toán
```

---

### 2.6 Hợp đồng (8 màn hình)

| # | Màn hình | Chức năng chính |
|---|----------|----------------|
| 22 | **Danh sách Hợp đồng** | Bảng, lọc status/loại, thống kê (active, sắp hết hạn, %occupancy) |
| 23 | **Form Tạo/Sửa Hợp đồng** | Chọn KH, không gian, thời hạn, template, điều khoản, tính giá |
| 24 | **Chi tiết Hợp đồng** | Thông tin đầy đủ, timeline, hóa đơn liên quan, gia hạn/chấm dứt |
| 25 | **Tạo hợp đồng thành công** | Xác nhận, bước tiếp theo (tạo hóa đơn, nhắc KH ký) |
| 26 | **Danh sách Template** | Quản lý mẫu hợp đồng, preview, nhân bản |
| 27 | **Form Template** | Soạn template với placeholder ({{customer_name}}, {{space_name}}, ...) |
| 28 | **Danh sách Điều khoản** | Thư viện điều khoản dùng chung |
| 29 | **Form Điều khoản** | Tạo/sửa điều khoản riêng lẻ |

**Luồng Hợp đồng**:
```
Chọn KH → Chọn không gian → Chọn template → Điền thông tin → Preview
  → Gửi KH xác nhận → KH chấp nhận điều khoản → Hợp đồng Active → Tạo hóa đơn tự động
```

---

### 2.7 Hóa đơn & Thanh toán (1 màn hình, 3 modal)

| # | Màn hình | Chức năng chính |
|---|----------|----------------|
| 30 | **Quản lý Hóa đơn** | Tabs theo trạng thái, KPI, bảng, lọc nguồn (Booking/Hợp đồng/Nạp tiền) |
| — | *Modal: Chi tiết Hóa đơn* | Items, subtotal, VAT, chiết khấu, tổng, lịch sử thanh toán |
| — | *Modal: Ghi nhận Thanh toán* | Số tiền, phương thức (VNPay/MoMo/ZaloPay/CK/Tiền mặt), ghi chú |
| — | *Modal: Tạo Hóa đơn mới* | Chọn nguồn → KH → Items → Giảm giá → VAT → Xác nhận |

**Trạng thái hóa đơn**: Chưa thanh toán · Thanh toán một phần · Đã thanh toán · Quá hạn · Đã hủy

---

### 2.8 Bảng giá & Khuyến mãi (4 màn hình)

| # | Màn hình | Chức năng chính |
|---|----------|----------------|
| 31 | **Bảng giá dịch vụ** | Giá theo loại không gian, dịch vụ bổ sung, phụ phí |
| 32 | **Khuyến mãi** | Tạo chương trình KM, điều kiện, thời gian, giới hạn |
| 33 | **Voucher** | Tạo mã voucher, số lần dùng, ngày hết hạn, thống kê |
| 34 | **Máy tính giá** | Tính giá nhanh: chọn không gian + thời gian → giá + phụ phí + KM |

---

### 2.9 CRM — Quản lý khách hàng tiềm năng (4 màn hình)

| # | Màn hình | Chức năng chính |
|---|----------|----------------|
| 35 | **Danh sách Lead** | Bảng, lọc theo nguồn/trạng thái/nhân viên phụ trách |
| 36 | **Lead Kanban** | Kanban pipeline: New → Contacted → Qualified → Proposal → Negotiation → Won/Lost |
| 37 | **Chi tiết Lead** | Thông tin đầy đủ, timeline hoạt động, ghi chú, lịch hẹn |
| 38 | **Chiến dịch** | Quản lý campaign marketing, theo dõi nguồn lead |

---

### 2.10 Các module khác (6+ màn hình)

| # | Màn hình | Module | Chức năng chính |
|---|----------|--------|----------------|
| 39 | **Tín dụng** | Credit | Ví KH, lịch sử nạp/tiêu, chiến dịch bonus |
| 40 | **Bảo trì** | Maintenance | Ticket bảo trì, trạng thái, timeline |
| 41 | **Quản lý Tài sản** | Inventory | Danh sách tài sản, serial, vị trí, tình trạng |
| 42 | **Báo cáo** | Reports | Doanh thu, công suất, CLV, xuất PDF/Excel |
| 43 | **Trang 403** | Error | Không có quyền truy cập |
| 44 | **Trang 404** | Error | Không tìm thấy trang |

---

## 3. Luồng nghiệp vụ chính

### 3.1 Luồng Đặt chỗ & Thanh toán (End-to-End)

```
Khách hàng liên hệ
        │
        ▼
┌─────────────────┐
│ Tạo Khách hàng  │ ← Sale/Manager nhập thông tin
│                 │   (Cá nhân/Công ty/Thành viên)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Tạo Booking     │ ← Chọn khách, không gian, thời gian
│                 │   Phát hiện trùng lịch tự động
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────────┐
│ Tạo Hóa đơn    │────▶│ Thanh toán           │
│ (Cọc/Full)      │     │ VNPay/MoMo/ZaloPay   │
└────────┬────────┘     │ CK/Tiền mặt/Tín dụng│
         │              └──────────────────────┘
         ▼
┌─────────────────┐
│ Xác nhận Booking│ ← Tự động sau thanh toán
│                 │   hoặc Manager duyệt thủ công
└─────────────────┘
```

### 3.2 Luồng Hợp đồng dài hạn

```
Khách hàng thuê dài hạn
        │
        ▼
┌─────────────────┐
│ Tạo Hợp đồng   │ ← Chọn template, điền thông tin
│                 │   Preview nội dung hợp đồng
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Gửi KH xác nhận│ ← KH xem & chấp nhận điều khoản
│                 │   Hợp đồng điện tử
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────────┐
│ Hợp đồng Active│────▶│ Hóa đơn định kỳ      │
│                 │     │ Tự động theo tháng    │
└────────┬────────┘     └──────────────────────┘
         │
         ▼
┌─────────────────┐
│ Gia hạn/Chấm dứt│ ← Cảnh báo trước 30 ngày
│                 │   khi sắp hết hạn
└─────────────────┘
```

### 3.3 Luồng CRM (Lead → Khách hàng)

```
Lead đến từ nhiều nguồn
  (Website, Giới thiệu, Sự kiện, v.v.)
        │
        ▼
┌─────────────────┐
│ New Lead        │ ← Nhập thông tin lead
│                 │   Phân công Sale phụ trách
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Kanban Pipeline │ ← Kéo thả qua các giai đoạn
│ Contacted       │   New → Contacted → Qualified
│ → Qualified     │   → Proposal → Negotiation
│ → Proposal      │   → Won / Lost
│ → Won ✅        │
└────────┬────────┘
         │ (Won)
         ▼
┌─────────────────┐
│ Chuyển thành KH │ ← Tự động tạo hồ sơ khách hàng
│                 │   → Tạo Booking hoặc Hợp đồng
└─────────────────┘
```

---

## 4. Thiết kế giao diện

### 4.1 Design System

| Thành phần | Giá trị |
|------------|---------|
| **Màu chính** | `#b11e29` (đỏ Cobi) |
| **Màu hover** | `#8f1820` |
| **Font** | Inter (System Font) |
| **Border radius** | `rounded-xl` (12px) cho card, `rounded-lg` (8px) cho input |
| **Shadow** | `shadow-sm` cho card |
| **Background** | `slate-50` (nền), `white` (card) |
| **Framework CSS** | Tailwind CSS v4 |
| **Icons** | Lucide React |
| **Charts** | Recharts v3 |

### 4.2 Layout chung

```
┌───────────────────────────────────────────────────────┐
│ Header: Logo ── Breadcrumb ── Language ── User Menu   │
├──────────┬────────────────────────────────────────────┤
│          │                                            │
│ Sidebar  │  Main Content Area                         │
│          │                                            │
│ ● Dashboard │  ┌──────────────────────────────────┐   │
│ ● Tòa nhà   │  │  Page Header + Actions          │   │
│ ● Khách hàng│  ├──────────────────────────────────┤   │
│ ● Booking   │  │                                  │   │
│ ● Hợp đồng  │  │  KPI Cards / Filters             │   │
│ ● Hóa đơn   │  │                                  │   │
│ ● Bảng giá  │  ├──────────────────────────────────┤   │
│ ● Tín dụng  │  │                                  │   │
│ ● CRM       │  │  Table / Grid / Calendar          │   │
│ ● Bảo trì   │  │                                  │   │
│ ● Tài sản   │  │                                  │   │
│ ● Báo cáo   │  │                                  │   │
│              │  └──────────────────────────────────┘   │
│              │                                         │
├──────────┴────────────────────────────────────────────┤
│ 📱 Responsive: Sidebar ẩn trên mobile, hiện hamburger │
└───────────────────────────────────────────────────────┘
```

### 4.3 Pattern thiết kế

| Pattern | Sử dụng tại |
|---------|-------------|
| **KPI Cards** | Dashboard, Booking List, Invoice, Contract List |
| **Data Table** | Tất cả trang danh sách |
| **Filter Bar** | Search + Select + Date range + Create button |
| **Modal Form** | Tạo hóa đơn, ghi thanh toán, tạo KH, form nhỏ |
| **Full-page Form** | Tạo booking, hợp đồng, template |
| **Detail Page** | Chi tiết KH, booking, hợp đồng |
| **Kanban Board** | Booking Status, Lead Pipeline |
| **Calendar View** | Booking Calendar (tuần/ngày) |
| **Tab Navigation** | Invoice status tabs, KH detail tabs |
| **Badge/Chip** | Status, tags, loại KH |

---

## 5. Đa ngôn ngữ

Toàn bộ giao diện hỗ trợ **3 ngôn ngữ**, chuyển đổi realtime:

| Ngôn ngữ | Mã | Trạng thái |
|----------|-----|-----------|
| 🇻🇳 Tiếng Việt | `vi` | Mặc định |
| 🇬🇧 English | `en` | Đầy đủ |
| 🇰🇷 한국어 | `ko` | Đầy đủ |

**14 namespace dịch thuật**: common, auth, dashboard, properties, customers, bookings, contracts, invoices, pricing, credits, crm, inventory, maintenance, reports

---

## 6. Tổng kết

| Tiêu chí | Số lượng |
|----------|---------|
| Tổng màn hình | **45+** |
| Dashboard | **6** (theo vai trò) |
| Module nghiệp vụ | **17** |
| Tính năng | **98+** |
| Ngôn ngữ | **3** |
| Vai trò | **6** |
| Loại không gian | **8** |

> 💡 **Prototype giao diện đã hoàn thành 95%** — Cobi có thể trải nghiệm demo ngay để đánh giá trước khi phát triển backend.
