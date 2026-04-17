# F-02 – Quên mật khẩu & Gửi OTP (Forgot Password)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-02 |
| Epic | EP-01 - Authentication & Authorization |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép Staff **khôi phục mật khẩu** khi quên bằng cách:
1. Nhập email
2. Hệ thống gửi **OTP (6 số)** qua email
3. User verify OTP (F-03)
4. User đặt mật khẩu mới (F-04)

**Business Rationale:**
- **Self-service**: User tự khôi phục mật khẩu không cần admin
- **Security**: OTP expires after 10 minutes, single-use only
- **Rate limiting**: Prevent spam/abuse
- **Audit**: Log all password reset requests

**Method**: Email OTP (không dùng SMS trong Phase 1)

## User Story

> Là **Staff**, khi tôi **quên mật khẩu**, tôi muốn **nhận OTP qua email** để **đặt lại mật khẩu**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Forgot Password Page UI

- [ ] **AC1**: Route `/forgot-password` hiển thị form
- [ ] **AC2**: Form có 1 field: Email (required, validation)
- [ ] **AC3**: Instruction text: "Nhập email đã đăng ký, chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu"
- [ ] **AC4**: Submit button: "Gửi mã OTP"
- [ ] **AC5**: Link "Quay lại đăng nhập" → `/login`
- [ ] **AC6**: Loading state khi submit (button disabled + spinner)

### Email Validation

- [ ] **AC7**: Email required: "Email không được để trống"
- [ ] **AC8**: Email format: "Email không đúng định dạng"
- [ ] **AC9**: Submit disabled nếu email invalid

### OTP Generation & Sending (Happy Path)

- [ ] **AC10**: User nhập email hợp lệ (e.g., "manager@cobi.vn")
- [ ] **AC11**: Click "Gửi mã OTP" → POST `/api/auth/forgot-password`
- [ ] **AC12**: Backend verifies:
  - Check user exists with email
  - Check user status = "active"
- [ ] **AC13**: If valid:
  - Generate 6-digit OTP (random number)
  - Hash OTP before storing (bcrypt)
  - Save to database: email, otpHash, expiresAt (10 minutes), createdAt
  - Send email with OTP
- [ ] **AC14**: Frontend receives success response
- [ ] **AC15**: Redirect to `/verify-otp` với email param: `/verify-otp?email=manager@cobi.vn`
- [ ] **AC16**: Show success message: "✅ Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư."

### Email Content

- [ ] **AC17**: Email subject: "Mã OTP đặt lại mật khẩu - Cobi Coworking"
- [ ] **AC18**: Email body contains:
  - Greeting: "Xin chào [User Name],"
  - Message: "Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản Cobi."
  - OTP code: Large, bold 6-digit number (e.g., **123456**)
  - Expiry: "Mã này có hiệu lực trong 10 phút."
  - Security note: "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này."
  - Support link: "Liên hệ hỗ trợ: support@cobi.vn"
- [ ] **AC19**: Email from: "Cobi Coworking <noreply@cobi.vn>"
- [ ] **AC20**: Plain text + HTML versions

### Error Handling

- [ ] **AC21**: Email không tồn tại trong hệ thống:
  - Do NOT reveal "User not found" (security)
  - Show success message anyway: "Nếu email tồn tại, mã OTP đã được gửi."
  - (Prevents email enumeration attack)
- [ ] **AC22**: User inactive/suspended:
  - Error: "Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ Admin."
- [ ] **AC23**: Email service failure:
  - Error: "Không thể gửi email. Vui lòng thử lại sau."
  - Log error to monitoring system
- [ ] **AC24**: Network error:
  - Error: "Lỗi kết nối. Vui lòng thử lại."

### Rate Limiting

- [ ] **AC25**: Max 3 OTP requests per email per 60 minutes
- [ ] **AC26**: After 3 requests:
  - Error: "Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau 60 phút."
  - HTTP 429 (Too Many Requests)
- [ ] **AC27**: Rate limit counter reset after 60 minutes

### OTP Expiry

- [ ] **AC28**: OTP expires after 10 minutes from generation
- [ ] **AC29**: If user tries to verify expired OTP (in F-03):
  - Error: "Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới."
- [ ] **AC30**: Allow requesting new OTP (resend)

