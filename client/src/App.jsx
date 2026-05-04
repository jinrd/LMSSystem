import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserList from "./pages/UserList";

// 관리자만 접근할 수 있도록 돕는 보호 컴포넌트
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  console.log("역할 : {}", role);
  if (role !== "ADMIN") {
    alert("접근 권한이 없습니다.");
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 관리자 전용 페이지인 UserList를 AdminRoute로 감싸줍니다. */}
      <Route
        path="/users"
        element={
          <AdminRoute>
            <UserList />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
