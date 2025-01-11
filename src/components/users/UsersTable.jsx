import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "./../../Instance/Instance"; // Import Axios
import Swal from 'sweetalert2'; // Import SweetAlert2
import { MdDelete } from "react-icons/md";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const UsersTable = ({ userData, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Vehicle number search term
  const [fromDate, setFromDate] = useState(""); // Start date for the range
  const [toDate, setToDate] = useState(""); // End date for the range
  const [selectedServiceType, setSelectedServiceType] = useState("Serviced"); // Dropdown value for service type
  const [filteredUsers, setFilteredUsers] = useState([]); // Initialize as empty array
  const [initialUserData, setInitialUserData] = useState([]); // Store initial user data for reset
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const itemsPerPage = 10; // Set the number of items per page
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Admin check

  // Initialize filteredUsers with userData when component mounts or userData changes
  useEffect(() => {
    setInitialUserData(userData || []); // Store the initial userData
    setFilteredUsers(userData || []); // Initialize filtered users
    // Check if the user is an admin (role is stored in localStorage)
    const userToken = localStorage.getItem("token"); // Assuming token contains user data
    if (userToken) {
      const decodedToken = JSON.parse(atob(userToken.split('.')[1])); // Decode the JWT
      setIsAdmin(decodedToken?.role === 'Admin');
    }
  }, [userData]);

  // Handle the search by vehicle number
  const handleSearch = async () => {
    const term = searchTerm.toUpperCase(); // Capitalize search term

    if (term === "") {
      setFilteredUsers(initialUserData || []); // Reset to initialUserData if search term is empty
    } else {
      try {
        setIsLoading(true);
        const response = await axios.get("/vehicle-search", {
          params: { vehicleNumber: term ,serviceType: selectedServiceType },
        });
        setFilteredUsers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
        setFilteredUsers([]); // Clear filtered users on error
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle the date range search
  const handleDateRangeSearch = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both from date and to date.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get("/date-search", {
        params: { fromDate, toDate , serviceType: selectedServiceType },
      });
      setFilteredUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching data by date range:", error);
      setFilteredUsers([]); // Clear filtered users on error
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dropdown change (service type)
  const handleDropdownChange = async (event) => {
    const selectedType = event.target.value;
    setSelectedServiceType(selectedType);
    // Fetch new data based on the selected service type
    try {
      setIsLoading(true);
      const response = await axios.get("/filter-by-service", {
        params: { serviceType: selectedType },
      });
      console.log(response)
      setFilteredUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching vehicle data by service type:", error);
      setFilteredUsers([]); // Clear filtered users on error
    } finally {
      setIsLoading(false);
    }
  };

  // Handle the clear button click
  const handleClear = () => {
    setSearchTerm(""); // Clear vehicle search term
    setFromDate(""); // Clear from date
    setToDate(""); // Clear to date
    setSelectedServiceType("Serviced"); // Reset the dropdown to the default value
    setFilteredUsers(initialUserData || []); // Reset the filtered data to the initial state (userData)
    setCurrentPage(1); // Reset to the first page
  };

  // Handle deleting a user
  const handleDelete = async (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          await axios.delete(`/delete-vehicle/${userId}`);
          Swal.fire('Deleted!', 'This bill has been deleted.', 'success');
          // Reload the user data after successful deletion
          onDelete(userId);
          setFilteredUsers((prev) => prev.filter((user) => user._id !== userId));
        } catch (error) {
          console.error('Error deleting user:', error);
          Swal.fire('Error!', 'There was an error deleting the vehicle.', 'error');
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  // Get paginated data (only 10 items per page)
  const getPaginatedData = () => {
    if (!Array.isArray(filteredUsers)) return []; // Ensure filteredUsers is always an array
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < Math.ceil(filteredUsers.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Export filtered data to Excel
  const handleExport = () => {
    if (filteredUsers.length === 0) {
      Swal.fire({
        title: 'No Data Available',
        text: 'There is no data to export.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    // Create a new workbook and worksheet using ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');
  
    // Define columns
    const columns = selectedServiceType === "Serviced" ? [
      { header: 'Index', key: 'index', width: 10 },
      { header: 'Date', key: 'date', width: 20 },
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
      { header: 'Services', key: 'services', width: 40 },
      { header: 'Discount', key: 'discount', width: 10 },
      { header: 'Total Amount', key: 'totalAmount', width: 15 },
    ] : [
      { header: 'Index', key: 'index', width: 10 },
      { header: 'Date', key: 'createdAt', width: 20 },
      { header: 'Vehicle Number', key: 'vehicleNumber', width: 20 },
      { header: 'Owner Name', key: 'ownerName', width: 20 },
      { header: 'Phone Number', key: 'phoneNumber', width: 15 },
      { header: 'Vehicle Year', key: 'vehicleYear', width: 15 },
      { header: 'Vehicle Model', key: 'vehicleModel', width: 20 },
      { header: 'Kilometer', key: 'kilometer', width: 10 },
      { header: 'Service Status', key: 'serviceStatus', width: 15 },
      { header: 'Reason', key: 'reason', width: 20 },
    ];
  
    // Set the columns in the worksheet
    worksheet.columns = columns;
  
    // Add data rows
    const data = filteredUsers.map((user, index) => ({
      index: index + 1,
      date: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
      createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
      vehicleNumber: user.vehicleNumber,
      ownerName: user.ownerName,
      phoneNumber: user.phoneNumber,
      vehicleYear: user.vehicleYear,
      vehicleModel: user.vehicleModel,
      kilometer: user.kilometer,
      fuelType: user.fuelType,
      smoke: user.smoke,
      lhceDetails: user.lhceDetails,
      serviceStatus: user.servicestatus,
      services: user.services,
      discount: user.discount,
      totalAmount: user.totalAmount,
      reason: user.reason
    }));
  
    // Add rows and apply styling
    data.forEach(rowData => {
      const row = worksheet.addRow(rowData);
      
      // Find the service status cell
      const serviceStatusCell = row.getCell('serviceStatus');
      
      // Apply styling based on service status
      if (rowData.serviceStatus === 'Serviced') {
        serviceStatusCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '006400' }  // Dark Green
        };
        serviceStatusCell.font = {
          color: { argb: 'FFFFFF' },
          bold: true
        };
      } else if (rowData.serviceStatus === 'Rejected') {
        serviceStatusCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '8B0000' }  // Dark Red
        };
        serviceStatusCell.font = {
          color: { argb: 'FFFFFF' },
          bold: true
        };
      }
  
      // Add borders to service status cell
      serviceStatusCell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      };
    });
  
    // Generate and save the file
    workbook.xlsx.writeBuffer().then(buffer => {
      saveAs(new Blob([buffer]), `${selectedServiceType.toLowerCase()}_users.xlsx`);
    });
  };
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
<div className="flex justify-between items-center mb-6 p-4 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg shadow-lg border border-gray-700">
 
  <div className="flex items-center space-x-4">
    {/* Vehicle Number Search */}
    <div className="relative">
      <input
        type="text"
        placeholder="Search by Vehicle Number..."
        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
    </div>

    {/* Search Button */}
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={handleSearch}
    >
      Search
    </button>

    {/* Date Range Search */}
    <div className="flex items-center space-x-2">
      <input
        type="date"
        className="bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />
      <input
        type="date"
        className="bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-3 py-0 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleDateRangeSearch}
      >
        Search by Date
      </button>
    </div>

    {/* Service Type Dropdown */}
    <div className="relative w-40">
      <select
        className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        value={selectedServiceType}
        onChange={handleDropdownChange}
      >
        <option value="Serviced">Serviced</option>
        <option value="Enquiry">Enquiry</option>
      </select>
    </div>

    {/* Clear Button */}
    <button
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      onClick={handleClear}
    >
      Clear
    </button>

    {/* Export to Excel Button */}
    <button
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      onClick={handleExport}
    >
      Export to Excel
    </button>
  </div>
</div>

      {isLoading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Owner Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Vehicle Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Vehicle Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Kilometers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Service Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total Amount
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {getPaginatedData().map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-700 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-100">
                      {user.ownerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-300">
                      {user.phoneNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-300">
                      {user.vehicleModel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-300">
                      {user.vehicleNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-300">
                      {user.vehicleYear}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-300">
                      {user.kilometer}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap border border-black ${
                      user.servicestatus === "Serviced"
                        ? "bg-green-500 text-white font-bold"
                        : user.servicestatus === "Rejected"
                        ? "bg-red-500 text-white font-bold"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    <span className="text-sm font-medium">{user.servicestatus}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-300">
                      {user.discount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-300">
                      {user.totalAmount}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300 ">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(user._id)}
                      >
                        delete
                      </button>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination Controls */}
      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => handlePageChange("next")}
          disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default UsersTable;
