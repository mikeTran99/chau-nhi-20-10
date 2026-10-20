# Một vũ trụ, chỉ có em

Bản thiết kế ngày 20/10/2026. Concept đã được Minh Trung duyệt trong cuộc trò chuyện; tài liệu này là bản chi tiết để duyệt trước khi lập kế hoạch và triển khai.

## Mục tiêu

Tạo một trang quà tặng riêng cho Nguyễn Hoàng Châu Nhi, do Trần Lê Minh Trung gửi nhân Ngày Phụ nữ Việt Nam 20/10/2026. Người xem cảm thấy mình được trân trọng qua ảnh thật, lời chúc riêng và những khoảnh khắc bất ngờ. Hiệu ứng phục vụ câu chuyện và phải chạy được trên điện thoại.

Phạm vi là một website tĩnh, một trang, tiếng Việt. Không tài khoản, không cơ sở dữ liệu, không thu thập dữ liệu. Chưa có yêu cầu xuất bản; sản phẩm trước mắt chạy tại máy và có thể đưa lên dịch vụ hosting tĩnh sau.

## Hướng mỹ thuật

- Điện ảnh lãng mạn: đen nhung `#100c10`, giấy ngà `#f8f0e6`, hồng rose `#d99baf`, champagne `#dec49b`.
- Serif thanh lịch cho tiêu đề, sans-serif dễ đọc cho nội dung; font phải có đủ dấu tiếng Việt. Không dùng font chữ viết tay cho đoạn thư dài.
- Bố cục có khoảng thở, ảnh lớn, đường chỉ mảnh, số chương và chi tiết chữ nhỏ. Không biến trang thành một dãy thẻ giao diện.
- Dấu ấn riêng: một đường quỹ đạo nối các chương, như những kỷ niệm cùng tạo nên một vũ trụ; ảnh là những vật thể thực trong không gian ấy.
- Cắt ảnh bằng khung CSS, giữ nguyên tệp gốc. Không làm đẹp khuôn mặt hay tạo thêm ảnh người bằng AI.

## Hành trình

### 1. Phong thư dành cho em

Màn mở đầu hiển thị ngày, dòng “Gửi Nguyễn Hoàng Châu Nhi” và phong thư có dấu trái tim. Nút “Mở món quà của em” có thể bấm bằng chuột, chạm và bàn phím. Không yêu cầu chờ tải giả.

Khi mở: phong thư bung nắp, ánh sáng champagne lan nhẹ, chữ và ảnh xuất hiện nối tiếp. Nội dung chính vẫn truy cập được nếu JavaScript không chạy. Có lựa chọn âm thanh rõ ràng, mặc định tắt.

### 2. Một vũ trụ, chỉ có em

Hero chiếm khoảng một màn hình. Tiêu đề chính “Giữa cả thế giới, anh vẫn chọn em.”, tên “Châu Nhi” nổi bật và dòng “20.10.2026 · Một món quà từ Minh Trung”. Một ảnh đôi lớn, hai ảnh phụ nhỏ hơn tạo chiều sâu, không che khuôn mặt hoặc lời chúc.

Nút chính “Có một điều anh muốn nói” dẫn đến thư. Liên kết phụ “Những khoảnh khắc của mình” dẫn đến album. Có gợi ý cuộn, không có cuộn cưỡng bức hay hiệu ứng giữ người xem trong một chương.

### 3. Những điều bình thường, hóa ra rất quý

Một đoạn dẫn ngắn: “Không cần một ngày thật đặc biệt. Chỉ cần có em, những điều bình thường cũng trở thành điều anh muốn giữ lại.”

Ba ảnh mang sắc thái gần gũi, nụ cười và nắm tay; ảnh chuyển động nhẹ theo cuộn trên máy tính. Chú thích là cảm xúc chung, không gắn ngày, địa điểm hoặc sự kiện chưa được người dùng cung cấp.

### 4. Miền ký ức của chúng mình

Hiển thị đủ 17 ảnh thành album có bố cục so le trên máy tính, hai cột hoặc một cột phù hợp trên điện thoại. Mỗi ảnh là nút mở trình xem ảnh lớn. Trình xem có đóng, trước, sau, số thứ tự; hỗ trợ Escape, phím mũi tên, giữ focus bên trong và trả focus về ảnh đã mở.

Ảnh số 16 và 17 là ảnh ghép nhiều khung: hiển thị đầy đủ, không tự khẳng định đây là một chuyến đi có thật. Tất cả ảnh có thể xem nguyên khung trong trình xem lớn.

### 5. Lá thư chỉ dành cho Nhi

Đổi nền từ tối sang giấy ngà, giảm mật độ chuyển động để người xem tập trung đọc. Thư hiện theo đoạn khi cuộn; không buộc chờ từng ký tự.

Nội dung dự kiến:

> Châu Nhi của anh,
>
> Có những điều anh không phải lúc nào cũng nói thật khéo. Nhưng hôm nay, anh muốn em biết rằng: có em trong cuộc đời là một điều anh luôn trân trọng.
>
> Cảm ơn em vì những nụ cười, những lần ở cạnh nhau, và cả những khoảnh khắc rất bình thường mà khi nhìn lại, anh chỉ muốn giữ mãi.
>
> Ngày 20/10, anh chúc em luôn khỏe mạnh, bình an, được làm điều mình thích và được yêu thương theo cách khiến em thấy hạnh phúc. Mong em luôn giữ được ánh sáng của riêng mình, và luôn biết rằng em xứng đáng với những điều dịu dàng nhất.
>
> Anh không chỉ muốn chúc em vui trong hôm nay. Anh muốn cùng em góp nhặt thêm thật nhiều ngày vui ở phía trước — bằng sự quan tâm, lắng nghe và những điều nhỏ bé mỗi ngày.
>
> Chúc mừng Ngày Phụ nữ Việt Nam, cô gái anh thương.
>
> Thương em,
> Trần Lê Minh Trung

