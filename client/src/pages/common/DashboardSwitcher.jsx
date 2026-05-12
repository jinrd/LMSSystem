import StudentDashboard from "../student/StudentDashboard";
import AdminDashboard from "../admin/AdminDashboard";
import TeacherDashboard from "../teacher/TeacherDashboard";

export default function DashboardSwitcher() {
  const role = localStorage.getItem("role");

  if (role === "ADMIN") {
    return <AdminDashboard />;
  }

  if (role === "TEACHER") {
    return <TeacherDashboard />;
  }

  return <StudentDashboard />;
}
