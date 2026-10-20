# CHAU_NHI_20_10 — "Một Vũ Trụ Chỉ Có Em" (After Effects Motion Graphics Architecture)

> **Món quà kỷ niệm 20/10/2026** dành riêng cho **Nguyễn Hoàng Châu Nhi** từ **Trần Lê Minh Trung**.
> **Deployment công khai**: [https://miketran99.github.io/chau-nhi-20-10/](https://miketran99.github.io/chau-nhi-20-10/)
> **Kho lưu trữ GitHub**: [https://github.com/mikeTran99/chau-nhi-20-10](https://github.com/mikeTran99/chau-nhi-20-10)

---

## 1. Tổng Quan Kiến Trúc (Architecture Overview)

Dự án được thiết kế theo tư duy **Static Web Motion Graphics chuẩn Awwwards kết hợp Editorial Storytelling & Progressive Enhancement**. Trang web có thể hiển thị toàn bộ nội dung lời chúc, hình ảnh và thư từ một cách tĩnh lặng nếu tắt JavaScript, đồng thời nâng cấp toàn bộ trải nghiệm thành một tác phẩm điện ảnh sống động khi JavaScript hoạt động.

```
chau-nhi-20-10/
├── index.html                 # Cấu trúc nội dung, semantic HTML, SVG filters, inline Motion Graphics
├── styles.css                 # Hệ thống Design Tokens, 2 bảng màu Ghibli & Cosmic, phong thư 3D, responsive
├── app.js                     # Trình quản lý tương tác, Web Audio ASMR, particle engine, dialog controller
├── vendor/                    # Bộ thư viện motion nội bộ chống nghẽn CDN
│   ├── lenis.min.js           # Cuộn mượt quán tính (momentum physics scroll)
│   ├── gsap.min.js            # Engine hoạt hình siêu mượt (GreenSock)
│   └── ScrollTrigger.min.js   # Kích hoạt hoạt hình theo vị trí cuộn trang
├── assets/                    # Media tối ưu hóa thế hệ mới (WebP, MP4)
│   ├── ghibli-emblem-2k.webp  # Logo biểu tượng tình yêu phong cách Ghibli
│   ├── emerald-sky-garden-2k.webp # Phông nền bầu trời khu vườn ngọc bích
│   └── cosmic-rose-universe.mp4   # Video vòng lặp vũ trụ hoa hồng
├── img/                       # 17 bức ảnh kỷ niệm gốc chất lượng cao
│   ├── photo_0.jpg -> photo_16.jpg
│   └── (các ảnh chân dung hero fanned-out)
├── tests/
│   └── site.test.mjs          # Bộ kiểm thử tự động Node.js 100% Pass
└── server.mjs                 # Máy chủ HTTP cục bộ phục vụ dev/preview
```

---

## 2. Hệ Thống Màu Sắc & Ngôn Ngữ Thiết Kế (Dual Theme System)

Website sở hữu **2 bảng màu độc lập hoàn chỉnh**, chuyển đổi mượt mà bằng nút Sticky Header `#theme-toggle` với hiệu ứng sóng lan tỏa (`.theme-transition-ripple`):

### 2.1. Chủ đề Mặc định: Ghibli Healing Meadow & Forest Green (`data-theme="ghibli"`)
Lấy cảm hứng từ bảng màu thiên nhiên tĩnh lặng trong *Howl's Moving Castle* và *My Neighbor Totoro*:
* **Tỷ lệ phối màu 60-30-10 chuẩn Ghibli**:
  * **60% Nền**: Xanh lục bảo rừng già (`#0d241c`, `#14372a`).
  * **30% Khối & Card**: Xanh lá mạ & ngọc bích êm dịu (`#1b4332`, `#2d6a4f`, `#52b788`).
  * **10% Điểm nhấn**: Vàng nắng hoàng hôn (`#f6bd60`, `#b45309`) và trắng kem lụa gạo (`#fdfbf7`, `#fffdfa`).
* **Cảm giác mang lại**: Bình yên, chữa lành, ấm áp và hoài niệm cổ tích.

### 2.2. Chủ đề Thay thế: Cosmic Luxury Obsidian & Midnight Sapphire (`data-theme="cosmic"`)
Phong cách vũ trụ lãng mạn cao cấp dành cho buổi tối:
* **Nền**: Đen thạch anh Obsidian kết hợp xanh đen sâu thẳm (`#060b17`, `#0c1427`).
* **Khối & Card**: Xanh lam ngọc Sapphire (`#10254c`, `#1e3a8a`, `#38bdf8`).
* **Điểm nhấn**: Vàng kim hoàng gia 24K (`#fcd34d`, `#f59e0b`) và ánh bạc ngân hà (`#e0e7ff`).

### 2.3. Hệ thống Typography Không Lỗi Font
* **Khắc phục triệt để lỗi nhảy cách**: Sử dụng font hỗ trợ đầy đủ 100% dấu tiếng Việt:
  * Tiêu đề chính / Đoạn văn: `Quicksand` & `Nunito` (bo tròn dịu dàng, tối ưu tương phản).
  * Chữ viết tay lãng mạn (Phong thư & Lá thư tình): `Caveat` & `Dancing Script`.
  * Fallback an toàn: `Be Vietnam Pro`, `sans-serif`.

---

## 3. Kiến Trúc Phong Thư 3D Chân Thực (Authentic 3D Envelope Physics)

### 3.1. Quy tắc cốt lõi: "Lá thư luôn nằm trong bao thư"
Trong các phiên bản trước, khi mở phong thư lá thư thường bị đẩy lên quá đà (`translateY(-85px)`), khiến đáy lá thư nhảy ra ngoài bao thư tạo cảm giác bay lơ lửng vô lý. Kiến trúc mới giải quyết triệt để vấn đề này bằng mô hình **V-Pouch 5 lớp vật lý**:

```
[Layer 0] Nắp mở xoay 180° ra sau (.opening .envelope-flap) [z-index: 0]
[Layer 1] Lưng bao thư (.envelope-back)                     [z-index: 1]
[Layer 2] Lá thư tình bên trong (.envelope-letter)         [z-index: 2] -> trượt lên 38px
[Layer 3] Túi đựng mặt trước (.envelope-front)             [z-index: 3] -> rãnh V 52% ôm trọn
[Layer 4] Nắp thư khi đóng (.envelope-flap)                [z-index: 4]
[Layer 5] Con dấu sáp niêm phong (.wax-seal)               [z-index: 5]
```

### 3.2. Thông số Hình học & Tính toán Động học
* **Kích thước bao thư**: Rộng `250px`, Cao `165px`.
* **Túi đựng mặt trước (`.envelope-front`)**:
  ```css
  clip-path: polygon(0 0, 0 100%, 100% 100%, 100% 0, 50% 52%);
  ```
  * Cạnh trái `(0, 0) -> (0, 100%)` và cạnh phải `(100%, 0) -> (100%, 100%)` che kín 100% lá thư.
  * Đáy bao thư che kín 100%.
  * Điểm võng chữ V ở tâm nằm tại `y = 52%` (tương đương `85.8px` tính từ đỉnh).
* **Lá thư (`.envelope-letter`)**:
  * Kích thước: Rộng `222px`, Cao `136px`, đặt tại `top: 16px`.
  * Đáy lá thư ở trạng thái đóng: `16 + 136 = 152px`.
  * Khi mở (`.opening`): Lá thư chỉ trượt lên đúng **38px** (`translateY(-38px)`).
  * Đáy lá thư khi mở: `152 - 38 = 114px`.
  * **Chứng minh độ ôm**: Đáy lá thư (`114px`) vẫn **nằm sâu 28.2px** bên dưới điểm rãnh chữ V của túi mặt trước (`85.8px`), và sâu tới **114px** ở hai bên sườn. Lá thư được bao bọc tuyệt đối và không bao giờ tuột khỏi phong bì.
* **Thời gian chuyển cảnh điện ảnh (0.75s Cinematic Pause)**:
  * Khi click, nắp thư mở lật (`0.75s`), lá thư trượt lên (`0.85s` với delay `0.2s`).
  * Trình duyệt cho phép người dùng nhìn thấy lá thư xuất hiện êm ái trong bao thư, trước khi camera 3D kích hoạt luồng sáng vàng kim (`.ae-portal-flash`) và zoom xuyên qua vào không gian chính.

---

## 4. Bộ Hiệu Ứng After Effects Motion Graphics Studio Pack

1. **Lenis Momentum Smooth Scroll**:
   * Chuẩn hóa tốc độ cuộn bánh xe chuột (`smoothWheel: true, wheelMultiplier: 0.9`), loại bỏ hiện tượng giật cục của trình duyệt.
   * Liên kết trực tiếp với GSAP Ticker: `lenis.on("scroll", ScrollTrigger.update)`.
2. **Kinetic Typography & Staggered Headers**:
   * Tất cả thẻ `<h2>` xuất hiện bằng phép xoay trục X (`rotationX: -35deg`), độ nghiêng (`skewY: 3deg`), mở mờ (`blur(6px) -> blur(0px)`).
3. **Màn trập Clip-Path & Parallax Ken Burns (Chương 01 - Ký Ức)**:
   * Khung ảnh mở khẩu độ từ bo góc viên thuốc sang hình chữ nhật nét căng: `clipPath: inset(18% 8% round 24px) -> inset(0)`.
   * Ảnh con bên trong phóng to `scale: 1.22` và cuộn ngược chiều tạo chiều sâu Ken Burns.
4. **Khẩu độ Vòm Video Vũ Trụ Hoa Hồng**:
   * Khối video tự mở rộng khẩu độ vòm bán nguyệt theo tỷ lệ cuộn màn hình (`scrub: 0.8`).
5. **Quán tính Nghiêng Velocity Skew (Chương 02 - 17 Khung Hình)**:
   * Toàn bộ lưới ảnh tự nghiêng nhẹ theo tốc độ cuộn của người dùng (`clamp(-4deg, 4deg)`).
6. **Con trỏ Tinh Tú Từ Tính (`NGẮM GẦN HƠN ✧`)**:
   * Vòng hào quang lerp đi sau chuột, tự động mở rộng viền vàng sang trọng và hiện dòng chữ mời gọi khi chạm vào ảnh.
7. **Lớp phủ Phim Điện Ảnh 35mm (Film Grain)**:
   * Filter SVG `feTurbulence` (fractalNoise tần số `0.8`, `numOctaves: 3`) tạo hạt bụi phim chạy ngẫu nhiên 8 bước (`steps(8)`), làm các ảnh kỷ niệm hòa quyện hoàn hảo với phông nền.
8. **Mở Thư Tình 3D & Nét Ký Tên Tự Động (Chương 03)**:
   * Lá thư lật mở theo chiều sâu không gian (`rotationX: 12deg -> 0deg`).
   * Chữ ký `Minh Trung thương gửi Châu Nhi` tự động chạy đường gạch chân vàng ánh kim khi cuộn tới.

---

## 5. Bộ Tổng Hợp Âm Thanh Ghibli Web Audio API (Zero-MP3 Dependency)

Trang web **không phụ thuộc bất kỳ file nhạc MP3 bên ngoài nào** cho các hiệu ứng tương tác, giúp tốc độ tải tức thì và không bao giờ bị lỗi 404:

### 5.1. Bộ Hợp Âm Chuông Gió Celesta Ghibli (`playGhibliSparkle`)
* Sử dụng mạng lưới `OscillatorNode` dạng sóng `sine` kết hợp `GainNode` suy hao hàm mũ (`exponentialRampToValueAtTime`):
  * **Hợp âm Mở Phong Thư (`Cmaj9` lấp lánh kiểu Joe Hisaishi)**:
    * Tần số: `[523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98] Hz` (C5 - E5 - G5 - B5 - D6 - G6).
    * Mỗi nốt trễ `0.065s` tạo chuỗi arpeggio ngân vang thanh thoát.
  * **Hợp âm Đại Kết Cục Chương 04 (`Fmaj7#11` thiên đường)**:
    * Tần số: `[587.33, 739.99, 880.0, 1108.73, 1318.51, 1760.0, 2093.0] Hz` (D5 - F#5 - A5 - C#6 - E6 - A6 - C7).

### 5.2. Âm thanh Tương tác ASMR Thủ tục
* Tiếng sột soạt mở giấy phong thư: `BiquadFilterNode` lọc dải tần `2200Hz`.
* Tiếng chạm xem ảnh: Lọc dải tần `1300Hz`.

---

## 6. Hệ Thống Hạt Vật Lý Canvas 3D (Particle Physics Engine)

### 6.1. Bụi Sao & Cánh Hoa Trôi Nền (`#universe`)
* Chạy liên tục dưới nền: các vì sao nhấp nháy, bụi phát sáng và cánh hoa thả nhẹ theo trọng lực với lực đẩy từ con trỏ chuột (`mouseRepulsion`).

### 6.2. Pháo Hoa 185 Cánh Hoa Hồng 3D & Bụi Sao Vàng (`#ae-petal-canvas`)
Kích hoạt tại **Chương 04** khi nhấn nút `#hug-button`:
* **Bảng màu hoa 4 sắc độ**: Hồng nhung (`#e63956`), Hồng phấn (`#ff758f`), Đỏ rượu lãng mạn (`#c9184a`), Hồng kem Ghibli (`#ffb5a7`).
* **Vật lý xoay lật 3 chiều**:
  * Mỗi hạt có góc xoay Euler: `rotX`, `rotY`, `rotZ` cùng vận tốc góc `vRotX`, `vRotY`, `vRotZ`.
  * Hình chiếu phối cảnh 3D được mô phỏng trực tiếp trên 2D Canvas bằng:
    ```javascript
    const scaleX = Math.cos(p.rotX) * 0.75 + 0.25;
    const scaleY = Math.sin(p.rotY) * 0.65 + 0.35;
    ctx.scale(scaleX, scaleY);
    ```
* **Đường cong Bezier cánh hoa hồng**: Vẽ tự nhiên với 2 cung Bezier uốn lượn và dải màu xuyên tâm (`radialGradient`).
* **Bụi sao vàng lấp lánh (✧)**: Vẽ ngôi sao 4 cánh đối xứng tỏa sáng hào quang (`shadowBlur: 10`, `shadowColor: #ffd166`).

---

## 7. Dữ Liệu Hình Ảnh Kỷ Niệm (17 Photos Spec)

Tất cả 17 tấm ảnh kỷ niệm tình yêu của Minh Trung và Châu Nhi được lưu giữ nguyên vẹn trong thư mục `img/`, được đánh index từ 0 đến 16:
* `photo_0.jpg` đến `photo_16.jpg`.
* Tích hợp modal phóng to ảnh cao cấp (`#photo-dialog`) với khả năng chuyển tiếp Tiếp theo / Lùi lại bằng phím mũi tên hoặc nút bấm cảm ứng.
* Thẻ hình ảnh hỗ trợ thuộc tính `loading="lazy"` (trừ ảnh Hero `fetchpriority="high"`).

---

## 8. Quy Trình Kiểm Thử Tự Động (Automated Testing)

File kiểm thử [`tests/site.test.mjs`](file:///e:/Projects/TOOLS/20-10/tests/site.test.mjs) được thiết lập để đảm bảo chất lượng vĩnh viễn:
```bash
node --test tests/site.test.mjs
```
* **Test 1**: Xác nhận toàn bộ nội dung tiếng Việt, tên Minh Trung, Châu Nhi, ngày 20.10.2026 và các section ID đều có mặt đầy đủ kể cả khi tắt JS.
* **Test 2**: Xác nhận đủ 17 bức ảnh gốc tồn tại thực tế trên đĩa cứng và được gọi đúng 1 lần duy nhất trong mã nguồn.
* **Test 3**: Xác nhận các ID tương tác bắt buộc và thuộc tính trợ năng ARIA (`open-gift`, `skip-intro`, `sound-toggle`, `motion-toggle`, `photo-dialog`, `hug-button`, `final-message`).

---

## 9. Hướng Dẫn Vận Hành & Triển Khai (Runbook)

* **Chạy môi trường phát triển cục bộ**:
  ```bash
  node server.mjs
  # Mở trình duyệt tại: http://127.0.0.1:2026/
  ```
* **Triển khai tự động (GitHub Pages CI/CD)**:
  * Bất kỳ commit nào đẩy lên nhánh `main` sẽ kích hoạt GitHub Actions workflow `pages-build-deployment`.
  * Lệnh kiểm tra tiến độ build bằng GitHub CLI:
    ```bash
    gh api repos/mikeTran99/chau-nhi-20-10/pages/builds/latest
    ```
  * Kết quả trạng thái hợp lệ: `"status": "built"`.
