# Flow: Đặt chỗ không cần duyệt (Booking No Approval)

## Mô tả
Quy trình đặt chỗ cho Hot Desk, Meeting Room, Training Room, Event Room. Không có bước duyệt, chỉ gồm 2 bước: tạo booking và thanh toán. Sau khi thanh toán thành công, hệ thống tự động hoàn thành booking và giữ chỗ cho khách hàng.

## Flowchart

```mermaid
flowchart TD
    A[Quản lý vào trang Đặt chỗ] --> B[Chọn khách hàng (mới hoặc đã lưu)]
    B --> C[Chọn ngày, giờ bắt đầu/kết thúc]
    C --> D[Chọn tòa nhà → tầng → không gian]
    D --> E{Kiểm tra lịch trùng}
    E -- Trùng lịch --> F[Lỗi: Không gian đã được đặt]
    E -- Không trùng --> G[Chọn dịch vụ sử dụng thêm]
    G --> H[Áp dụng ưu đãi/giảm giá]
    H --> I[Chọn phương thức thanh toán]
    I --> J[Thanh toán]
    J --> K{Thanh toán thành công?}
    K -- Không --> L[Hủy booking]
    K -- Có --> M[Hệ thống tạo booking, set chỗ cho khách]
    M --> N[Hoàn thành quy trình]
```

## Các bước chi tiết
1. Quản lý vào trang Đặt chỗ.
2. Chọn khách hàng (mới hoặc đã lưu trong danh sách).
3. Chọn ngày, giờ bắt đầu/kết thúc.
4. Chọn tòa nhà → tầng → không gian.
5. Hệ thống kiểm tra lịch trùng:
   - Nếu trùng: Báo lỗi, không cho đặt.
   - Nếu không trùng: Tiếp tục.
6. Chọn dịch vụ sử dụng thêm (nếu có).
7. Áp dụng ưu đãi/giảm giá (nếu có).
8. Chọn phương thức thanh toán và tiến hành thanh toán.
9. Nếu thanh toán thành công: Hệ thống tự động hoàn thành booking và set chỗ cho khách.
10. Nếu thanh toán thất bại: Hủy booking.

## Lưu ý
- Không có bước duyệt/approval.
- Không hỗ trợ recurring booking (để Phase 2).
- Áp dụng cho quản lý/staff thao tác trên admin dashboard.
- Có thể mở rộng cho customer portal (tự đặt, tự thanh toán).