### Security

- [ ] **AC31**: OTP stored as bcrypt hash (not plain text)
- [ ] **AC32**: OTP is single-use (marked as used after verification)
- [ ] **AC33**: Old OTPs invalidated when new OTP requested
- [ ] **AC34**: Log all password reset requests (audit trail)

### Resend OTP Feature

- [ ] **AC35**: On verify OTP page (F-03), có button "Gửi lại mã"
- [ ] **AC36**: Click resend → POST `/api/auth/forgot-password` again
- [ ] **AC37**: New OTP generated, old OTP invalidated
- [ ] **AC38**: Cooldown: Can only resend after 60 seconds
- [ ] **AC39**: Show countdown: "Gửi lại sau 60s, 59s, 58s..."

## Dữ liệu / Fields

### Forgot Password Request

```typescript
interface ForgotPasswordRequest {
  email: string;
}
```

### Forgot Password Response (Success)

```typescript
interface ForgotPasswordResponse {
  success: true;
  message: string; // "OTP sent to email"
  email: string;   // Masked email (e.g., "m****r@cobi.vn")
}
```

### OTP Record (Database)

```typescript
interface PasswordResetOTP {
  id: string;
  email: string;       // User email
  otpHash: string;     // bcrypt hash of OTP
  expiresAt: Date;     // Timestamp (now + 10 minutes)
  createdAt: Date;
  used: boolean;       // Default false, set true after verification
  usedAt?: Date;
}
```

### Password Reset Log

```typescript
interface PasswordResetLog {
  id: string;
  email: string;
  action: 'otp_requested' | 'otp_verified' | 'password_reset';
  ipAddress: string;
  userAgent: string;
  success: boolean;
  timestamp: Date;
}
```

## Scenarios (Given / When / Then)

### Scenario 1: Request OTP thành công

```
Given User vào trang "/forgot-password"
And Form displayed với email field

When User nhập email: "manager@cobi.vn"
And Click "Gửi mã OTP"

Then Frontend POST to "/api/auth/forgot-password":
  • Body: { email: "manager@cobi.vn" }
And Backend verifies:
  • User exists with email "manager@cobi.vn"
  • User status = "active"
And Backend generates:
  • OTP: 6-digit random (e.g., "482391")
  • otpHash: bcrypt(OTP)
  • expiresAt: now() + 10 minutes
And Save to database:
  • Table: password_reset_otps
  • email: "manager@cobi.vn", otpHash, expiresAt, used: false
And Send email:
  • To: manager@cobi.vn
  • Subject: "Mã OTP đặt lại mật khẩu - Cobi Coworking"
  • Body: "Mã OTP của bạn: **482391**. Có hiệu lực 10 phút."
And Backend responds:
  • success: true
  • message: "OTP sent to email"
  • email: "m****r@cobi.vn" (masked)
And Frontend redirects to "/verify-otp?email=manager@cobi.vn"
And Show success toast: "✅ Mã OTP đã được gửi đến email của bạn"
And Log action:
  • action: "otp_requested", email: "manager@cobi.vn", success: true
```

### Scenario 2: Email không tồn tại (Security)

```
Given User on forgot password page
When User nhập email: "notexist@example.com"
And Click "Gửi mã OTP"

Then Backend verifies:
  • User NOT found with email "notexist@example.com"
And Backend responds (SAME as success for security):
  • success: true
  • message: "Nếu email tồn tại, mã OTP đã được gửi."
And NO email sent (user doesn't exist)
And Frontend shows success message
And Redirect to verify-otp page
And Log action:
  • action: "otp_requested", email: "notexist@example.com", success: false, reason: "User not found"
And User cannot tell if email exists or not (prevent enumeration)
```

### Scenario 3: User inactive

```
Given User "suspended@cobi.vn" has status = "inactive"
When User requests OTP for "suspended@cobi.vn"

Then Backend detects user.status = "inactive"
And Responds:
  • success: false
  • error: { code: "ACCOUNT_INACTIVE", message: "Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ Admin." }
And Frontend shows error
And Does NOT redirect to verify-otp
```

### Scenario 4: Rate limiting - Quá nhiều requests

