import React from "react";
import ManagementDetail from "../../../components/ManagementDetail";

const LeaderDetail = () => {
  return (
    <ManagementDetail
      title="Thông Tin Leader"
      fetchUrl="http://103.45.235.153/api/company/viewLeader"
      isLeader={true}
    />
  );
};

export default LeaderDetail;
