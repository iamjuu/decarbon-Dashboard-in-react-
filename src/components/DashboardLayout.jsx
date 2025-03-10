import React from "react";
import { Outlet } from "react-router-dom"; // ✅ Import Outlet

const DashboardLayout = () => {
  return (
    <div className="flex bg-gray-900 text-gray-100 h-screen">
      {/* Your Sidebar/Header can go here */}
      <Outlet /> {/* ✅ This will render the matched child route */}
    </div>
  );
};

export default DashboardLayout;

