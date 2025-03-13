import { useState, useEffect } from "react";
import { BarChart2, ShoppingBag, Users, Zap, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import StatCard from "../components/common/statCard2";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import { jwtDecode } from "jwt-decode";
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
          console.log("API Response Data:", response.data);
          setOverviewData(response.data);
        } catch (error) {
          console.error("Error fetching overview data:", error);
        }
      }
    };

    fetchData();
  }, [role]);

  return (
    <>
      <Sidebar />
      <div className="relative z-10 flex-1 overflow-auto">
        {role === "Admin" ? (
          <>
            <Header title="Overview" />
            <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
              {overviewData ? (
                <motion.div
                  className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  <StatCard
                    name="Total Registrations"
                    icon={Zap}
                    color="#6366F1"
                    periodData={[
                      { label: "This Month", value: overviewData?.totalRegistrations?.thisMonth || "N/A" },
                      { label: "This Week", value: overviewData?.totalRegistrations?.thisWeek || "N/A" },
                      { label: "This Year", value: overviewData?.totalRegistrations?.thisYear || "N/A" },
                      { label: "Last Month", value: overviewData?.totalRegistrations?.lastMonth || "N/A" },
                    ]}
                  />
                  <StatCard
                    name="Total Service"
                    icon={Users}
                    color="#8B5CF6"
                    periodData={[
                      { label: "This Month", value: overviewData?.totalServices?.thisMonth || "N/A" },
                      { label: "This Week", value: overviewData?.totalServices?.thisWeek || "N/A" },
                      { label: "This Year", value: overviewData?.totalServices?.thisYear || "N/A" },
                      { label: "Last Month", value: overviewData?.totalServices?.lastMonth || "N/A" },
                    ]}
                  />
                  <StatCard
                    name="Total Enquiry Clients"
                    icon={ShoppingBag}
                    color="#EC4899"
                    periodData={[
                      { label: "This Month", value: overviewData?.totalEnquiryClients?.thisMonth || "N/A" },
                      { label: "This Week", value: overviewData?.totalEnquiryClients?.thisWeek || "N/A" },
                      { label: "This Year", value: overviewData?.totalEnquiryClients?.thisYear || "N/A" },
                      { label: "Last Month", value: overviewData?.totalEnquiryClients?.lastMonth || "N/A" },
                    ]}
                  />
                  <StatCard
                    name="Total Income"
                    icon={DollarSign}
                    color="#10B981"
                    periodData={[
                      { label: "This Month", value: overviewData?.totalIncome?.thisMonth || "N/A" },
                      { label: "This Week", value: overviewData?.totalIncome?.thisWeek || "N/A" },
                      { label: "This Year", value: overviewData?.totalIncome?.thisYear || "N/A" },
                      { label: "Last Month", value: overviewData?.totalIncome?.lastMonth || "N/A" },
                    ]}
                  />
                </motion.div>
              ) : (
                <p>Loading...</p>
              )}

              {/* CHARTS */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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