Đây là lời chúc được soạn cho món quà, không phải trích dẫn lời nói hoặc sự kiện đã được xác nhận.

### 6. Điều ước cuối trang

Quay lại bầu trời tối, ảnh nắm tay làm điểm nhấn. Câu “Nếu được chọn lại, anh vẫn muốn gặp em.” và nút trái tim “Nhận một cái ôm từ anh”.

Khi bấm: một đợt hạt sáng và trái tim nở ra, hiện “Hôm nay, ngày mai, và những ngày sau nữa. Anh thương em, Châu Nhi.” Có thể bấm lại; không sinh vô hạn phần tử hoặc chồng âm thanh. Chân trang ghi “Dành riêng cho Nguyễn Hoàng Châu Nhi · 20.10.2026”.

## Sử dụng ảnh

Đánh số theo thứ tự tên tệp tăng dần trong `img`, từ 01 đến 17, đúng bảng ảnh đã kiểm tra. Không đổi tên hoặc ghi đè ảnh gốc.

- Hero: ảnh 10 làm ảnh chính, ảnh 03 và 14 làm ảnh phụ.
- Phần ký ức dẫn nhập: ảnh 02, 12 và 13.
- Album: đủ ảnh 01–17; nhãn mô tả trung tính, không gán danh tính từng người chưa được xác nhận riêng.
- Kết trang: ảnh 13 (nắm tay).
- Hero tải ưu tiên; ảnh dưới màn hình tải trễ và khai báo kích thước để tránh giật bố cục.

## Chuyển động và âm thanh

- Dùng CSS, Web Animations API và một canvas nền; không thêm thư viện chỉ để tạo hiệu ứng có sẵn trong trình duyệt.
- Hạt sao chậm, quầng sáng, quỹ đạo và cánh hoa thưa tạo không khí; con trỏ tạo độ sâu nhỏ trên máy có chuột, không làm ảnh lệch khỏi vùng đọc.
- Reveal khi cuộn qua IntersectionObserver; chuyển cảnh theo opacity và transform, hạn chế thuộc tính gây tính lại bố cục.
- Trình xem ảnh chuyển cảnh ngắn; phong thư mở một lần mỗi lần tải trang. Pháo hoa chỉ chạy sau tương tác.
- Tôn trọng `prefers-reduced-motion`, có nút giảm/bật hiệu ứng rõ nhãn. Không nhấp nháy nhanh. Mọi nội dung vẫn hiện khi giảm chuyển động.
- Dừng canvas, hoạt ảnh lặp và âm thanh khi tab bị ẩn; tiếp tục phần hình theo trạng thái người xem khi trở lại. Âm thanh cần người xem bật lại nếu đã dừng.
- Âm thanh là giai điệu ambient ngắn tự tạo bằng Web Audio, không cần tệp nhạc ngoài, không tự phát khi mở trang. Nút bật/tắt cập nhật nhãn và trạng thái truy cập; nếu thiết bị không hỗ trợ thì thông báo nhẹ và trang vẫn hoạt động.

## Kỹ thuật và phạm vi thay đổi

Thư mục hiện chỉ có `img`, không có code, callers, tests, exports hoặc cấu hình ứng dụng cần giữ tương thích. Không có Git repository để commit tài liệu tại thời điểm khảo sát.

Sản phẩm gồm `index.html`, `styles.css`, `app.js`, hướng dẫn chạy và một bài kiểm tra nhỏ. Chỉ thêm server cục bộ bằng thư viện chuẩn nếu việc xem và kiểm thử cần HTTP. Không backend, không framework, không dependency runtime bên ngoài. Nội dung và ảnh dùng đường dẫn tương đối để dễ hosting tĩnh.

Không có form gửi dữ liệu, analytics, upload hoặc yêu cầu mạng bên thứ ba. Không công khai ảnh trong bước triển khai cục bộ. Khi cần xuất bản phải dùng một tác vụ có địa chỉ hosting cụ thể để người dùng biết ảnh sẽ nằm ở đâu.

## Kiểm tra chấp nhận

1. Đúng họ tên, dấu tiếng Việt, ngày 20/10/2026 và tên Ngày Phụ nữ Việt Nam.
2. Mở thư, điều hướng chương, bật/tắt âm thanh, giảm hiệu ứng, mở/đóng/chuyển ảnh và bất ngờ cuối đều hoạt động.
3. Cả 17 ảnh tải được; không crop mất mặt ở khung chính; xem được ảnh nguyên khung trong album.
4. Kiểm tra trình duyệt ở khoảng 390px, 768px và 1440px; không cuộn ngang ngoài ý muốn hoặc chữ đè lên ảnh và nút.
5. Kiểm tra bằng bàn phím, focus trong trình xem, reduced motion và tab ẩn.
6. Không có lỗi JavaScript hoặc tài nguyên 404; có một test/assert nhỏ kiểm tra danh sách ảnh và các thành phần bắt buộc.
7. Chụp và xem lại bản máy tính cùng bản điện thoại; chỉ tuyên bố đã kiểm thử những môi trường thực sự chạy được.

## Tự rà soát

Không có phần chờ điền; nội dung thư, cách dùng ảnh, thứ tự chương và hành vi tương tác đã xác định. Không hứa hiệu ứng 3D nặng hoặc mọi kỹ thuật motion cùng lúc: chọn bộ hiệu ứng nhất quán đủ tạo trải nghiệm điện ảnh và giữ điện thoại sử dụng được. Thiết bị thật và hosting công khai nằm ngoài kiểm chứng cục bộ.
