import React from "react";
import UserTable from "../../../components/UserTable";

const Leader = () => {
  return (
    <UserTable
      title="Quản Lý Leader"
      fetchUrl="http://103.45.235.153/api/company/showallLeaders"
      deleteUrl="http://103.45.235.153/api/company/deleteUser"
      originPage="leader"
      createLink="/create-leader"
    />
  );
};

export default Leader;
