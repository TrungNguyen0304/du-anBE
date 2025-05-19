import ManagementDetail from "../../../components/ManagementDetail";

const MemberDetail = () => {
  return (
    <ManagementDetail
      title="Thông Tin Nhân Viên"
      fetchUrl="https://du-anbe.onrender.com/api/company/viewMember"
    />
  );
};

export default MemberDetail;
