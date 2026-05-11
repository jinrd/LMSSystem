import React from "react";
import StudentDashboard from "../student/StudentDashboard";
import AdminDashboard from "../admin/AdminDashboard";

export default function DashboardSwitcher() {
  const role = localStorage.getItem("role");

  if (role === "ADMIN") {
    return <AdminDashboard />;
  }

  return <StudentDashboard />;
}
