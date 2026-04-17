# F-03 – Xác minh OTP (Verify OTP)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-03 |
| Epic | EP-01 - Authentication & Authorization |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Sau khi user nhận OTP qua email (F-02), feature này cho phép:
1. User nhập mã OTP 6 số
2. Hệ thống verify OTP hợp lệ
3. Nếu đúng → chuyển sang trang đặt lại mật khẩu (F-04)
4. Nếu sai/hết hạn → show error, cho phép thử lại hoặc gửi lại OTP

**Business Rationale:**
- **Security verification**: Đảm bảo user owns email account
- **Single-use**: Mỗi OTP chỉ dùng 1 lần
- **Time-limited**: OTP expires after 10 minutes
- **User-friendly**: Auto-submit khi nhập đủ 6 số

## User Story

> Là **Staff**, sau khi nhận OTP qua email, tôi muốn **nhập OTP để xác minh** và tiếp tục **đặt lại mật khẩu**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Verify OTP Page UI

- [ ] **AC1**: Route `/verify-otp?email=xxx` hiển thị form
- [ ] **AC2**: Show email (masked): "Mã OTP đã được gửi đến m****r@cobi.vn"
- [ ] **AC3**: OTP input: 6 ô nhập số riêng biệt (modern UX)
- [ ] **AC4**: Auto-focus ô đầu tiên khi page load
- [ ] **AC5**: Auto-move to next box khi nhập 1 số
- [ ] **AC6**: Backspace moves to previous box
- [ ] **AC7**: Submit button: "Xác minh" (hoặc auto-submit khi nhập đủ 6 số)
- [ ] **AC8**: "Gửi lại mã OTP" link với countdown timer (60s)
- [ ] **AC9**: Link "Quay lại" → `/forgot-password`

### OTP Input Behavior

- [ ] **AC10**: Chỉ accept số (0-9), reject chữ cái
- [ ] **AC11**: Paste support: User paste "123456" → auto-fill 6 ô
- [ ] **AC12**: Copy protection: Không hiện số dạng plain text (optional)
- [ ] **AC13**: Mobile keyboard: Type "number" để bật numpad

### Verification Flow (Happy Path)

- [ ] **AC14**: User nhập OTP: "482391"
- [ ] **AC15**: Click "Xác minh" (hoặc auto-submit) → POST `/api/auth/verify-otp`
- [ ] **AC16**: Backend verifies:
  - Find latest OTP record for email
  - Check OTP not expired (expiresAt > now)
  - Check OTP not used (used = false)
  - Compare OTP (bcrypt.compare)
- [ ] **AC17**: If valid:
  - Mark OTP as used (used = true, usedAt = now)
  - Generate reset token (JWT, expires in 15 minutes)
  - Return reset token
- [ ] **AC18**: Frontend receives success:
  - Store reset token (memory hoặc state)
  - Redirect to `/reset-password` với token
- [ ] **AC19**: Show success toast: "✅ Xác minh thành công!"

### Error Handling

- [ ] **AC20**: Wrong OTP:
  - Error: "Mã OTP không chính xác. Vui lòng thử lại."
  - Clear OTP inputs
  - Allow retry (max 5 attempts)
- [ ] **AC21**: Expired OTP:
  - Error: "Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới."
  - Show "Gửi lại mã" button (active immediately)
- [ ] **AC22**: OTP already used:
  - Error: "Mã OTP đã được sử dụng. Vui lòng yêu cầu mã mới."
- [ ] **AC23**: Max attempts exceeded (5 wrong tries):
  - Error: "Quá nhiều lần thử sai. Mã OTP đã bị khóa. Vui lòng yêu cầu mã mới."
  - Invalidate current OTP
- [ ] **AC24**: No OTP found for email:
  - Error: "Không tìm thấy yêu cầu đặt lại mật khẩu. Vui lòng thử lại."
  - Redirect to `/forgot-password`

### Resend OTP

