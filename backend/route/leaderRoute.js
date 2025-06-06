const express = require("express");
const {
  getMyTeam,
  viewAssignedProject,
  createTask,
  updateTask,
  showAllTasks,
  deleteTask,
  paginationTask,
  assignTask,
  revokeTaskAssignment,
  unassignedTask,
  getAssignedTask,
  showallReport,
  showAllReportMember,
  evaluateMemberReport,
  createReportCompany,
  showAllFeedback,
  viewTask,
} = require("../controller/leader.js");
const authenticateJWT = require("../middleware/auth.js");
const authorize = require("../middleware/authorize.js");

const router = express.Router();
// xem task của mình được giao
router.get("/showallTeam/", authenticateJWT, getMyTeam);

// xem tất cả các project của mình
router.get("/showallProject/", authenticateJWT, viewAssignedProject);

// tạo task
router.post("/createTask", authenticateJWT, authorize("leader"), createTask);

// xem tất cả task của mình theo id project
router.get(
  "/showallTask/:projectId",
  authenticateJWT,
  authorize("leader"),
  showAllTasks
);

// cập nhật task theo id
router.put("/updateTask/:id", authenticateJWT, authorize("leader"), updateTask);

// xóa task theo id
router.delete(
  "/deleteTask/:id",
  authenticateJWT,
  authorize("leader"),
  deleteTask
);

// phân trang task
router.post(
  "/paginationTask",
  authenticateJWT,
  authorize("leader"),
  paginationTask
);

// gán task vào member theo id
router.put("/assignTask/:id", authenticateJWT, authorize("leader"), assignTask);

// thu hồi task theo id
router.put(
  "/revokeTask/:id/revoke",
  authenticateJWT,
  authorize("leader"),
  revokeTaskAssignment
);

// lấy ra toàn bộ task chưa giao
router.get(
  "/unassignedTask/",
  authenticateJWT,
  authorize("leader"),
  unassignedTask
);

// lấy ra toàn bộ task đã giao
router.get(
  "/getAssignedTask/",
  authenticateJWT,
  authorize("leader"),
  getAssignedTask
);

//show ra report của member
router.get("/viewReport/", authenticateJWT, authorize("leader"), showallReport);

// lấy ra report của từng member theo id
router.get(
  "/viewReportMember/:id/",
  authenticateJWT,
  authorize("leader"),
  showAllReportMember
);

// đánh giá báo cáo của member theo id
router.post(
  "/evaluateMemberReport/:id",
  authenticateJWT,
  authorize("leader"),
  evaluateMemberReport
);

// tạo báo cáo của leader dành cho company
router.post(
  "/createReportCompany/",
  authenticateJWT,
  authorize("leader"),
  createReportCompany
);

// xem tất cả đánh giá của leader
router.get(
  "/showAllFeedback/",
  authenticateJWT,
  authorize("leader"),
  showAllFeedback
);

// view taskid
router.get(`/viewTask/:id`, authenticateJWT, authorize("leader"), viewTask);

module.exports = router;
