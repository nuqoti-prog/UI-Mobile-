# Local npm setup (CKEditor 5)

Đã chuyển dependency CKEditor sang gói public:

- `@ckeditor/ckeditor5-build-classic`

## Vì sao sửa lỗi 403

Lỗi 403 thường xảy ra khi dùng package private/premium hoặc registry không có quyền truy cập.
Bản cấu hình hiện tại chỉ dùng package public từ npm registry.

## Cài local

```bash
npm install
npm run install:check
```

Nếu công ty dùng private proxy registry, cấu hình lại registry trước khi cài:

```bash
npm config set registry https://registry.npmjs.org/
npm config set @ckeditor:registry https://registry.npmjs.org/
```
