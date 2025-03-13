import { BarChart2, Menu, Settings, Users, ClipboardType } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'
import { FaUsers  } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";


const SIDEBAR_ITEMS = [
  {
    name: "Overview",
    icon: BarChart2,
    color: "#6366f1",
    href: "/",
    role: "Admin", // Role required for this item
  },
  { name: "Users list", icon: Users, color: "#EC4899", href: "/users" },
  { name: "Client Bill Form", icon: ClipboardType, color: "#3B82F6", href: "/staffs-bill-form" },
  { name: "Registrations", icon: FaUsers, color: "EC4899", href: "/registrations" },
  { name: "Bookings", icon: SlCalender , color: "EC4899", href: "/bookings" },
  
  

];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map(
            (item) => 
              // Check if the item is "Overview" and hide it when role is "user"
              (item.name !== "Overview" || userRole === "Admin") && (
                <Link key={item.href} to={item.href}>
                  <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
                    <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          className="ml-4 whitespace-nowrap"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2, delay: 0.3 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              )
          )}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
