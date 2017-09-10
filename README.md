# TMS
Transfer goods
## Requirment
- Thông báo chuyến mới có thời gian Y/C rời bãi
- Đến từng kho có thời gian đến kho, thời gian nhận hàng và nhận xong
- Từng kho có địa chỉ(không bắt buộc) kho và tên kho
- Thời gian giao hàng(thời gian Y/C) thì có thể khác thời gian hiện tại. hiện tại anh insert vào thời gian Y/C
- Từng điểm giao xuất hiện thêm, giao theo kg hoặc theo kiện hoặc khối hoặc giá trị hàng hóa
- Từng điểm giao thêm loại hàng, nhiệt độ bảo quản(để cho tài xế biết chỉnh nhiệt động cho đúng)
- Thu khay có 2 loại, theo chuyến và theo từng điểm
- Thêm field trên trips và tripdetail để biết nếu có thì em show popup thu khay, nếu k thì k cần show lên
- Phần đánh giá của khách hàng không cần hiển thị từng điểm giao. Khi xong chuyến sẽ gửi thông báo cho khách hàng đánh giá, nếu trong 2 tiếng kể từ khi xong chuyến KH không đánh gía gì thì tự động cho 5*
Tài xế không có quyền hủy chuyến( hùy chuyến do nhân viên điều khối làm) tránh thường hợp pending.
Tương tự điểm giao cũng vậy, trong tripDetail em thêm trạng thái hủy điểm giao
Và có thể thêm điểm giao
• Do đó các điểm giao phải đi hết các điểm rồi mới nhấn về bãi,
khi ông tài xế về bãi thực sự mà các điểm vẫn chưa hết,
thì tài xế gọi nhân viên đều phối để hủy rồi mới nhấn nút về bãi được.
