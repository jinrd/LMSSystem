import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/common/Login";
import Register from "./pages/common/Register";
import UserList from "./pages/admin/UserList";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminCourseManagement from "./pages/admin/AdminCourseManagement";

/**
 * 1. 관리자 전용 보호 라우트
 * - 관리자(ADMIN)만 접근 가능
 * - 학생(STUDENT)이 접근하면 알림 후 대시보드로 이동
 * - 로그인 안 되어 있으면 로그인 페이지로 이동
 */
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("lms_token");

  if (!token) return <Navigate to="/login" replace />;

  if (role !== "ADMIN") {
    alert("관리자만 접근할 수 있는 페이지입니다.");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/**
 * 2. 공통 보호 라우트 (학생 + 관리자)
 * - 관리자와 학생 모두 접근 가능 (사용자 전용)
 * - 관리자는 관리 권한으로, 학생은 본인 데이터 확인용으로 접근
 * - 로그인 안 되어 있으면 로그인 페이지로 이동
 */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("lms_token");

  if (!token) {
    alert("로그인이 필요한 서비스입니다.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * 3. 비로그인 전용 라우트 (로그인/회원가입)
 * - 이미 로그인한 사용자가 접근하면 각자의 메인으로 리다이렉트
 */
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("lms_token");
  const role = localStorage.getItem("role");

  if (token) {
    return (
      <Navigate to={role === "ADMIN" ? "/admin/users" : "/dashboard"} replace />
    );
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* 초기 경로 설정 */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* [공통] 비로그인 상태에서만 접근 가능 */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* [학생용/공통] 학생과 관리자 모두 접근 가능 */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <StudentDashboard />
          </PrivateRoute>
        }
      />

      {/* [관리자용] 오직 관리자만 접근 가능 */}
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <UserList />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <AdminRoute>
            <AdminCourseManagement />
          </AdminRoute>
        }
      />

      {/* 잘못된 경로 처리 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
