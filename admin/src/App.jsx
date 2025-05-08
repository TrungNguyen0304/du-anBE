import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/admin/Home";
import Jobs from "./pages/admin/Jobs";
import ProjectProgress from "./pages/admin/ProjectProgress";
import Login from "./pages/Login";
import CreateUser from "./pages/admin/Users/createUser";
import UpdateUser from "./pages/admin/Users/UpdateUser";
import Leader from "./pages/admin/Users/Leader";
import MemberPage from "./pages/admin/Users/Member";
import ManagementDetail from "./components/ManagementDetail";
import MemberDetail from "./pages/admin/Users/MemberDetail";
import LeaderDetail from "./pages/admin/Users/LeaderDetail";
import CreateLeader from "./pages/admin/Users/CreateLeader";
import Departments from "./pages/admin/Departments/Departments";
import Projects from "./pages/admin/Projects/Projects";
import CreateProject from "./pages/admin/Projects/CreateProject";
import UpdateProject from "./pages/admin/Projects/UpdateProject";
import ProjectDetail from "./pages/admin/Projects/ProjectDetail";
import CreateDepartment from "./pages/admin/Departments/CreateDepartment";
import UpdateDepartment from "./pages/admin/Departments/UpdateDepartment";
import DepartmentDetail from "./pages/admin/Departments/DepartmentDetail";
// import ProtectedRoute from "./components/ProtectedRoute";

// Layout for Company
const CompanyLayout = () => (
  <div className="flex min-h-screen flex-col sm:flex-row overflow-hidden">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 bg-gray-100 overflow-y-auto min-w-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/member" element={<MemberPage />} />
          <Route path="/leader" element={<Leader />} />
          <Route path="/management-detail" element={<ManagementDetail />} />
          <Route path="/member-detail" element={<MemberDetail />} />
          <Route path="/leader-detail" element={<LeaderDetail />} />

          {/* Phòng Ban */}
          <Route path="/departments" element={<Departments />} />
          <Route path="/create-department" element={<CreateDepartment />} />
          <Route path="/update-department" element={<UpdateDepartment />} />
          <Route path="/department-detail" element={<DepartmentDetail />} />

          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/create-leader" element={<CreateLeader />} />
          <Route path="/update-user" element={<UpdateUser />} />

          <Route path="/projects" element={<Projects />} />
          <Route path="/create-projects" element={<CreateProject />} />
          <Route path="/update-projects/:id" element={<UpdateProject />} />
          <Route path="/project-detail/:id" element={<ProjectDetail />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/projectprogress" element={<ProjectProgress />} />
        </Routes>
      </main>
    </div>
  </div>
);

// Layout for Leader
// const LeaderLayout = () => (
//   <div className="flex min-h-screen flex-col sm:flex-row">
//     <Sidebar />
//     <div className="flex-1 flex flex-col">
//       <Navbar />
//       <main className="flex-1 p-4 bg-gray-100 overflow-y-auto">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/projects" element={<Projects />} />
//           <Route path="/member" element={<Member />} />
//         </Routes>
//       </main>
//     </div>
//   </div>
// );

const App = () => {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Private routes */}
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            user?.role === "company" ? (
              <CompanyLayout />
            ) : user?.role === "leader" ? (
              <LeaderLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        }
      />
    </Routes>
  );
};

export default App;
