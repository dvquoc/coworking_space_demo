# Mock Authentication Guide

Mock authentication đã được bật để test UI mà không cần backend.

## 🔧 Cấu hình

File `.env`:
```
VITE_MOCK_API=true
```

## 👥 Tài khoản test

Đăng nhập với **bất kỳ mật khẩu nào** cùng các email sau:

| Email | Role | Default Page |
|-------|------|--------------|
| `admin@cobi.vn` | Admin | /dashboard |
| `manager@cobi.vn` | Manager | /dashboard |
| `sale@cobi.vn` | Sale | /customers |
| `accountant@cobi.vn` | Accountant | /invoices |
| `maintenance@cobi.vn` | Maintenance | /maintenance |
| `investor@cobi.vn` | Investor | /reports |

## ✅ Tính năng hỗ trợ

- ✅ **Login**: Nhập email từ danh sách trên + bất kỳ mật khẩu nào
- ✅ **Logout**: Hoạt động bình thường
- ✅ **Forgot Password**: Nhập bất kỳ email nào
- ✅ **Verify OTP**: Nhập bất kỳ 6 chữ số nào (ví dụ: `123456`)
- ✅ **Reset Password**: Nhập mật khẩu mới theo quy tắc
- ✅ **Remember Me**: Ghi nhớ email
- ✅ **Role-based Redirect**: Chuyển hướng theo vai trò

## 🎯 Ví dụ test

### Test Admin
```
Email: admin@cobi.vn
Password: 123456 (hoặc bất kỳ)
→ Redirect to /dashboard
→ Xem được: Dashboard, Customers, Invoices, Maintenance, Reports
```

### Test Sale
```
Email: sale@cobi.vn
Password: anything
→ Redirect to /customers
→ Chỉ xem được: Customers
```

### Test Full Auth Flow
1. Login với `admin@cobi.vn`
2. Click "Quên mật khẩu"
3. Nhập `test@cobi.vn` → Gửi OTP
4. Nhập OTP: `123456` → Xác thực
5. Đặt mật khẩu mới (phải đủ mạnh)
6. Redirect về /auth/login sau 3s

## 🔄 Tắt Mock Mode

Để dùng backend thật, sửa `.env`:
```
VITE_MOCK_API=false
```

Hoặc xóa dòng `VITE_MOCK_API` hoàn toàn.

## 📝 Lưu ý

- Mock delay: 800ms để giả lập network latency
- Không cần backend chạy
- Token được lưu trong localStorage
- Refresh page vẫn giữ session
