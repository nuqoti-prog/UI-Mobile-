# mobile-pwa

Ứng dụng mobile PWA chuẩn bị cho Android, dùng CKEditor 5 và tách core logic khỏi extension.

## Tính năng chính
- Luồng quản lý tin mobile cho kỹ thuật viên: Đăng nhập -> Danh sách tin -> Chi tiết tin -> Mở editor.
- UI card + nút lớn, dễ thao tác trên màn hình cảm ứng.
- Soạn thảo/format nội dung bằng CKEditor 5 (giữ editor hiện tại để mở rộng bước sau).
- Xử lý ảnh + caption.
- Gợi ý auto keyword.
- Gợi ý auto địa phương.
- Toast thông báo ngắn.
- Đồng bộ trạng thái bài viết.

## Cấu trúc
- `src/core`: nghiệp vụ chính (không phụ thuộc UI).
- `src/extensions`: extension cho editor và tiện ích.
- `src/ui`: lớp hiển thị cho kỹ thuật viên mobile.

## Chạy local
```bash
npm install
npm run dev
```
