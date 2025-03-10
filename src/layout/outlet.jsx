import { Outlet } from "react-router-dom";

const SomethingLayout = () => {
  return (
    <div className="flex bg-gray-900 text-gray-100 h-screen">
      <div className="w-64 bg-gray-800 p-4">Common Sidebar</div>
      <div className="flex-1 p-6">
        <Outlet /> {/* Renders nested routes */}
      </div>
    </div>
  );
};

export default SomethingLayout;