- [ ] **AC25**: "Gửi lại mã" initially disabled với countdown: "Gửi lại sau 60s"
- [ ] **AC26**: After 60s: Button enabled, text = "Gửi lại mã OTP"
- [ ] **AC27**: Click resend → call POST `/api/auth/forgot-password`
- [ ] **AC28**: New OTP sent, countdown resets
- [ ] **AC29**: Success message: "✅ Mã OTP mới đã được gửi"

### Countdown Timer

- [ ] **AC30**: Display: "Mã OTP hết hạn sau: 09:45" (mm:ss)
- [ ] **AC31**: Countdown from 10:00 to 00:00
- [ ] **AC32**: When reaches 00:00:
  - Show message: "Mã OTP đã hết hạn"
  - Disable submit button
  - Enable "Gửi lại mã" immediately
- [ ] **AC33**: Timer updates every second

## Dữ liệu / Fields

### Verify OTP Request

```typescript
interface VerifyOTPRequest {
  email: string;
  otp: string; // 6 digits
}
```

### Verify OTP Response (Success)

```typescript
interface VerifyOTPResponse {
  success: true;
  resetToken: string; // JWT token for password reset
  message: string;
}
```

### Verify OTP Response (Error)

```typescript
interface VerifyOTPErrorResponse {
  success: false;
  error: {
    code: string; // "INVALID_OTP", "EXPIRED_OTP", "OTP_USED", "MAX_ATTEMPTS"
    message: string;
  };
}
```

### Reset Token Payload (JWT)

```typescript
interface ResetTokenPayload {
  email: string;
  purpose: 'password_reset';
  iat: number;
  exp: number; // 15 minutes from now
}
```

## Scenarios (Given / When / Then)

### Scenario 1: Verify OTP thành công

```
Given User received OTP "482391" via email (from F-02)
And User on page "/verify-otp?email=manager@cobi.vn"
And 6 OTP input boxes displayed

When User nhập OTP: "4" "8" "2" "3" "9" "1"
And Click "Xác minh" (hoặc auto-submit)

Then Frontend POST to "/api/auth/verify-otp":
  • Body: { email: "manager@cobi.vn", otp: "482391" }
And Backend verifies:
  • Find OTP record: email = "manager@cobi.vn"
  • Check expiresAt (e.g., 10:15) > now (10:05) → Valid
  • Check used = false → Valid
  • bcrypt.compare("482391", otpHash) → Match
And Backend updates:
  • Set used = true, usedAt = now
And Generate reset token:
  • JWT payload: { email: "manager@cobi.vn", purpose: "password_reset", exp: now + 15min }
And Backend responds:
  • success: true
  • resetToken: "eyJhbGc..."
  • message: "OTP verified successfully"
And Frontend:
  • Store resetToken in state
  • Redirect to "/reset-password"
  • Show toast: "✅ Xác minh thành công!"
And Log action:
  • action: "otp_verified", email: "manager@cobi.vn", success: true
```

### Scenario 2: Wrong OTP

```
Given User received OTP "482391"
When User nhập OTP: "123456" (sai)

Then Backend:
  • bcrypt.compare("123456", otpHash) → No match
And Responds:
  • success: false
  • error: { code: "INVALID_OTP", message: "Mã OTP không chính xác. Vui lòng thử lại." }
And Frontend:
  • Show error message
  • Clear all 6 input boxes
  • Focus ô đầu tiên
  • Increment attempt counter (1/5)
And User can try again
```

### Scenario 3: Expired OTP

```
Given OTP "482391" created at 10:00, expiresAt 10:10
And Current time: 10:12 (2 minutes past expiry)
When User nhập OTP: "482391"

Then Backend detects:
  • expiresAt (10:10) < now (10:12) → Expired
And Responds:
  • error: { code: "EXPIRED_OTP", message: "Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới." }
And Frontend:
  • Show error
  • Enable "Gửi lại mã" button immediately
  • Disable submit button
```

### Scenario 4: OTP already used

```
Given OTP "482391" with used = true (verified trước đó)
When User tries to verify again with same OTP

Then Backend detects: used = true
And Responds:
  • error: { code: "OTP_USED", message: "Mã OTP đã được sử dụng. Vui lòng yêu cầu mã mới." }
And Frontend shows error
```

