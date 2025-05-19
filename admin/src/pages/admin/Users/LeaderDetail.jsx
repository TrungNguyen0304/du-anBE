import React from "react";
import ManagementDetail from "../../../components/ManagementDetail";

const LeaderDetail = () => {
  return (
    <ManagementDetail
      title="Thông Tin Leader"
      fetchUrl="https://du-anbe.onrender.com/api/company/viewLeader"
      isLeader={true}
    />
  );
};

export default LeaderDetail;
