MỤC LỤC

[1.	Mô tả bài toán	1](#_toc196727497)

[1.1 Hoạt động và Yêu cầu chức năng Company	2](#_toc196727498)

[1.2  Hoạt động và Yêu cầu chức năng Leader Team	2](#_toc196727499)

[1.3 Hoạt động và Yêu cầu chức năng Member	3](#_toc196727500)

[2.	Sơ đồ Use Case	4](#_toc196727501)

[2.1 Mô tả sơ đồ use case	4](#_toc196727502)

[2.1.1 Đăng nhập	4](#_toc196727503)

[2.1.2 Quản lý Leader và Member	5](#_toc196727504)

[2.1.3 Giao việc cho Team	5](#_toc196727505)

[2.1.4 Xem báo cao dự án từ Team	6](#_toc196727506)

[2.1.5 Theo dõi tiến dộ báo cáo từ dự án	6](#_toc196727507)

[2.1.6 Nhận thông báo khi Team không báo cáo	7](#_toc196727508)

[2.1.8 Theo dõi tiến độ task	8](#_toc196727509)

[2.1.9 Báo cáo tiến độ cho company	8](#_toc196727510)

[2.1.10 Nhận thông báo từ hệ thống	9](#_toc196727511)

[2.1.11 Xem phản hồi từ company	9](#_toc196727512)

[2.1.12 Nhận và thự hiện task	10](#_toc196727513)

[2.1.13 Gửi báo cáo task	10](#_toc196727514)

[2.1.14 Xem phản hồi từ Leader	11](#_toc196727515)

[3.	Mô hình lớp	12](#_toc196727516)



1. ## <a name="_toc196727136"></a><a name="_toc196727199"></a><a name="_toc196727237"></a><a name="_toc196727248"></a><a name="_toc196727411"></a><a name="_toc196727497"></a>Mô tả bài toán
` `Công ty (Company): Công ty có thể có nhiều Team khác nhau. Mỗi một sẽ Team đảm nhận một nhiệm vụ, dự án hoặc chức năng riêng biệt.

Team: Mỗi Team trong công ty có thể có nhiều thành viên (Members), và mỗi Team sẽ có một Leader. Các Team có thể chia sẻ nhiệm vụ hoặc phối hợp với nhau.

Member: Một thành viên có thể tham gia nhiều Team trong công ty. Một thành viên sẽ đảm nhận các nhiệm vụ khác nhau ở các Team khác nhau.
### `      `<a name="_toc196727137"></a><a name="_toc196727200"></a><a name="_toc196727238"></a><a name="_toc196727249"></a><a name="_toc196727412"></a><a name="_toc196727498"></a>1.1 Hoạt động và Yêu cầu chức năng Company
- Đăng nhập
- Tạo và quản lý Member và Leader
  - Thêm, sửa xóa, xem thông tin chi tiết của nhân viên
  - Gán nhân viên vào cho Team
- Giao dự án cho Team
  - Tạo dự án mới
  - Phân công dự án cho từng Team
  - Đặt thời hạn hoàn thành cho dự án đã giao đóđó
- Theo dõi tiến độ và trạng thái của dự án
  - Xem danh sách dự án theo từng Team
  - Kiểm tra trạng thái và mức độ hoàn thành
- Xem báo cáo dự án từ Team	
  - Xem nội dung báo cáo từ Team
  - Đánh giá hiệu quả làm việc 
- Nhận thông báo khi Team không gửi báo cáo
  - Hệ thống sẽ kiểm tra tấn suất gửi báo cáo 
  - Nếu quá hạn Company không nhận được báo cáo từ Team, hệ thống sẽ gửi thông báo cho company kịp thời để theo dõi và xử lý
### <a name="_toc196727138"></a><a name="_toc196727201"></a><a name="_toc196727239"></a><a name="_toc196727250"></a><a name="_toc196727413"></a><a name="_toc196727499"></a>1.2  Hoạt động và Yêu cầu chức năng Leader Team
- Đăng nhập
- Quản lý task trong dự án
  - Tạo nhiệm vụ trong dự án
  - Gán task cho Member
  - Đặt deadline cho task
- Theo dõi tiến độ task
  - Xem tiến độ và trạng thái làm việc
- Báo cáo tiến độ cho company
  - Tổng hợp báo cáo
  - Gửi báo cáo lên company
- Nhận thông báo từ hệ thống
  - Khi bị trễ deadline
  - Khi công ty gửi phản hồi báo cáo
- Xem phản hồi từ company
### ` `<a name="_toc196727139"></a><a name="_toc196727202"></a><a name="_toc196727240"></a><a name="_toc196727251"></a><a name="_toc196727414"></a><a name="_toc196727500"></a>1.3 Hoạt động và Yêu cầu chức năng Member
- Đăng nhập
- Nhận và thực hiện nhiệm vụ
  - Xem task được giao
  - Cập nhật tiến độ task
- Gửi báo cáo công việc
  - Ghi lại những việc đã làm, tiến độ, khó khan
  - Gửi báo cáo cho Leader xem 
- Xem phản hồi từ quản lý (nếu có )
  - Xem các nhận xét, đánh giá từ Leader
- Nhận thông báo từ hệ thống
  - Khi bị trễ deadline
  - Khi được gán task 
1. ## <a name="_toc196727140"></a><a name="_toc196727203"></a><a name="_toc196727241"></a><a name="_toc196727252"></a><a name="_toc196727415"></a><a name="_toc196727501"></a>Sơ đồ Use Case
![Mô tả ảnh](https://github.com/TrungNguyen0304/du-anBE/blob/main/images/95475795-0775-424b-9ed3-cc949712ea6f.jpg)
### <a name="_toc196727141"></a><a name="_toc196727204"></a><a name="_toc196727242"></a><a name="_toc196727253"></a><a name="_toc196727416"></a><a name="_toc196727502"></a>2.1 Mô tả sơ đồ use case
#### <a name="_toc196727205"></a><a name="_toc196727254"></a><a name="_toc196727417"></a><a name="_toc196727503"></a>*2.1.1 Đăng nhập*
- Tác nhân chính: company, Leader, Member
- Điều kiện tiên quyết:
  - Người dùng đã có tài khoản trong hệ thống.
  - Truy cập vào giao diện đăng nhập của hệ thống.
- Luồng sự kiện chính:
  - Người dùng truy cập hệ thống và chọn chức năng "Đăng nhập".
  - Nhập thông tin tài khoản (email và mật khẩu).
  - Nhấn nút "Đăng nhập".
  - Hệ thống xác thực thông tin người dùng.
- Kết quả mong đợi:
  - Người dùng đăng nhập thành công và được chuyển đến giao diện tương ứng với vai trò.
- Luồng sự kiện thay thế:
  - Nếu thông tin đăng nhập không hợp lệ:
    - Hệ thống thông báo lỗi và yêu cầu nhập lại.
#### <a name="_toc196727206"></a><a name="_toc196727255"></a><a name="_toc196727418"></a><a name="_toc196727504"></a>*2.1.2 Quản lý Leader và Member* 
- Tác nhân chính: company
- Điều kiện tiên quyết:
  - Người dùng đã đăng nhập hệ thống với quyền company.
- Luồng sự kiện chính: 
  - Truy cập chức năng "Quản lý Member và Leader".
  - Thực hiện tạo mới, chỉnh sửa hoặc xóa thành viên.
  - Nhập thông tin (họ tên, email, vai trò) và lưu thay đổi.
- Kết quả mong đợi:
  - Thành viên được tạo mới hoặc cập nhật thành công.
- Luồng sự kiện thay thế:
  - Nếu nhập thiếu thông tin hoặc email trùng:
    - Hệ thống thông báo lỗi và yêu cầu chỉnh sửa.
#### <a name="_toc196727207"></a><a name="_toc196727256"></a><a name="_toc196727419"></a><a name="_toc196727505"></a>*2.1.3 Giao việc cho Team*
- Tác nhân chính: company
- Điều kiện tiên quyết:
  - company đã đăng nhập vào hệ thống.
  - Đã có Team và Member trong hệ thống.
- Luồng sự kiện chính:
  - Truy cập chức năng "Giao việc cho Team".
  - Chọn Team, chọn thành viên và mô tả công việc.
  - Xác định deadline và lưu nhiệm vụ.
- Kết quả mong đợi:
  - Công việc được giao thành công cho thành viên.
- Luồng sự kiện thay thế:
  - Nếu thiếu thông tin (Team, thành viên, mô tả, deadline):
    - Hệ thống thông báo lỗi và yêu cầu bổ sung.
#### <a name="_toc196727208"></a><a name="_toc196727257"></a><a name="_toc196727420"></a><a name="_toc196727506"></a>*2.1.4 Xem báo cao dự án từ Team*
- Tác nhân chính: company
- Điều kiện tiên quyết:
  - company đã đăng nhập vào hệ thống.
  - Team đã gửi báo cáo tiến độ dự án.
- Luồng sự kiện chính:
  - Truy cập chức năng "Xem báo cáo dự án".
  - Chọn dự án cần xem.
  - Xem chi tiết tiến độ, các báo cáo công việc từ Team.
- Kết quả mong đợi:
  - company nắm được tình hình thực hiện dự án.
- Luồng sự kiện thay thế:
  - Nếu chưa có báo cáo:
    - Hệ thống hiển thị thông báo "Chưa có báo cáo từ Team".
#### ` 	`*<a name="_toc196727209"></a><a name="_toc196727258"></a><a name="_toc196727421"></a><a name="_toc196727507"></a>2.1.5 Theo dõi tiến dộ báo cáo từ dự án* 
- Tác nhân chính: company
- Điều kiện tiên quyết:
  - company đã đăng nhập vào hệ thống.
  - Các Team đang thực hiện và cập nhật báo cáo dự án.
- Luồng sự kiện chính:
  - Truy cập chức năng "Theo dõi tiến độ báo cáo".
  - Chọn dự án cần theo dõi.
- Kết quả mong đợi:
  - company nắm bắt kịp thời tiến độ thực hiện của dự án.
- Luồng sự kiện thay thế:
  - Nếu dự án không có cập nhật mới:
    - Hệ thống hiển thị thông báo "Chưa có báo cáo mới".
#### <a name="_toc196727210"></a><a name="_toc196727259"></a><a name="_toc196727422"></a><a name="_toc196727508"></a>*2.1.6 Nhận thông báo khi Team không báo cáo*
- Tác nhân chính: company
- Điều kiện tiên quyết:
  - ` `Admin đã đăng nhập hệ thống.
  - Đã thiết lập deadline báo cáo cho Team.
- Luồng sự kiện chính:
  - Hệ thống tự động kiểm tra trạng thái báo cáo theo deadline.
  - Nếu quá hạn mà chưa có báo cáo, hệ thống gửi thông báo tới Admin.
- Kết quả mong đợi:
  - Admin nhận được thông báo kịp thời để xử lý.
- Luồng sự kiện thay thế:
  - Nếu hệ thống gặp lỗi khi gửi thông báo:
    - Ghi log lỗi và thử gửi lại sau.
##### 2\.1.7 Quản lý task trong dự án
- Tác nhân chính: Leader
- Điều kiện tiên quyết:
  - Leader đã đăng nhập hệ thống.
  - Được phân quyền quản lý dự án.
- Luồng sự kiện chính:
  - Truy cập chức năng "Quản lý task".
  - Tạo mới, phân công, chỉnh sửa hoặc cập nhật trạng thái task cho Member.
  - Theo dõi tiến độ thực hiện các task.
- Kết quả mong đợi:
  - Công việc trong dự án được quản lý chặt chẽ, cập nhật đúng tiến độ.
- Luồng sự kiện thay thế:
  - Nếu thiếu thông tin khi tạo hoặc chỉnh sửa task:
    - Hệ thống thông báo lỗi và yêu cầu bổ sung.
#### <a name="_toc196727211"></a><a name="_toc196727260"></a><a name="_toc196727423"></a><a name="_toc196727509"></a>*2.1.8 Theo dõi tiến độ task*
- Tác nhân chính: Leader
- Điều kiện tiên quyết:
  - Leader đã đăng nhập hệ thống.
  - Các task đã được tạo và phân công.
- Luồng sự kiện chính:
  - Truy cập chức năng "Theo dõi tiến độ task".
  - Xem trạng thái từng task: Đang thực hiện, Hoàn thành, Trễ hạn.
  - Cập nhật hoặc điều chỉnh phân công nếu cần.
- Kết quả mong đợi:
  - Leader nắm rõ tiến độ công việc của Team.
- Luồng sự kiện thay thế:
  - Nếu task chưa được cập nhật tiến độ:
    - Hệ thống hiển thị cảnh báo hoặc yêu cầu cập nhật.
#### <a name="_toc196727212"></a><a name="_toc196727261"></a><a name="_toc196727424"></a><a name="_toc196727510"></a>*2.1.9 Báo cáo tiến độ cho company*
- Tác nhân chính: Leader
- Điều kiện tiên quyết:
  - Leader đã đăng nhập hệ thống.
  - Các task đã được cập nhật tiến độ.
- Luồng sự kiện chính:
  - Leader truy cập chức năng "Báo cáo tiến độ".
  - Hệ thống tổng hợp tiến độ các task.
  - Leader kiểm tra và gửi báo cáo cho công ty.
- Kết quả mong đợi:
  - Công ty nắm được tiến độ chung.
  - Vấn đề được phát hiện sớm nếu có.
- Luồng sự kiện thay thế:
  - Nếu thiếu dữ liệu, hệ thống yêu cầu Leader cập nhật trước khi gửi.
#### ` 	`*<a name="_toc196727213"></a><a name="_toc196727262"></a><a name="_toc196727425"></a><a name="_toc196727511"></a>2.1.10 Nhận thông báo từ hệ thống*
- Tác nhân chính: Leader, Member
- Điều kiện tiên quyết:
  - Đã đăng nhập vào hệ thống.
- Luồng sự kiện chính:
  - Hệ thống gửi thông báo khi có sự kiện liên quan:
    - Được giao task mới.
    - Cập nhật deadline.
    - Task sắp đến hạn hoặc bị trễ hạn.
    - Yêu cầu cập nhật tiến độ.
- Kết quả mong đợi:
  - Người dùng nắm bắt kịp thời các thay đổi công việc.
- Luồng sự kiện thay thế:
  - Nếu người dùng không phản hồi sau một thời gian, hệ thống có thể nhắc lại tự động.
#### <a name="_toc196727214"></a><a name="_toc196727263"></a><a name="_toc196727426"></a><a name="_toc196727512"></a>*2.1.11 Xem phản hồi từ company*
- Tác nhân chính: Leader
- Điều kiện tiên quyết:
  - Leader đã gửi báo cáo tiến độ.
  - Company đã phản hồi qua hệ thống.
- Luồng sự kiện chính:
  - Leader truy cập mục "Phản hồi từ Company".
  - Hệ thống hiển thị các phản hồi liên quan đến báo cáo đã gửi:
    - Nhận xét tiến độ.
    - Yêu cầu bổ sung hoặc điều chỉnh.
- Kết quả mong đợi:
  - Leader nắm được yêu cầu hoặc đánh giá từ company để điều chỉnh công việc.
- Luồng sự kiện thay thế:
  - Nếu chưa có phản hồi, hệ thống hiển thị thông báo "Chưa có phản hồi".
#### <a name="_toc196727215"></a><a name="_toc196727264"></a><a name="_toc196727427"></a><a name="_toc196727513"></a>*2.1.12 Nhận và thự hiện task*
- Tác nhân chính: Member
- Điều kiện tiên quyết:
  - Member đã đăng nhập vào hệ thống.
  - Member đã đăng nhập vào hệ thống.
- Luồng sự kiện chính:
  - Member đã đăng nhập vào hệ thống.
  - Truy cập danh sách task để xem chi tiết: nội dung, deadline, yêu cầu.
  - Thực hiện task theo đúng hướng dẫn và tiến độ.
- Kết quả mong đợi:
  - Member hoàn thành task đúng hạn và đúng yêu cầu.
- Luồng sự kiện thay thế:
#### ` `*<a name="_toc196727216"></a><a name="_toc196727265"></a><a name="_toc196727428"></a><a name="_toc196727514"></a>2.1.13 Gửi báo cáo task*
- Tác nhân chính: Member
- Điều kiện tiên quyết:
  - Member đã thực hiện xong task hoặc hoàn thành giai đoạn cần báo cáo.
- Luồng sự kiện chính:
  - Member truy cập chức năng "Gửi báo cáo task".
  - Điền nội dung báo cáo: kết quả, khó khăn (nếu có), đề xuất (nếu có).
  - Gửi báo cáo lên hệ thống.
- Kết quả mong đợi:
  - Leader nhận được báo cáo để theo dõi tiến độ và đánh giá công việc.
- Luồng sự kiện thay thế:
  - Nếu thiếu thông tin bắt buộc, hệ thống yêu cầu Member bổ sung trước khi gửi.
#### ` 	`*<a name="_toc196727429"></a><a name="_toc196727515"></a>2.1.14 Xem phản hồi từ Leader*
- Tác nhân chính: Member
- Điều kiện tiên quyết:
  - Member đã gửi báo cáo task.
  - Leader đã phản hồi trên hệ thống.
- Luồng sự kiện chính:
  - Member truy cập mục "Phản hồi từ Leader".
  - Xem phản hồi về báo cáo: đánh giá, nhận xét, yêu cầu chỉnh sửa (nếu có).
- Kết quả mong đợi:
  - Member hiểu rõ góp ý để cải thiện công việc hoặc hoàn thiện task.
- Luồng sự kiện thay thế:
  - Nếu chưa có phản hồi, hệ thống hiển thị trạng thái "Chờ phản hồi".
1. ## <a name="_toc196727142"></a><a name="_toc196727217"></a><a name="_toc196727243"></a><a name="_toc196727266"></a><a name="_toc196727430"></a><a name="_toc196727516"></a>Mô hình lớp
![Mô tả ảnh](https://github.com/TrungNguyen0304/du-anBE/blob/main/images/59ccd2dd-fe67-4c89-8f7a-abce29646a6c.jpg)


