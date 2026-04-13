# mobile-pwa

Ứng dụng mobile PWA chuẩn bị cho Android, dùng CKEditor 5 và tách core logic khỏi extension.

## Tính năng chính
- Luồng kỹ thuật viên: Đăng nhập -> Danh sách tin -> Chi tiết tin -> Sửa tin -> Xem trước -> Lưu -> Quay lại.
- Màn **Sửa tin** theo nhóm mobile-first:
  - Thông tin bài (tiêu đề, kiểm tra tiêu đề, ảnh đại diện, sapo, chapeau).
  - Metadata (chuyên mục, chuyên mục con, tỉnh, từ khóa, audio podcast).
  - Nội dung CKEditor 5 (toolbar gọn cho mobile, giữ ảnh + caption).
- Nút thao tác lớn: Lưu, Xem trước, Quay lại.
- Dùng mock data đầy đủ để mô phỏng CMS hiện tại.

## Cấu trúc
- `src/core`: nghiệp vụ chính (không phụ thuộc UI).
- `src/extensions`: extension cho editor và tiện ích.
- `src/ui`: lớp hiển thị cho kỹ thuật viên mobile.

## Chạy local
```bash
npm install
npm run dev
```

Mặc định app chạy bằng Vite và mở tại địa chỉ được in ra terminal (thường là `http://localhost:5173`).
