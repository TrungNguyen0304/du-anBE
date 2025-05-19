import React from "react";
import UserTable from "../../../components/UserTable";

const MemberPage = () => {
  return (
    <UserTable
      title="Quản Lý Nhân Viên"
      fetchUrl="https://du-anbe.onrender.com/api/company/showallMember"
      deleteUrl="https://du-anbe.onrender.com/api/company/deleteUser"
      originPage="member"
      createLink="/create-user"
    />
  );
};

export default MemberPage;