```
Given User "spammer@example.com" đã request OTP 3 lần trong 30 phút
When User tries request lần 4

Then Backend rate limiter blocks request
And Responds:
  • status: 429 Too Many Requests
  • error: "Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau 60 phút."
And Frontend shows error
And Submit button disabled
```

### Scenario 5: Email service failure

```
Given Email service (SMTP) down
When User requests OTP

Then Backend tries to send email → fails
And Catches error
And Responds:
  • success: false
  • error: "Không thể gửi email. Vui lòng thử lại sau."
And Frontend shows error
And Log error to monitoring
And Notify admin about email service failure
```

### Scenario 6: Resend OTP

```
Given User on verify-otp page
And 70 seconds passed since last OTP sent
And User hasn't verified OTP yet

When User clicks "Gửi lại mã"

Then Frontend POST to "/api/auth/forgot-password" again
And Backend:
  • Invalidate old OTP (set used = true or delete)
  • Generate new OTP (e.g., "719254")
  • Save new record
  • Send new email
And Frontend shows: "✅ Mã OTP mới đã được gửi"
And Countdown resets: "Gửi lại sau 60s"
```

### Scenario 7: Multiple OTP requests - Invalidate old

```
Given User requested OTP at 10:00, received "123456"
When User requests OTP again at 10:05, receives "789012"

Then Backend:
  • Old OTP "123456" invalidated (cannot be used)
  • Only new OTP "789012" valid
  • Old record: used = true OR deleted
And User can only verify with "789012"
```

## UI/UX Design

### Forgot Password Form

```
┌──────────────────────────────────────────────────┐
│                                                  │
│              🔑 Quên mật khẩu                     │
│                                                  │
│  Nhập email đã đăng ký, chúng tôi sẽ gửi mã     │
│  OTP để đặt lại mật khẩu.                        │
│                                                  │
│  ──────────────────────────────────────────────  │
│                                                  │
│  Email *                                         │
│  ┌────────────────────────────────────────────┐ │
│  │ example@cobi.vn                            │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │         Gửi mã OTP                         │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  <a href="/login">← Quay lại đăng nhập</a>      │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Success State

```
┌──────────────────────────────────────────────────┐
│  ✅ Mã OTP đã được gửi đến email của bạn         │
│  Vui lòng kiểm tra hộp thư.                      │
├──────────────────────────────────────────────────┤
│  Chuyển hướng đến trang xác minh OTP...          │
└──────────────────────────────────────────────────┘
```

### Email Template (HTML)

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .otp { font-size: 32px; font-weight: bold; color: #1a73e8; letter-spacing: 8px; }
    .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Đặt lại mật khẩu - Cobi Coworking</h2>
    
    <p>Xin chào <strong>{{ userName }}</strong>,</p>
    
    <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản Cobi. Sử dụng mã OTP dưới đây để tiếp tục:</p>
    
    <div style="text-align: center; padding: 20px; background: #f5f5f5; margin: 20px 0;">
      <p class="otp">{{ otpCode }}</p>
    </div>
    
    <p><strong>Mã này có hiệu lực trong 10 phút.</strong></p>
    
    <p style="color: #666; font-size: 14px;">
      Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. 
      Tài khoản của bạn vẫn an toàn.
    </p>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
    
    <p style="font-size: 12px; color: #999;">
      Liên hệ hỗ trợ: <a href="mailto:support@cobi.vn">support@cobi.vn</a><br>
      © 2026 Cobi Coworking. All rights reserved.
    </p>
  </div>
</body>
</html>
```

## API Endpoints

