import { UserCheck, UserPlus, UsersIcon, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import UserDemographicsChart from "../components/users/UserDemographicsChart";
import { utils, writeFile } from "xlsx"; // Importing xlsx library
import { useEffect, useState } from "react";
import Axios from '../Instance/Instance'
const userStats = {
  totalUsers: 243,
  totalServices: 243,
  enquryClients: 20,
  totalprofit: 10000,
};

const userData = [
  {
    id: 1,
    name: "Muhammed Ajmal CC",
    phone: "7025715250",
    vehicleType: "Bike",
    vehiclenumber: "KL 13 AQ 1596",
    itemsname: "Pulser",
    Quantity: "1",
    Price: "2118.64",
    Discount: "83.158%",
    Gst: "64.24(18.0%)",
    Amount: "4210",
  },
  {
    id: 1,
    name: "Muhammed  CC",
    phone: "7025715250",
    vehicleType: "Bike",
    vehiclenumber: "KL 13 AQ 1596",
    itemsname: "Pulser",
    Quantity: "1",
    Price: "2118.64",
    Discount: "83.158%",
    Gst: "64.24(18.0%)",
    Amount: "4210",
  },
];

const UsersPage = () => {
  const [userList,setUserList] = useState('')

  const exportToExcel = () => {
    const ws = utils.json_to_sheet(userData); 
    const wb = utils.book_new(); 
    utils.book_append_sheet(wb, ws, "Users");
    writeFile(wb, "users_data.xlsx"); 
  };

  useEffect(() => {
    const userGet = async () => {
      try {
        const response = await Axios.get('/users');
        if (response.status === 200) {
          console.log(response.data, 'data got');
          setUserList(response.data.user); 
        }
      } catch (error) {
        console.log(error, 'error in users path');
      }
    };
    userGet();
  }, []);
  


  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Users" />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          {/* STATS */}
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard
              name="Total Users"
              icon={UsersIcon}
              value={userStats.totalUsers.toLocaleString()}
              color="#6366F1"
            />
            <StatCard
              name="Total Services"
              icon={UserPlus}
              value={userStats.totalServices}
              color="#b91010"
            />
            <StatCard
              name="Enqury Clients"
              icon={UserCheck}
              value={userStats.enquryClients.toLocaleString()}
              color="#F59E0B"
            />
            <StatCard
              name="Total profit"
              icon={DollarSign}
              value={userStats.totalprofit}
              color="#10B981"
            />
          </motion.div>

          <UsersTable userData={userData} />

          {/* Button to export data to Excel */}
          <button
            onClick={exportToExcel} // Trigger the export function on click
            className="px-6 py-3 mt-5 border-2 border-blue-500 text-sm text-white font-bold rounded-full shadow-lg bg-transparent hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
          >
            Convert to XL sheet
          </button>

          {/* USER CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <UserGrowthChart />
            <UserActivityHeatmap />
            <UserDemographicsChart />
          </div>
        </main>
      </div>
    </>
  );
};

export default UsersPage;
