import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Departments from "./pages/Departments";
import Projects from "./pages/Projects";
import Jobs from "./pages/Jobs";
import Member from "./pages/Member";
import ProjectProgress from "./pages/ProjectProgress";
import MemberDetail from "./pages/MemberDetail";

const App = () => {
  return (
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
};

export default App;
