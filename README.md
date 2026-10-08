# Robexa Vietnam - Homepage Demo Clone

Bản clone giao diện trang chủ chính thức của Robexa Vietnam ([robexa.vn](https://robexa.vn/)).

## Cấu trúc dự án
- `index.html`: Cấu trúc HTML5 ngữ nghĩa, phân chia section rõ ràng.
- `css/style.css`: Toàn bộ stylesheet giao diện Robexa và responsive breakpoints.
- `js/main.js`: Mã nguồn tương tác module hóa (Mega menu, Quiz wizard, Scroll reveal, Language selector, v.v.).
- `js/jquery.min.js`: Thư viện jQuery 3.5.1 độc lập.
- `vercel.json`: Cấu hình deploy Vercel tối ưu cache & bảo mật.

## Hướng dẫn Deploy lên Vercel

### Cách 1: Sử dụng Git & GitHub (Khuyên dùng)
1. Tạo một repository mới trên GitHub (ví dụ: `robexa-clone`).
2. Chạy lệnh đẩy code lên GitHub:
   ```bash
   git remote add origin https://github.com/<username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```
3. Truy cập [vercel.com](https://vercel.com/) -> **Add New Project** -> Chọn repository vừa tạo -> Bấm **Deploy**.

### Cách 2: Deploy trực tiếp bằng Vercel CLI
Mở terminal tại thư mục này và chạy:
```bash
npx vercel
```
Làm theo hướng dẫn trên màn hình để deploy ngay lập tức.
