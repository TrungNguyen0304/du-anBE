import React from "react";
import UserTable from "../../../components/UserTable";

const Leader = () => {
  return (
    <UserTable
      title="Quản Lý Leader"
      fetchUrl="https://du-anbe.onrender.com/api/company/showallLeaders"
      deleteUrl="https://du-anbe.onrender.com/api/company/deleteUser"
      originPage="leader"
      createLink="/create-leader"
    />
  );
};

export default Leader;
