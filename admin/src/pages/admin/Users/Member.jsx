import React from "react";
import UserTable from "../../../components/UserTable";

const MemberPage = () => {
  return (
    <UserTable
      title="Quản Lý Nhân Viên"
      fetchUrl="http://103.45.235.153/api/company/showallMember"
      deleteUrl="http://103.45.235.153/api/company/deleteUser"
      originPage="member"
      createLink="/create-user"
    />
  );
};

export default MemberPage;
