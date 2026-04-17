# Flow 01 – Xác thực người dùng (Auth Flow)

## Mục tiêu

Đảm bảo chỉ người dùng đã đăng nhập mới được truy cập Dashboard.  
Người dùng chưa đăng nhập sẽ bị chuyển hướng về trang Login, và sau khi đăng nhập thành công sẽ được đưa về **đúng trang** họ cố truy cập.

---

## Các kịch bản (Scenarios)

| # | Kịch bản | Kết quả |
|---|---|---|
| A | Chưa đăng nhập, vào URL bất kỳ của Dashboard | Redirect → `/auth/login` |
| B | Đã đăng nhập, vào `/auth/login` | Redirect → Dashboard (`/`) |
| C | Chưa đăng nhập, vào `/transactions` → đăng nhập | Redirect → `/transactions` (trang gốc) |
| D | Đăng nhập thành công | Lưu session vào `localStorage`, vào Dashboard |
| E | Đăng xuất | Xoá `localStorage`, redirect → `/auth/login` |
| F | Refresh trang khi đã đăng nhập | Giữ nguyên session từ `localStorage` |
| G | Quên mật khẩu → nhập OTP → đặt lại MK | Sau khi đặt lại xong → redirect `/auth/login` |

---

## Sơ đồ luồng tổng quan

```
                          ┌─────────────┐
                          │  Người dùng │
                          │  vào URL    │
                          └──────┬──────┘
                                 │
                    ┌────────────▼────────────┐
                    │      ProtectedRoute      │
                    │  kiểm tra localStorage  │
                    └────────────┬────────────┘
                                 │
               ┌─────────────────┴──────────────────┐
               │                                    │
        Chưa đăng nhập                        Đã đăng nhập
               │                                    │
               ▼                                    ▼
    redirect /auth/login                   Hiển thị trang
    (lưu URL gốc vào state)                  bình thường
               │
               ▼
      ┌────────────────┐
      │  LoginPage     │
      │  nhập email    │
      │  + password    │
      └───────┬────────┘
              │
    ┌─────────▼─────────┐
    │  GuestRoute chặn  │
    │  nếu đã login rồi │
    │  → về Dashboard   │
    └─────────┬─────────┘
              │ (chưa login)
              ▼
    ┌──────────────────────┐
    │  Validate form       │
    │  - Email không rỗng  │
    │  - Password không rỗng│
    └──────────┬───────────┘
               │
         ┌─────▼──────┐
         │  API call  │  (hiện tại: mock 1.2s delay)
         └─────┬──────┘
               │ Thành công
               ▼
    ┌─────────────────────────┐
    │  login(email)           │
    │  → lưu vào localStorage │
    │  → cập nhật Zustan.     │
    └──────────┬──────────────┘
               │
               ▼
    navigate(from, { replace: true })
    (from = URL gốc user muốn vào, mặc định "/")
               │
               ▼
         ┌───────────┐
         │ Dashboard │
         └───────────┘
```

---

## Sơ đồ luồng Quên mật khẩu

```
/auth/forgot-password
        │
        │ Nhập email → Gửi OTP
        ▼
/auth/otp
        │
        │ Nhập 6 chữ số OTP
        │ (hỗ trợ paste, countdown 60s resend)
        ▼
/auth/reset-password
        │
        │ Nhập mật khẩu mới + xác nhận
        │ (strength bar + checklist)
        ▼
/auth/login  ← Đặt lại thành công
```

---

## Sơ đồ luồng Đăng xuất

```
Sidebar → nút "Đăng xuất"
        │
        ▼
  logout()
  → localStorage.removeItem('coworking_space_auth')
  → setUser(null)
        │
        ▼
navigate('/auth/login', { replace: true })
```

---

## Các file liên quan

| File | Vai trò |
|---|---|
| `src/contexts/AuthContext.tsx` | State management: `user`, `login()`, `logout()` |
| `src/components/router/AuthGuard.tsx` | `ProtectedRoute` + `GuestRoute` |
| `src/App.tsx` | Cấu hình route phân quyền |
| `src/pages/auth/LoginPage.tsx` | UI đăng nhập, gọi `login()` |
| `src/pages/auth/ForgotPasswordPage.tsx` | UI quên mật khẩu |
| `src/pages/auth/OtpPage.tsx` | UI nhập mã OTP |
| `src/pages/auth/ResetPasswordPage.tsx` | UI đặt lại mật khẩu |
| `src/components/layout/Sidebar.tsx` | Nút đăng xuất, hiển thị thông tin user |
| `src/components/layout/AuthLayout.tsx` | Layout bọc các trang auth |

---

## Cấu trúc dữ liệu

### AuthUser (lưu trong localStorage)

```ts
interface AuthUser {
  email: string   // email đăng nhập
  name: string    // tên hiển thị (hiện tại hardcode "Admin User")
}
```

**Key localStorage:** `coworking_space_auth`  
**Format:** JSON string của `AuthUser`

---

## Trạng thái theo từng bước

| Bước | `user` | `localStorage` | URL |
|---|---|---|---|
| Lần đầu vào app, chưa login | `null` | (trống) | `/auth/login` |
| Sau khi `login()` | `{ email, name }` | `coworking_space_auth = {...}` | `/` hoặc URL gốc |
| Refresh trang | `{ email, name }` (đọc từ storage) | không đổi | không đổi |
| Sau khi `logout()` | `null` | (trống) | `/auth/login` |

---

## Lưu ý & Hạn chế hiện tại

1. **Không có API thật** – `login()` không xác thực credentials, chỉ lưu email vào storage.
2. **Không có token/JWT** – cần thêm khi tích hợp backend.
3. **Không có refresh token** – session không hết hạn.
4. **Tên user hardcode** – `"Admin User"`, cần lấy từ API sau.
5. **Chưa có role-based access** – mọi user đăng nhập đều có toàn quyền.

---

## Hướng phát triển

- [ ] Gọi API đăng nhập thật, nhận JWT token
- [ ] Lưu `accessToken` + `refreshToken` vào storage
- [ ] Tự động refresh token khi hết hạn (axios interceptor)
- [ ] Thêm role: `admin`, `manager`, `agent`
- [ ] Role-based route protection
