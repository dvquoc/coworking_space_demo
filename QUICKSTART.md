# 🚀 Quick Start Guide

## 1. Cài đặt dependencies

```bash
npm install
```

## 2. Tạo file .env

```bash
cp .env.example .env
```

Nội dung `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000
```

## 3. Chạy development server

```bash
npm run dev
```

App sẽ chạy tại: **http://localhost:5173**

## 4. Test Authentication Flow

### Cần backend API với các endpoints:

- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout (optional logging)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Send OTP email
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password

### Test credentials mẫu (thiết lập trong backend):

```json
{
  "email": "admin@cobi.vn",
  "password": "Admin@123",
  "role": "admin"
}
```

```json
{
  "email": "sale@cobi.vn",
  "password": "Sale@123",
  "role": "sale"
}
```

## 5. Routes để test

### Public routes (Guest only):
- `/login` - Login page
- `/forgot-password` - Forgot password
- `/verify-otp` - Verify OTP
- `/reset-password` - Reset password

### Protected routes:
- `/dashboard` - Admin/Manager only
- `/customers` - Admin/Manager/Sale
- `/invoices` - Admin/Manager/Accountant
- `/maintenance` - Admin/Maintenance
- `/reports` - Admin/Investor

### Error pages:
- `/forbidden` - 403 Forbidden
- `/random-path` - 404 Not Found

## 6. Development Notes

### Zustand persisted state
Authentication state được lưu trong `localStorage` với key `auth-storage`. Clear bằng:
```js
localStorage.removeItem('auth-storage')
```

### Token refresh
Access token tự động refresh khi:
- Expires trong < 2 phút
- API trả về 401 Unauthorized

### Remember me
Email được lưu trong `localStorage` với key `rememberedEmail`

## 7. Build production

```bash
npm run build
```

Preview build:
```bash
npm run preview
```

## 8. Troubleshooting

### Lỗi CORS
Backend cần enable CORS với:
```js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
```

### Lỗi httpOnly cookie
Backend cần set cookie với:
```js
res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
})
```

### Lỗi 401 loop
Kiểm tra endpoint `/api/auth/refresh` hoạt động đúng

## 9. Next Steps

✅ EP-01 Authentication hoàn tất
📝 Tiếp tục implement các Epic khác:
- EP-02: User Management
- EP-03: Space Management
- EP-04: Booking Management
- EP-05: Contract & Payment
- ...