### Scenario 5: Max attempts exceeded

```
Given User đã nhập sai 4 lần (attempts = 4)
When User nhập sai lần 5

Then Backend:
  • Increment attempt counter → 5
  • Invalidate OTP (set used = true)
And Responds:
  • error: { code: "MAX_ATTEMPTS", message: "Quá nhiều lần thử sai. Mã OTP đã bị khóa. Vui lòng yêu cầu mã mới." }
And Frontend:
  • Show error
  • Disable submit
  • Enable "Gửi lại mã"
```

### Scenario 6: Resend OTP

```
Given User on verify-otp page
And Countdown timer shows: "Gửi lại sau 25s"
And 25 seconds pass, timer reaches 00:00

When Timer expires

Then "Gửi lại mã OTP" button enabled
And User clicks button
Then Frontend POST to "/api/auth/forgot-password":
  • email: "manager@cobi.vn"
And New OTP generated & sent (F-02 flow)
And Success toast: "✅ Mã OTP mới đã được gửi"
And Countdown resets: "Gửi lại sau 60s"
```

### Scenario 7: Paste OTP

```
Given User copied OTP "482391" from email
And On verify-otp page, focus on first box

When User pastes (Ctrl+V / Cmd+V)

Then Frontend auto-fills:
  • Box 1: "4"
  • Box 2: "8"
  • Box 3: "2"
  • Box 4: "3"
  • Box 5: "9"
  • Box 6: "1"
And Auto-submit (or focus submit button)
```

### Scenario 8: Countdown timer expires

```
Given OTP sent at 10:00, expiresAt 10:10
And User on page at 10:00, timer shows "10:00"
And Time passes...

When Timer reaches "00:00" (at 10:10)

Then UI updates:
  • Timer text: "Mã OTP đã hết hạn" (red)
  • Submit button disabled
  • "Gửi lại mã" enabled immediately (no wait)
  • Message: "Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới."
```

## UI/UX Design

### Verify OTP Form

