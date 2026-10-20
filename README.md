# Một vũ trụ, chỉ có em

Món quà Ngày Phụ nữ Việt Nam 20/10/2026 dành cho Nguyễn Hoàng Châu Nhi, từ Trần Lê Minh Trung.

## Xem demo

Yêu cầu Node.js 20 trở lên. Không cần cài thư viện.

```powershell
node server.mjs
```

Mở <http://127.0.0.1:2026>. Server chỉ lắng nghe trên máy này. Dừng bằng Ctrl+C. Có thể mở `index.html` trực tiếp; chạy qua server cho việc phát video và kiểm tra đáng tin cậy hơn.

## Nội dung và tài nguyên

- `index.html`: lời chúc, thư và đủ 17 ảnh gốc trong `img/`.
- `styles.css`: màu sắc, bố cục, hiệu ứng và giao diện điện thoại.
- `app.js`: phong thư, album, âm thanh, bầu trời và bất ngờ cuối.
- `assets/`: nền, biểu tượng và video tạo qua API G-Labs theo yêu cầu người dùng.
- `docs/assets/generation.json`: prompt và mã tác vụ tạo tài nguyên; không có API key.

Âm thanh mặc định tắt, chỉ bật sau khi người xem chủ động chọn. Nhạc ambient và tiếng ASMR giấy/chạm/nhịp tim được tổng hợp bằng Web Audio, không dùng bản ghi âm bên ngoài. Có thể tắt bất cứ lúc nào. Khi tab bị ẩn, âm thanh dừng và cần bật lại.

Chế độ giảm chuyển động của thiết bị luôn được ưu tiên; nút ngôi sao trên trang cho phép giảm hiệu ứng. Video chỉ phát khi nằm trong vùng nhìn và được dừng khi ra khỏi vùng nhìn hoặc tab bị ẩn.

## Kiểm tra

```powershell
node --test
node --check app.js
```

Các bài kiểm tra xác nhận nội dung, ảnh, controls, ranh giới truy cập file của server và video byte ranges. Kết quả kiểm tra trình duyệt thực tế được lưu riêng trong `docs/verification.md` khi hoàn tất.

## Trạng thái xuất bản

Demo cục bộ để duyệt trước. Chưa push GitHub hoặc công khai ảnh. Khi hosting tĩnh, chỉ cần `index.html`, `styles.css`, `app.js`, `assets/` và `img/`; không đưa thông tin xác thực vào website.
