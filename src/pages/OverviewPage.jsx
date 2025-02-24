import { useState, useEffect } from "react";
import { BarChart2, ShoppingBag, Users, Zap, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import StatCard from "../components/common/statCard2"
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
  }, [role]);

  // Define metrics with icons and colors
  // const metrics = [
  //   { key: "totalUser", name: "Total Registrations", icon: Zap, color: "#6366F1" },
  //   { key: "totalServices", name: "Total Service", icon: Users, color: "#8B5CF6" },
  //   { key: "totalClients", name: "Total Enquiry Clients", icon: ShoppingBag, color: "#EC4899" },
  //   { key: "totalIncome", name: "Total Income", icon: DollarSign, color: "#10B981" },
  // ];

  // Define time periods
  const periods = [
    { key: "thisMonth", label: "This Month" },
    { key: "thisWeek", label: "This Week" },
    { key: "thisYear", label: "This Year" },
    { key: "lastMonth", label: "Last Month" },
  ];

  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        {role === "Admin" ? (
          <>
            <Header title="Overview" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
              {overviewData ? (
                <motion.div
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <StatCard
                  name="Total Registrations"
                  icon={Zap}
                  color="#6366F1"
                  periodData={[
                    { label: "This Month", value: overviewData?.thisMonth?.totalUser },
                    { label: "This Week", value: overviewData?.thisWeek?.totalUser },
                    { label: "This Year", value: overviewData?.thisYear?.totalUser },
                    { label: "Last Month", value: overviewData?.lastMonth?.totalUser },
                  ]}
                />
                <StatCard
                  name="Total Service"
                  icon={Users}
                  color="#8B5CF6"
                  periodData={[
                    { label: "This Month", value: overviewData?.thisMonth?.totalServices },
                    { label: "This Week", value: overviewData?.thisWeek?.totalServices },
                    { label: "This Year", value: overviewData?.thisYear?.totalServices },
                    { label: "Last Month", value: overviewData?.lastMonth?.totalServices },
                  ]}
                />
                <StatCard
                  name="Total Enquiry Clients"
                  icon={ShoppingBag}
                  color="#EC4899"
                  periodData={[
                    { label: "This Month", value: overviewData?.thisMonth?.totalClients },
                    { label: "This Week", value: overviewData?.thisWeek?.totalClients },
                    { label: "This Year", value: overviewData?.thisYear?.totalClients },
                    { label: "Last Month", value: overviewData?.lastMonth?.totalClients },
                  ]}
                />
                <StatCard
                  name="Total Income"
                  icon={DollarSign}
                  color="#10B981"
                  periodData={[
                    { label: "This Month", value: overviewData?.thisMonth?.totalIncome },
                    { label: "This Week", value: overviewData?.thisWeek?.totalIncome },
                    { label: "This Year", value: overviewData?.thisYear?.totalIncome },
                    { label: "Last Month", value: overviewData?.lastMonth?.totalIncome },
                  ]}
                />
              </motion.div>
              ) : (
                <p>Loading...</p>
              )}

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

