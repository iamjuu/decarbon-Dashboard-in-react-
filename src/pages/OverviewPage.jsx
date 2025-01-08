import { useState, useEffect } from "react";
import { BarChart2, ShoppingBag, Users, Zap, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import { jwtDecode } from 'jwt-decode';
import axios from "./../Instance/Instance";

const OverviewPage = () => {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const role = decodedToken.role;
  const [overviewData, setOverviewData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (role === "Admin") {
        try {
          const response = await axios.get("/overviewdetails");
          setOverviewData(response.data);
        } catch (error) {
          console.error("Error fetching overview data:", error);
        }
      }
    };

    fetchData();
  }, [role]); // Re-fetch data if the role changes

  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        {role === "Admin" ? (
          <>
            <Header title="Overview" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
              {/* STATS */}
              <motion.div
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <StatCard name="Total Registrations" icon={Zap} value={overviewData?.totalUsers || '0'} color="#6366F1" />
                <StatCard name="Total Service" icon={Users} value={overviewData?.totalServices || '0'} color="#8B5CF6" />
                <StatCard name="Total Enquiry Clients" icon={ShoppingBag} value={overviewData?.totalClients || '0'} color="#EC4899" />
                <StatCard name="Total Income" icon={DollarSign} value={overviewData?.totalIncome || '0'} color="#10B981" />
              </motion.div>

              {/* CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SalesOverviewChart />
                <CategoryDistributionChart />
                <SalesChannelChart />
              </div>
            </main>
          </>
        ) : (
          <>
            <Header title="User Dashboard" />
            <div className="flex items-center justify-center h-screen">
              <h1 className="text-2xl font-semibold text-red-900">Welcome to the Dashboard.</h1>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OverviewPage;
