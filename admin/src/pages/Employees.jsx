import React from 'react';

const employeeData = [
  {
    id: 1,
    lastName: 'Nguyen',
    firstName: 'An',
    department: 'Phòng ban A',
    position: 'Chức vụ 1',
    job: 'Công việc 1',
    joinDate: '2020-01-01',
    salary: '10,000,000',
  },
  {
    id: 2,
    lastName: 'Tran',
    firstName: 'Binh',
    department: 'Phòng ban B',
    position: 'Chức vụ 2',
    job: 'Công việc 2',
    joinDate: '2021-03-15',
    salary: '12,000,000',
  },
  // Thêm các dòng dữ liệu khác nếu cần
];

const Employees = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quản Lý Nhân Viên</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Thêm</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-md text-sm">
          <thead className="bg-gradient-to-r from-[#183d5d] to-[#1d557a] text-white">
            <tr>
              <th className="px-3 py-2 border">ID</th>
              <th className="px-3 py-2 border">Họ</th>
              <th className="px-3 py-2 border">Tên</th>
              <th className="px-3 py-2 border">Phòng Ban</th>
              <th className="px-3 py-2 border">Chức Vụ</th>
              <th className="px-3 py-2 border">Công Việc</th>
              <th className="px-3 py-2 border">Ngày Vào Làm</th>
              <th className="px-3 py-2 border">Lương Căn Bản</th>
              <th className="px-3 py-2 border">Chức Năng</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((emp) => (
              <tr key={emp.id} className="even:bg-gray-100">
                <td className="px-3 py-2 border text-center">{emp.id}</td>
                <td className="px-3 py-2 border">{emp.lastName}</td>
                <td className="px-3 py-2 border">{emp.firstName}</td>
                <td className="px-3 py-2 border">{emp.department}</td>
                <td className="px-3 py-2 border">{emp.position}</td>
                <td className="px-3 py-2 border">{emp.job}</td>
                <td className="px-3 py-2 border">{emp.joinDate}</td>
                <td className="px-3 py-2 border">{emp.salary}</td>
                <td className="px-3 py-2 border flex gap-2 justify-center">
                  <button className="text-blue-600 hover:underline">Xem</button>
                  <button className="text-green-600 hover:underline">Sửa</button>
                  <button className="text-red-600 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employees;
