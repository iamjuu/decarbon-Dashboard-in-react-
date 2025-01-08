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
import { format } from 'date-fns'; // 
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';



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
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Users');

  // Define columns
  worksheet.columns = [
    { header: 'Index', key: 'index', width: 10 },
    { header: 'Vehicle Number', key: 'vehicleNumber', width: 20 },
    { header: 'Owner Name', key: 'ownerName', width: 20 },
    { header: 'Phone Number', key: 'phoneNumber', width: 15 },
    { header: 'Vehicle Year', key: 'vehicleYear', width: 15 },
    { header: 'Vehicle Model', key: 'vehicleModel', width: 20 },
    { header: 'Kilometer', key: 'kilometer', width: 10 },
    { header: 'Fuel Type', key: 'fuelType', width: 10 },
    { header: 'Smoke', key: 'smoke', width: 10 },
    { header: 'LHCE Details', key: 'lhceDetails', width: 15 },
    { header: 'Service Status', key: 'serviceStatus', width: 15 },
    { header: 'Reason', key: 'reason', width: 20 },
    { header: 'Services', key: 'services', width: 40 },
    { header: 'Discount', key: 'discount', width: 10 },
    { header: 'Total Amount', key: 'totalAmount', width: 15 },
    { header: 'Billed', key: 'billed', width: 20 },
  ];

  // Add rows
  const formattedUserList = userList.map((user, index) => {
    const { createdAt, servicestatus: serviceStatus, services, ...rest } = user;

    const billed = createdAt ? format(new Date(createdAt), 'MM/dd/yyyy hh:mm a') : '';
    const servicesList = services
      ? services.map(service => `${service.serviceType}: ${service.serviceAmount}`).join(', ')
      : '';

    return {
      index: index + 1,
      vehicleNumber: user.vehicleNumber || '',
      ownerName: user.ownerName || '',
      phoneNumber: user.phoneNumber || '',
      vehicleYear: user.vehicleYear || '',
      vehicleModel: user.vehicleModel || '',
      kilometer: user.kilometer || '',
      fuelType: user.fuelType || '',
      smoke: user.smoke || '',
      lhceDetails: user.lhceDetails || '',
      serviceStatus,
      reason: user.reason || '',
      services: servicesList,
      discount: user.discount || '',
      totalAmount: user.totalAmount || '',
      billed,
    };
  });

  formattedUserList.forEach(data => {
    const row = worksheet.addRow(data);
  
    // Apply conditional formatting with darker colors, bold text, and borders
    const serviceStatusCell = row.getCell('serviceStatus');
  
    // Set the font to bold and the color to white for contrast
    serviceStatusCell.font = {
      color: { argb: 'FFFFFF' },  // White text for contrast
      bold: true,                 // Bold text
    };
  
    // Apply borders to the cell
    serviceStatusCell.border = {
      top: { style: 'thin', color: { argb: '000000' } },    // Black top border
      left: { style: 'thin', color: { argb: '000000' } },   // Black left border
      bottom: { style: 'thin', color: { argb: '000000' } }, // Black bottom border
      right: { style: 'thin', color: { argb: '000000' } },  // Black right border
    };
  
    // Apply conditional background color and font color based on service status
    if (data.serviceStatus === 'Serviced') {
      serviceStatusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '006400' }, // Dark Green
      };
    } else if (data.serviceStatus === 'Rejected') {
      serviceStatusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8B0000' }, // Dark Red
      };
    }
  });
  
  

  // Export the file
  workbook.xlsx.writeBuffer().then(buffer => {
    saveAs(new Blob([buffer]), 'users_data.xlsx');
  });
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
  const handleUserDeletion = (deletedUserId) => {
    setUserList((prevList) => prevList.filter((user) => user._id !== deletedUserId));
  };

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
              name="Total services"
              icon={UsersIcon}
              value={userStats.totalUsers.toLocaleString()}
              color="#6366F1"
            />
            <StatCard
              name="Pending Bills"
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
              name="Total Income"
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
            <UsersTable userData={userList} onDelete={handleUserDeletion} />
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