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
import { useEffect, useState, useCallback } from "react";
import Axios from '../Instance/Instance';
import { format } from 'date-fns'; // Import date-fns for date formatting

const userStats = {
  totalUsers: 243,
  totalServices: 243,
  enquryClients: 20,
  totalprofit: 10000,
};

const UsersPage = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const exportToExcel = useCallback(() => {
    // Format the data
    const formattedUserList = userList.map((user, index) => {
      // Destructure the user object and exclude the _id field and other unnecessary fields
      const { __v, _id, createdAt, services, discount, ...userData } = user;
      
      // Format the "billed" field (createdAt) and change time format to AM/PM
      const billed = createdAt ? format(new Date(createdAt), 'MM/dd/yyyy hh:mm a') : '';

      // Flatten the services array into a string of serviceType: serviceAmount (e.g., 'machine: 500, cycle: 100')
      const servicesList = services ? services.map(service => `${service.serviceType}: ${service.serviceAmount}`).join(', ') : '';

      // Adding an index for the user (1, 2, 3, ...)
      return {
        index: index + 1, // Adding the index (starts from 1)
        ...userData,
        billed,       // Renamed field
        services: servicesList, // Flattened services
        discount,      // Include discount field in the export
      };
    });

    // Create a worksheet from the formatted data
    const ws = utils.json_to_sheet(formattedUserList);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Users');

    // Export to Excel
    writeFile(wb, 'users_data.xlsx');
  }, [userList]);

  useEffect(() => {
    const userGet = async () => {
      try {
        setLoading(true);
        const response = await Axios.get('/users');
        if (response.status === 200) {
          setUserList(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
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

          {/* Users Table */}
          {loading ? (
            <div className="text-center text-gray-300">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <UsersTable userData={userList} />
          )}

          {/* Button to export data to Excel */}
          <button
            onClick={exportToExcel} // Trigger the export function on click
            disabled={loading || !userList.length}
            className={`px-6 py-3 mt-5 border-2 border-blue-500 text-sm text-white font-bold rounded-full shadow-lg bg-transparent ${
              loading || !userList.length
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-500 hover:text-white"
            } focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2`}
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