import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/admin/Home";
import Member from "./pages/admin/Member";
import MemberDetail from "./pages/admin/MemberDetail";
import Departments from "./pages/admin/Departments";
import Projects from "./pages/admin/Projects";
import Jobs from "./pages/admin/Jobs";
import ProjectProgress from "./pages/admin/ProjectProgress";
import Login from "./pages/Login";
// import ProtectedRoute from "./components/ProtectedRoute";

// Layout for Company
const CompanyLayout = () => (
  <div className="flex min-h-screen flex-col sm:flex-row">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 bg-gray-100 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/member" element={<Member />} />
          <Route path="/memberdetail" element={<MemberDetail />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/projects" element={<Projects />} />
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
