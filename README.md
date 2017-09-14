# TMS
Transfer goods
# Requirment
## Phase 1
1. Tiếp nhận thông tin giao hàng
 - Thông tin giao hàng gồm những thông tin:
   + Địa điểm nhận
   + Địa điểm giao
   + Nhập số lượng hàng.
2. Xác nhận việc chấp thuận giao hàng
 - Khi có thông tin giao hàng dc gửi đến: Thông tin này sẽ được gửi theo nhu sau:
  + Sẽ gửi theo ưu tiên của tài xế nhưng dựa vào các thông số: 
    Tình trạng xe, 
	tài xế đang rảnh, 
	thâm niên làm việc, 
	hạng bằng lái, 
	quen cung đường, 
	quen hàng hóa & khách hàng, performance tốt.
   => Vậy chỗ này thì điều hành bên anh sẽ gửi lệnh điều phối(Được luu vào DB), Bên em sẽ kiểm tra trong DB để biết và send đến tài xế tương
   ứng. Chỗ này anh có thể cho em biết 1 dấu hiệu nào đó thay đổi trong DB để em nhận biết và gửi lệnh đến tài xế tương ứng.
      
3. Theo dõi và xử lý trong quá trình giao hàng: 
   Thông tin chuyến giao, điểm giao, 
   thời gian đi/đến, scan/chụp hình ảnh chứng từ đính kèm, 
   tọa độ/vị trí địa lý/hình ảnh chụp lân cận đính kèm, 
   các điểm đi qua trạm thu phí, nhập số lượng các khay/kệ/rổ giao-nhận, yêu cầu thêm hình ảnh đính kèm chứng từ sau khi scan/chụp có tên file = mã của chuyến giao + ID tăng dần
   => Khi hàng được giao thì cần phải chụp ảnh chứng từ đính kèm, thông tin sẽ dc gửi về server: 
   Hình ảnh(Chứng từ -> sẽ gửi về 1 hình ảnh chứng từ, chọn 1 hoặc nhiều hình), 
   vị trí tọa độ hiện tại, ghi nhận thoi gian đi/đến (Lấy time tu server).
   => Thông tin INPUT về chuyến thì bên anh sẽ nhập vào hay sao anh? Bên em dựa vào dữ liệu trong DB để tổng hợp lấy lên cho tài xế
 
4. Đánh giá dịch vụ giao hàng từ khách hàng. 
   Chức năng này anh chọn 1 cách để thực hiện luôn anh.
5. Báo cáo: 
 - Theo dõi tình trạng đơn hàng. (Đang vẫn chuyển, chưa được chuyển, Hoàn thành)
 - Danh sách giao nhận, hủy chuyến
 - Income của người giao hàng: Hiện thị $ mà delivery này nhận dc
 - Đánh giá của khách hàng: dựa theo *, 1*, 2*, 3* đến 5*
 - Comment/Complaint của KH
 - tổng kết chuyến giao, 
  số chuyến giao của Tài xế trong ngày/tháng/năm + báo cáo tạm tính thu nhập (theo số liệu và công thức chuẩn)
## Phase 2
Them moi
0. Thêm nut rời bãi
1. Bắt đâu chuyen giao nhap KM
2. Ket thuc chuyen giao nhap KM
3. Nut ve bãi nhap KM cuối cùng
4. Man hinh report
1 Nút hien đầu tiên và 1 nut hien cuối cùng
Chỉnh sửa trạng thái

===08/07/2017====
1. Hôm nay bên giao nhận đề xuất bỏ chỗ nhập km chỗ bắt đầu rời bãi vì: Số km bắt đầu rời bãi = Số km về bãi của chuyến gần nhất -> DONE
2. Ngoài ra khi xe đến điểm NHẬN HÀNG của khách hang thì chỉ cần bấm nút xác nhận đến + ghi thời gian & vị trí điểm đến lại mà ko phải nhập số km trên đồng hồ nữa. -> DONE
3. Phần gửi đánh giá giao nhận xong em vẫn chưa cho hiện thông báo: GIAO HÀNG THÀNH CÔNG và sau đó là quay về màn hình HOME -> Done
4. Ngoài ra có 1 số lý do khi đang đi giao hàng hoặc nhận đơn rồi mà nhân viên giao nhận muốn từ chối chuyến 
(có việc đột xuất, đau bệnh) 
hoặc muốn gửi thông báo đột xuất trong quá trình giao nhận tại các điểm/chuyến như: Tai nạn, Kẹt xe, Thời tiết, ... 
thì cần có thêm nút tương tác và nhập các sự cố này
5.  Tạo bảng messenger bên em để A Luận đẩy nội dung cho tài xế nhận được thông báo, cụ thể cần có các field như sau:
- Người nhận thông báo
- Số ĐT người nhận thông báo
- Nội dung thông báo
- Ngày / giờ nhận thông báo
- Người gửi thông báo
## Phase 2
- Thông báo chuyến mới có thời gian Y/C rời bãi
- Đến từng kho có thời gian đến kho, thời gian nhận hàng và nhận xong
- Từng kho có địa chỉ(không bắt buộc) kho và tên kho. Hiện thị nhiều kho để tài xế chọn khi đến kho. Bắt buộc nhận hàng hết các kho trước thực hiện bước kế tiếp
- Thời gian giao hàng(thời gian Y/C) thì có thể khác thời gian hiện tại. hiện tại anh insert vào thời gian Y/C
- Từng điểm giao xuất hiện thêm, giao theo kg hoặc theo kiện hoặc khối hoặc giá trị hàng hóa
- Từng điểm giao thêm loại hàng, nhiệt độ bảo quản(để cho tài xế biết chỉnh nhiệt động cho đúng)
- Thu khay có 2 loại, theo chuyến và theo từng điểm
- Thêm field trên trips và tripdetail để biết nếu có thì em show popup thu khay, nếu k thì k cần show lên
Phần đánh giá của khách hàng không cần hiển thị từng điểm giao. Khi xong chuyến sẽ gửi thông báo cho khách hàng đánh giá, nếu trong 2 tiếng kể từ khi xong chuyến KH không đánh gía gì thì tự động cho 5*
Tài xế không có quyền hủy chuyến( hùy chuyến do nhân viên điều khối làm) tránh thường hợp pending.
Tương tự điểm giao cũng vậy, trong tripDetail em thêm trạng thái hủy điểm giao
Và có thể thêm điểm giao
• Do đó các điểm giao phải đi hết các điểm rồi mới nhấn về bãi,
khi ông tài xế về bãi thực sự mà các điểm vẫn chưa hết,
thì tài xế gọi nhân viên đều phối để hủy rồi mới nhấn nút về bãi được.
