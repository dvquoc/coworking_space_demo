# F-04 – Đặt lại mật khẩu (Reset Password)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-04 |
| Epic | EP-01 - Authentication & Authorization |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Sau khi verify OTP thành công (F-03), user được phép đặt mật khẩu mới. Feature này:
1. User nhập mật khẩu mới (+ confirm)
2. Validate password strength
3. Update password trong database (bcrypt hash)
4. Invalidate reset token
5. Auto-login user hoặc redirect to login

**Business Rationale:**
- **Password security**: Enforce strong password rules
- **User confirmation**: Confirm password to avoid typos
- **One-time use**: Reset token expires after use
- **Audit trail**: Log password changes

## User Story

> Là **Staff**, sau khi xác minh OTP, tôi muốn **đặt mật khẩu mới** để **khôi phục quyền truy cập tài khoản**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Reset Password Page UI

- [ ] **AC1**: Route `/reset-password` (requires valid reset token)
- [ ] **AC2**: Form có 2 fields:
  - Mật khẩu mới (type: password, required)
  - Xác nhận mật khẩu (type: password, required)
- [ ] **AC3**: "Hiện/Ẩn mật khẩu" toggle for both fields
- [ ] **AC4**: Password strength indicator (Weak/Medium/Strong)
- [ ] **AC5**: Password requirements checklist:
  - ✓ Tối thiểu 8 ký tự
  - ✓ Có ít nhất 1 chữ hoa (A-Z)
  - ✓ Có ít nhất 1 chữ thường (a-z)
  - ✓ Có ít nhất 1 số (0-9)
  - ✓ Có ít nhất 1 ký tự đặc biệt (@#$%^&*!)
- [ ] **AC6**: Submit button: "Đặt lại mật khẩu"
- [ ] **AC7**: Loading state khi submit

### Validation (Client-side)

- [ ] **AC8**: Mật khẩu mới required: "Mật khẩu không được để trống"
- [ ] **AC9**: Min 8 chars: "Mật khẩu tối thiểu 8 ký tự"
- [ ] **AC10**: Must contain uppercase: "Phải có ít nhất 1 chữ hoa"
- [ ] **AC11**: Must contain lowercase: "Phải có ít nhất 1 chữ thường"
- [ ] **AC12**: Must contain number: "Phải có ít nhất 1 số"
- [ ] **AC13**: Must contain special char: "Phải có ít nhất 1 ký tự đặc biệt"
- [ ] **AC14**: Confirm password must match: "Mật khẩu xác nhận không khớp"
- [ ] **AC15**: Submit disabled if invalid

### Reset Flow (Happy Path)

- [ ] **AC16**: User vào page với valid reset token (from F-03)
- [ ] **AC17**: User nhập:
  - Mật khẩu mới: "NewPass@123"
  - Xác nhận: "NewPass@123"
- [ ] **AC18**: Click "Đặt lại mật khẩu" → POST `/api/auth/reset-password`
- [ ] **AC19**: Backend verifies:
  - Verify reset token (JWT)
  - Extract email from token
  - Validate password strength (server-side)
  - Check passwords match
- [ ] **AC20**: If valid:
  - Hash new password (bcrypt, salt rounds 10)
  - Update user.passwordHash in database
  - Invalidate reset token (add to blacklist or rely on expiry)
  - Log password change
- [ ] **AC21**: Backend responds success
- [ ] **AC22**: Frontend shows success message
- [ ] **AC23**: Auto-redirect to `/login` after 3 seconds
- [ ] **AC24**: Success message: "✅ Mật khẩu đã được đặt lại thành công! Đang chuyển đến trang đăng nhập..."

### Error Handling

- [ ] **AC25**: Invalid/expired reset token:
  - Error: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn."
  - Redirect to `/forgot-password` after 3 seconds
- [ ] **AC26**: Weak password (server-side check):
  - Error: "Mật khẩu không đủ mạnh. Vui lòng thử lại."
- [ ] **AC27**: Passwords don't match:
  - Error: "Mật khẩu xác nhận không khớp."
- [ ] **AC28**: Network error:
  - Error: "Lỗi kết nối. Vui lòng thử lại."

### Password Strength Indicator

- [ ] **AC29**: Real-time strength calculation:
  - **Weak** (red): < 3 criteria met
  - **Medium** (yellow): 3-4 criteria met
  - **Strong** (green): All 5 criteria met
- [ ] **AC30**: Visual indicator: Progress bar or colored text

### Security

- [ ] **AC31**: Reset token single-use (expires after password reset)
- [ ] **AC32**: Reset token expires in 15 minutes (from F-03)
- [ ] **AC33**: Password never sent/logged in plain text
- [ ] **AC34**: Invalidate all user sessions after password reset (optional security)
- [ ] **AC35**: Send email notification: "Your password has been changed"

### Post-Reset Actions

- [ ] **AC36**: Log password change in audit trail:
  - userId, action: "password_reset", timestamp, ipAddress
- [ ] **AC37**: Send confirmation email:
  - Subject: "Mật khẩu đã được thay đổi - Cobi Coworking"
  - Body: "Mật khẩu tài khoản của bạn vừa được thay đổi. Nếu không phải bạn, vui lòng liên hệ ngay."

## Dữ liệu / Fields

### Reset Password Request

```typescript
interface ResetPasswordRequest {
  resetToken: string;  // JWT from F-03
  newPassword: string;
  confirmPassword: string;
}
```

### Reset Password Response (Success)

```typescript
interface ResetPasswordResponse {
  success: true;
  message: string;
}
```

### Password Change Log

```typescript
interface PasswordChangeLog {
  id: string;
  userId: string;
  changeMethod: 'forgot_password' | 'manual_change' | 'admin_reset';
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}
```

## Scenarios (Given / When / Then)

### Scenario 1: Reset password thành công

```
Given User verified OTP successfully (F-03)
And Reset token stored: "eyJhbGc..." (expires in 15min)
And User on page "/reset-password"

When User nhập:
  • Mật khẩu mới: "SecurePass@2026"
  • Xác nhận: "SecurePass@2026"
And Password meets all criteria:
  • ✓ 16 chars (>8)
  • ✓ Has uppercase: S, P
  • ✓ Has lowercase: e,c,u,r,...
  • ✓ Has number: 2,0,2,6
  • ✓ Has special: @
And Strength indicator: "Strong" (green)
And Click "Đặt lại mật khẩu"

Then Frontend POST to "/api/auth/reset-password":
  • Body: { resetToken: "eyJ...", newPassword: "SecurePass@2026", confirmPassword: "SecurePass@2026" }
And Backend verifies:
  • jwt.verify(resetToken) → Valid, email: "manager@cobi.vn"
  • Passwords match
  • Password strength validated
And Backend updates:
  • Find user by email "manager@cobi.vn"
  • newPasswordHash = bcrypt.hash("SecurePass@2026", 10)
  • user.passwordHash = newPasswordHash
  • Save to database
And Create log:
  • Table: password_change_logs
  • userId, changeMethod: "forgot_password", timestamp
And Send confirmation email:
  • To: manager@cobi.vn
  • Subject: "Mật khẩu đã được thay đổi"
And Backend responds:
  • success: true, message: "Password reset successful"
And Frontend:
  • Show success toast: "✅ Mật khẩu đã được đặt lại thành công!"
  • Countdown: "Chuyển đến trang đăng nhập sau 3s..."
  • Redirect to "/login" after 3 seconds
And User can now login with new password
```

### Scenario 2: Passwords don't match

```
Given User on reset password page
When User nhập:
  • Mật khẩu mới: "SecurePass@2026"
  • Xác nhận: "SecurePass@2025" (typo)
And Click submit

Then Frontend validation:
  • Passwords don't match
  • Error: "Mật khẩu xác nhận không khớp"
  • Border red on confirm field
  • Submit disabled
And User must fix before submitting
```

### Scenario 3: Weak password

```
Given User on reset password page
When User nhập:
  • Mật khẩu mới: "abc123" (weak)
  • Xác nhận: "abc123"
And Click submit

Then Frontend validation shows:
  • ❌ Tối thiểu 8 ký tự (only 6)
  • ❌ Có ít nhất 1 chữ hoa (none)
  • ✓ Có ít nhất 1 chữ thường
  • ✓ Có ít nhất 1 số
  • ❌ Có ít nhất 1 ký tự đặc biệt (none)
And Strength: "Weak" (red)
And Error: "Mật khẩu không đủ mạnh"
And Submit disabled
```

### Scenario 4: Invalid/expired reset token

```
Given Reset token expired (created 20 minutes ago, expires in 15min)
When User tries to access "/reset-password"

Then Frontend sends request with expired token
And Backend:
  • jwt.verify(resetToken) → throws TokenExpiredError
And Responds:
  • success: false
  • error: { code: "INVALID_TOKEN", message: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn." }
And Frontend:
  • Show error message
  • Redirect to "/forgot-password" after 3s
  • Message: "Vui lòng yêu cầu đặt lại mật khẩu lại."
```

### Scenario 5: Password strength indicator

```
Given User typing new password in real-time

# Weak
When User types: "abc"
Then Strength: "Weak" (red), progress 20%

# Medium
When User types: "Abc123"
Then Strength: "Medium" (yellow), progress 60%
  • ❌ <8 chars
  • ✓ Has uppercase
  • ✓ Has lowercase
  • ✓ Has number
  • ❌ No special char

# Strong
When User types: "Abc123@#"
Then Strength: "Strong" (green), progress 100%
  • ✓ 8 chars
  • ✓ Has uppercase
  • ✓ Has lowercase
  • ✓ Has number
  • ✓ Has special char
```

### Scenario 6: Confirmation email sent

```
Given User successfully reset password

Then System sends email:
  • To: manager@cobi.vn
  • From: noreply@cobi.vn
  • Subject: "Mật khẩu đã được thay đổi - Cobi Coworking"
  • Body:
    "Xin chào [User Name],
     
     Mật khẩu tài khoản Cobi của bạn vừa được thay đổi thành công vào lúc [timestamp].
     
     Nếu KHÔNG phải bạn thực hiện thay đổi này, vui lòng liên hệ ngay:
     Email: support@cobi.vn
     Hotline: 1900-xxxx
     
     Trân trọng,
     Cobi Team"
```

## UI/UX Design

### Reset Password Form

```
┌──────────────────────────────────────────────────┐
│                                                  │
│          🔐 Đặt lại mật khẩu                      │
│                                                  │
│  Vui lòng nhập mật khẩu mới cho tài khoản.      │
│                                                  │
│  ──────────────────────────────────────────────  │
│                                                  │
│  Mật khẩu mới *                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ ••••••••••••••                        [👁️] │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Độ mạnh: ████████░░ Strong (green)             │
│                                                  │
│  Yêu cầu mật khẩu:                               │
│  ✓ Tối thiểu 8 ký tự                             │
│  ✓ Có ít nhất 1 chữ hoa                          │
│  ✓ Có ít nhất 1 chữ thường                       │
│  ✓ Có ít nhất 1 số                               │
│  ✓ Có ít nhất 1 ký tự đặc biệt                   │
│                                                  │
│  Xác nhận mật khẩu *                             │
│  ┌────────────────────────────────────────────┐ │
│  │ ••••••••••••••                        [👁️] │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │      Đặt lại mật khẩu                      │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Success State

```
┌──────────────────────────────────────────────────┐
│  ✅ Mật khẩu đã được đặt lại thành công!          │
│                                                  │
│  Chuyển đến trang đăng nhập sau 3s...            │
└──────────────────────────────────────────────────┘
```

### Expired Token State

```
┌──────────────────────────────────────────────────┐
│  ⚠️ Liên kết đặt lại mật khẩu không hợp lệ        │
│     hoặc đã hết hạn.                             │
│                                                  │
│  Chuyển đến trang yêu cầu lại sau 3s...          │
└──────────────────────────────────────────────────┘
```

## API Endpoints

```typescript
// Reset password
POST /api/auth/reset-password
Body: {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}
Response (Success): {
  success: true;
  message: string;
}
Response (Error): {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
```

## Technical Notes

### Backend Implementation

```typescript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

router.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;
    
    // 1. Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.'
        }
      });
    }
    
    const email = decoded.email;
    
    // 2. Validate passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PASSWORDS_MISMATCH',
          message: 'Mật khẩu xác nhận không khớp.'
        }
      });
    }
    
    // 3. Validate password strength (server-side)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: 'Mật khẩu không đủ mạnh. Vui lòng đáp ứng tất cả yêu cầu.'
        }
      });
    }
    
    // 4. Find user
    const user = await db.users.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Không tìm thấy tài khoản.'
        }
      });
    }
    
    // 5. Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    // 6. Update password
    await db.users.updateOne(
      { _id: user._id },
      { $set: { passwordHash } }
    );
    
    // 7. Log password change
    await db.passwordChangeLogs.create({
      userId: user._id,
      changeMethod: 'forgot_password',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date()
    });
    
    // 8. Send confirmation email
    await sendPasswordChangedEmail(user.email, user.name);
    
    // 9. Optional: Invalidate all user sessions (logout everywhere)
    // await invalidateAllUserSessions(user._id);
    
    // 10. Response
    return res.json({
      success: true,
      message: 'Mật khẩu đã được đặt lại thành công.'
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống. Vui lòng thử lại sau.'
      }
    });
  }
});
```

### Frontend Implementation

```typescript
// Component: src/pages/ResetPassword.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ResetPasswordPage() {
  const resetToken = sessionStorage.getItem('resetToken');
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [strength, setStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  
  // Password strength calculation
  const calculateStrength = (password: string) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@#$%^&*!]/.test(password)
    };
    
    const score = Object.values(criteria).filter(Boolean).length;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken,
          newPassword,
          confirmPassword
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Show success, redirect after 3s
        alert('✅ Mật khẩu đã được đặt lại thành công!');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        alert(data.error.message);
      }
    } catch (err) {
      alert('Lỗi kết nối. Vui lòng thử lại.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h1>Đặt lại mật khẩu</h1>
      
      <input
        type="password"
        placeholder="Mật khẩu mới"
        value={newPassword}
        onChange={e => {
          setNewPassword(e.target.value);
          setStrength(calculateStrength(e.target.value));
        }}
        required
      />
      
      <div className={`strength-indicator ${strength}`}>
        Độ mạnh: {strength === 'weak' ? 'Yếu' : strength === 'medium' ? 'Trung bình' : 'Mạnh'}
      </div>
      
      <input
        type="password"
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        required
      />
      
      <button type="submit">Đặt lại mật khẩu</button>
    </form>
  );
}
```

## Dependencies

**Phụ thuộc vào:**
- F-03: Verify OTP (provides reset token)

**Được sử dụng bởi:**
- F-01: Login (user can now login with new password)

## Out of Scope

**Phase 1 không làm:**
- Password history (prevent reusing last 5 passwords) → Phase 2
- Force password change on first login → Phase 2

## Testing Checklist

- [ ] Valid password resets successfully
- [ ] Passwords mismatch shows error
- [ ] Weak password blocked
- [ ] Expired token shows error
- [ ] Invalid token shows error
- [ ] Strength indicator works correctly
- [ ] Redirect to login after success
- [ ] Confirmation email sent
- [ ] Password change logged
- [ ] User can login with new password

---

**Version**: 1.0  
**Last Updated**: 16/04/2026  
**Author**: BA Team
