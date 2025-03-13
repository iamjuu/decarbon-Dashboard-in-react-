import { useState, useEffect } from "react";
import { Zap, Users, ShoppingBag, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import StatCard from "../components/common/statCard2";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import { jwtDecode } from "jwt-decode";
import axios from "../Instance/Instance";

const OverviewPage = () => {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const role = decodedToken.role;
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (role === "Admin") {
        try {
          const response = await axios.get("/overviewdetails");
          setOverviewData(response.data);
		
        } catch (error) {
          console.error("Error fetching overview data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [role]);

  if (loading) {
    return <p className="text-center mt-10 text-xl">Loading...</p>;
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        {role === "Admin" ? (
          <>
            <Header title="Overview" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
              {overviewData ? (
                <>
                  {/* STAT CARDS */}
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
                        { label: "This Month", value: overviewData?.totalRegistrations?.thisMonth },
                        { label: "This Week", value: overviewData?.totalRegistrations?.thisWeek },
                        { label: "This Year", value: overviewData?.totalRegistrations?.thisYear },
                        { label: "Last Month", value: overviewData?.totalRegistrations?.lastMonth },
                      ]}
                    />
                    <StatCard
                      name="Total Services"
                      icon={Users}
                      color="#8B5CF6"
                      periodData={[
                        { label: "This Month", value: overviewData?.totalServices?.thisMonth },
                        { label: "This Week", value: overviewData?.totalServices?.thisWeek },
                        { label: "This Year", value: overviewData?.totalServices?.thisYear },
                        { label: "Last Month", value: overviewData?.totalServices?.lastMonth },
                      ]}
                    />
                    <StatCard
                      name="Total Enquiry Clients"
                      icon={ShoppingBag}
                      color="#EC4899"
                      periodData={[
                        { label: "This Month", value: overviewData?.totalEnquiryClients?.thisMonth },
                        { label: "This Week", value: overviewData?.totalEnquiryClients?.thisWeek },
                        { label: "This Year", value: overviewData?.totalEnquiryClients?.thisYear },
                        { label: "Last Month", value: overviewData?.totalEnquiryClients?.lastMonth },
                      ]}
                    />
                    <StatCard
                      name="Total Income"
                      icon={DollarSign}
                      color="#10B981"
                      periodData={[
                        { label: "This Month", value: overviewData?.totalIncome?.thisMonth },
                        { label: "This Week", value: overviewData?.totalIncome?.thisWeek },
                        { label: "This Year", value: overviewData?.totalIncome?.thisYear },
                        { label: "Last Month", value: overviewData?.totalIncome?.lastMonth },
                      ]}
                    />
                  </motion.div>

                  {/* CHARTS */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SalesOverviewChart />
                    <CategoryDistributionChart />
                    <SalesChannelChart />
                  </div>
                </>
              ) : (
                <p className="text-center text-xl text-gray-500">No data available</p>
              )}
            </main>
          </>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-semibold text-red-900">Welcome to the Dashboard.</h1>
          </div>
        )}
      </div>
    </>
  );
};

export default OverviewPage;

