import ManagementDetail from "../../../components/ManagementDetail";

const MemberDetail = () => {
  return (
    <ManagementDetail
      title="Thông Tin Nhân Viên"
      fetchUrl="http://103.45.235.153/api/company/viewMember"
    />
  );
};

export default MemberDetail;