```typescript
// Request OTP
POST /api/auth/forgot-password
Body: {
  email: string;
}
Response (Success): {
  success: true;
  message: string;
  email: string; // Masked
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
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

router.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // 1. Find user
    const user = await db.users.findOne({ email });
    
    // Security: Always respond with success (prevent enumeration)
    if (!user) {
      await logPasswordResetAttempt(email, 'otp_requested', false, req, 'User not found');
      return res.json({
        success: true,
        message: 'Nếu email tồn tại, mã OTP đã được gửi.',
        email: maskEmail(email)
      });
    }
    
    // 2. Check user status
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ Admin.'
        }
      });
    }
    
    // 3. Rate limiting check (custom implementation)
    const recentRequests = await db.passwordResetLogs.count({
      email,
      action: 'otp_requested',
      timestamp: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Last 1 hour
    });
    
    if (recentRequests >= 3) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau 60 phút.'
        }
      });
    }
    
    // 4. Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // 6 digits
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // 5. Invalidate old OTPs
    await db.passwordResetOTPs.updateMany(
      { email, used: false },
      { $set: { used: true } }
    );
    
    // 6. Save new OTP
    await db.passwordResetOTPs.create({
      email,
      otpHash,
      expiresAt,
      createdAt: new Date(),
      used: false
    });
    
    // 7. Send email
    try {
      await sendOTPEmail(user.email, user.name, otp);
    } catch (emailError) {
      console.error('Email send failed:', emailError);
      // Log to monitoring
      await logPasswordResetAttempt(email, 'otp_requested', false, req, 'Email send failed');
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'EMAIL_SEND_FAILED',
          message: 'Không thể gửi email. Vui lòng thử lại sau.'
        }
      });
    }
    
    // 8. Log success
    await logPasswordResetAttempt(email, 'otp_requested', true, req);
    
    // 9. Response
    return res.json({
      success: true,
      message: 'Mã OTP đã được gửi đến email của bạn.',
      email: maskEmail(email)
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống. Vui lòng thử lại sau.'
      }
    });
  }
});

// Helper: Mask email
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  const masked = local[0] + '****' + local[local.length - 1];
  return masked + '@' + domain;
}

// Helper: Send OTP email
async function sendOTPEmail(to: string, userName: string, otp: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  
  const htmlTemplate = `...`; // HTML template above
  
  await transporter.sendMail({
    from: '"Cobi Coworking" <noreply@cobi.vn>',
    to,
    subject: 'Mã OTP đặt lại mật khẩu - Cobi Coworking',
    html: htmlTemplate.replace('{{ userName }}', userName).replace('{{ otpCode }}', otp)
  });
}
```

### Frontend Implementation

```typescript
// Hook: src/hooks/useForgotPassword.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export function useForgotPassword() {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error.message);
      }
      
      return response.json();
    },
    onSuccess: (data, email) => {
      // Redirect to verify OTP page
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    }
  });
}
```

```typescript
// Component: src/pages/ForgotPassword.tsx
import { useForm } from 'react-hook-form';
import { useForgotPassword } from '@/hooks/useForgotPassword';

export function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const forgotPassword = useForgotPassword();
  
  const onSubmit = async (data) => {
    await forgotPassword.mutateAsync(data.email);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Quên mật khẩu</h1>
      <p>Nhập email đã đăng ký, chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.</p>
      
      <input
        type="email"
        {...register('email', {
          required: 'Email không được để trống',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email không đúng định dạng'
          }
        })}
        placeholder="example@cobi.vn"
      />
      {errors.email && <span className="error">{errors.email.message}</span>}
      
      <button type="submit" disabled={forgotPassword.isPending}>
        {forgotPassword.isPending ? 'Đang gửi...' : 'Gửi mã OTP'}
      </button>
      
      {forgotPassword.error && (
        <div className="error">{forgotPassword.error.message}</div>
      )}
      
      <a href="/login">← Quay lại đăng nhập</a>
    </form>
  );
}
```

## Dependencies

**Phụ thuộc vào:**
- EP-09: Staff Management (users table)
- Email service (SMTP: Gmail, SendGrid, AWS SES)

**Được sử dụng bởi:**
- F-03: Verify OTP (next step)
- F-04: Reset Password (after OTP verified)

## Out of Scope

**Phase 1 không làm:**
- SMS OTP → Phase 2
- WhatsApp OTP → Phase 2
- Security questions → Phase 3

## Testing Checklist

- [ ] Valid email sends OTP
- [ ] Non-existent email shows success (security)
- [ ] Inactive account blocked
- [ ] Rate limiting after 3 requests
- [ ] OTP email received within seconds
- [ ] Email contains 6-digit OTP
- [ ] Masked email displayed correctly
- [ ] Old OTPs invalidated when new requested
- [ ] Redirect to verify-otp page works
- [ ] Logs created for all attempts

---

**Version**: 1.0  
**Last Updated**: 16/04/2026  
**Author**: BA Team
