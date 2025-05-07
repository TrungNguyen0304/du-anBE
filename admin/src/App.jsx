import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/admin/Home";
import Member from "./pages/admin/Member";
import Departments from "./pages/admin/Departments";
import Projects from "./pages/admin/Projects";
import Jobs from "./pages/admin/Jobs";
import ProjectProgress from "./pages/admin/ProjectProgress";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import MemberDetail from "./pages/admin/Users/MemberDetail";
import CreateUser from "./pages/admin/Users/createUser";
import UpdateUser from "./pages/admin/Users/UpdateUser";

const App = () => {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  const location = useLocation();

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
            <MainLayout />
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        }
      />
    </Routes>
  );
};

// Main layout for authenticated users
const MainLayout = () => (
  <div className="flex min-h-screen flex-col sm:flex-row">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 bg-gray-100 overflow-y-auto">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member"
            element={
              <ProtectedRoute>
                <Member />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-user"
            element={
              <ProtectedRoute>
                <CreateUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-user"
            element={
              <ProtectedRoute>
                <UpdateUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/memberdetail"
            element={
              <ProtectedRoute>
                <MemberDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <ProtectedRoute>
                <Departments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projectprogress"
            element={
              <ProtectedRoute>
                <ProjectProgress />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  </div>
);

export default App;