```
┌──────────────────────────────────────────────────┐
│                                                  │
│              🔐 Xác minh OTP                      │
│                                                  │
│  Mã OTP đã được gửi đến m****r@cobi.vn          │
│                                                  │
│  Mã hết hạn sau: ⏱️ 09:45                        │
│                                                  │
│  ──────────────────────────────────────────────  │
│                                                  │
│  Nhập mã OTP:                                    │
│                                                  │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐          │
│  │ 4 │ │ 8 │ │ 2 │ │ 3 │ │ 9 │ │ 1 │          │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘          │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │         Xác minh                           │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Không nhận được mã?                             │
│  <a>Gửi lại sau 60s</a> (disabled, countdown)   │
│                                                  │
│  <a href="/forgot-password">← Quay lại</a>      │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Error State

```
┌──────────────────────────────────────────────────┐
│  ❌ Mã OTP không chính xác. Vui lòng thử lại.    │
├──────────────────────────────────────────────────┤
│  Nhập mã OTP:                                    │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐          │
│  │   │ │   │ │   │ │   │ │   │ │   │ (cleared)│
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘          │
│  (border red)                                    │
│                                                  │
│  Đã thử: 2/5 lần                                 │
└──────────────────────────────────────────────────┘
```

### Timer Expired State

```
┌──────────────────────────────────────────────────┐
│  ⚠️ Mã OTP đã hết hạn                             │
├──────────────────────────────────────────────────┤
│  Mã hết hạn sau: ⏱️ 00:00 (red)                  │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  Xác minh (disabled)                       │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  <button>Gửi lại mã OTP</button> (enabled)       │
└──────────────────────────────────────────────────┘
```

## API Endpoints

```typescript
// Verify OTP
POST /api/auth/verify-otp
Body: {
  email: string;
  otp: string;
}
Response (Success): {
  success: true;
  resetToken: string;
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
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

router.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // 1. Find latest OTP for email
    const otpRecord = await db.passwordResetOTPs.findOne({
      email,
      used: false
    }, {
      sort: { createdAt: -1 } // Latest first
    });
    
    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'OTP_NOT_FOUND',
          message: 'Không tìm thấy yêu cầu đặt lại mật khẩu. Vui lòng thử lại.'
        }
      });
    }
    
    // 2. Check expiry
    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'EXPIRED_OTP',
          message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.'
        }
      });
    }
    
    // 3. Check already used
    if (otpRecord.used) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'OTP_USED',
          message: 'Mã OTP đã được sử dụng. Vui lòng yêu cầu mã mới.'
        }
      });
    }
    
    // 4. Verify OTP
    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
    
    if (!isValid) {
      // Increment attempts
      const attempts = (otpRecord.attempts || 0) + 1;
      await db.passwordResetOTPs.updateOne(
        { _id: otpRecord._id },
        { $set: { attempts } }
      );
      
      // Max attempts check
      if (attempts >= 5) {
        await db.passwordResetOTPs.updateOne(
          { _id: otpRecord._id },
          { $set: { used: true } }
        );
        
        return res.status(400).json({
          success: false,
          error: {
            code: 'MAX_ATTEMPTS',
            message: 'Quá nhiều lần thử sai. Mã OTP đã bị khóa. Vui lòng yêu cầu mã mới.'
          }
        });
      }
      
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_OTP',
          message: 'Mã OTP không chính xác. Vui lòng thử lại.'
        }
      });
    }
    
    // 5. Mark OTP as used
    await db.passwordResetOTPs.updateOne(
      { _id: otpRecord._id },
      { $set: { used: true, usedAt: new Date() } }
    );
    
    // 6. Generate reset token
    const resetToken = jwt.sign(
      {
        email,
        purpose: 'password_reset'
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    // 7. Log success
    await logPasswordResetAttempt(email, 'otp_verified', true, req);
    
    // 8. Response
    return res.json({
      success: true,
      resetToken,
      message: 'OTP verified successfully'
    });
    
  } catch (error) {
    console.error('Verify OTP error:', error);
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
// Component: src/pages/VerifyOTP.tsx
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export function VerifyOTPPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const navigate = useNavigate();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Handle OTP input
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only digits
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take last char
    setOtp(newOtp);
    
    // Auto-focus next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when all filled
    if (newOtp.every(d => d) && index === 5) {
      handleSubmit(newOtp.join(''));
    }
  };
  
  // Handle paste
  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData?.getData('text').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(''));
      handleSubmit(pastedData);
    }
  };
  
  // Submit OTP
  const handleSubmit = async (otpValue: string) => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store reset token and navigate
        sessionStorage.setItem('resetToken', data.resetToken);
        navigate('/reset-password');
      } else {
        setError(data.error.message);
        setOtp(['', '', '', '', '', '']); // Clear inputs
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    }
  };
  
  // Format countdown
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div>
      <h1>Xác minh OTP</h1>
      <p>Mã OTP đã được gửi đến {maskEmail(email)}</p>
      <p>Mã hết hạn sau: {formatTime(countdown)}</p>
      
      {error && <div className="error">{error}</div>}
      
      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onPaste={index === 0 ? handlePaste : undefined}
            autoFocus={index === 0}
          />
        ))}
      </div>
      
      <button onClick={() => handleSubmit(otp.join(''))} disabled={countdown === 0}>
        Xác minh
      </button>
    </div>
  );
}
```

## Dependencies

**Phụ thuộc vào:**
- F-02: Forgot Password (generates OTP)

**Được sử dụng bởi:**
- F-04: Reset Password (next step after verification)

## Out of Scope

**Phase 1 không làm:**
- SMS OTP verification → Phase 2
- Biometric verification → Phase 3

## Testing Checklist

- [ ] Correct OTP verifies successfully
- [ ] Wrong OTP shows error
- [ ] Expired OTP blocked
- [ ] Used OTP blocked
- [ ] Max 5 attempts enforced
- [ ] Paste OTP works
- [ ] Auto-submit on 6th digit
- [ ] Countdown timer accurate
- [ ] Resend OTP works
- [ ] Reset token generated correctly

---

**Version**: 1.0  
**Last Updated**: 16/04/2026  
**Author**: BA Team
