import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "./../../Instance/Instance"; // Import Axios
import Swal from 'sweetalert2'; // Import SweetAlert2
import { MdDelete } from "react-icons/md";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import { FaPrint } from 'react-icons/fa';

const UsersTable = ({ userData, onDelete }) => {
  const navigate = useNavigate(); // Move this inside the component
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("Serviced");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [initialUserData, setInitialUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

   
  
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
      services: user.services, // Pass the array directly for processing later
      discount: user.discount,
      totalAmount: user.totalAmount,
      reason: user.reason
    }));
  
    // Add rows and apply styling
    data.forEach(rowData => {
      const row = worksheet.addRow(rowData);
  
      // Process services array and apply rich text
      const servicesCell = row.getCell('services');
      if (Array.isArray(rowData.services) && rowData.services.length > 0) {
        const richText = rowData.services.flatMap(service => [
          { text: service.serviceType, font: { bold: true } },
          { text: ': ' },
          { text: service.serviceAmount.toString(), font: { bold: true } },
          { text: '\n' }
        ]);
  
        // Add rich text to the cell
        servicesCell.value = { richText };
      }
  
      // Style the service status cell
      const serviceStatusCell = row.getCell('serviceStatus');
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
      className="p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
<div className="flex overflow-hidden justify-between items-center p-3 space-x-3 w-full bg-gray-900 rounded-lg border border-gray-800 shadow-lg">
  {/* Vehicle Number Search */}
  <div className="relative flex-shrink-0">
    <input
      type="text"
      placeholder="Vehicle Number..."
      className="pr-3 pl-10 w-52 h-10 placeholder-gray-400 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
  </div>
  
  {/* Search Button */}
  <button
    className="flex-shrink-0 px-4 h-10 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
    onClick={handleSearch}
  >
    Search
  </button>
  
  {/* Date Range Search - Labels Inside Inputs */}
  <div className="flex flex-shrink-0 items-center space-x-2">
    <input
      type="date"
      className="px-3 w-32 h-10 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
      placeholder="From"
    />
    <input
      type="date"
      className="px-3 w-32 h-10 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
      placeholder="To"
    />
    <button
      className="flex-shrink-0 px-3 h-10 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
      onClick={handleDateRangeSearch}
    >
      Filter
    </button>
  </div>
  
  {/* Service Type Dropdown */}
  <div className="flex-shrink-0 w-32">
    <select
      className="px-3 w-full h-10 text-white bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
      value={selectedServiceType}
      onChange={handleDropdownChange}
    >
      <option value="Serviced">Serviced</option>
      <option value="Enquiry">Enquiry</option>
    </select>
  </div>
  
  {/* Action Buttons */}
  <div className="flex flex-shrink-0 space-x-2">
    <button
      className="px-3 h-10 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500"
      onClick={handleClear}
    >
      Clear
    </button>
    <button
      className="px-3 h-10 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500"
      onClick={handleExport}
    >
      Export
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
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Owner Name
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Vehicle Model
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Vehicle Number
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Year
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Kilometers
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Service Status
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Discount
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {getPaginatedData().map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="cursor-pointer hover:bg-gray-700"
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
                 
                {/* Action column visible to everyone */}
<td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
  <div className="flex gap-3 items-center">
    {/* Print button visible for all users when service is completed */}
    {user.servicestatus === "Serviced" && (
      <button
        onClick={() => handlePrint(user)}
        className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        title="Print Invoice"
      >
        <FaPrint size={16} />
      </button>
    )}
    {/* Delete button only visible for admin */}
    {isAdmin && (
      <button
        className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        onClick={() => handleDelete(user._id)}
        title="Delete"
      >
        <MdDelete size={16} />
      </button>
    )}
  </div>
</td>
                
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination Controls */}
      <div className="flex justify-between mt-6">
  <button
    className={`px-4 py-2 ${
      currentPage === 1
        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-700"
    } rounded-lg`}
    onClick={() => handlePageChange("prev")}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <button
    className={`px-4 py-2 ${
      currentPage === Math.ceil(filteredUsers.length / itemsPerPage)
        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-700"
    } rounded-lg`}
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

  // Updated handlePrint function to open in new tab
  const handlePrint = (user) => {
    // Store the invoice data in sessionStorage to access it in the new tab
    sessionStorage.setItem('invoiceData', JSON.stringify({
      ...user,
      ownerName: user.ownerName,
      phoneNumber: user.phoneNumber,
      vehicleNumber: user.vehicleNumber,
      vehicleModel: user.vehicleModel,
      vehicleYear: user.vehicleYear,
      kilometer: user.kilometer,
      servicestatus: user.servicestatus,
      _id: user._id,
      services: user.services || [],
      fuelType: user.fuelType,
      smoke: user.smoke,
      lhceDetails: user.lhceDetails,
      discount: user.discount,
      totalAmount: user.totalAmount,
      createdAt: user.createdAt
    }));
  
    // Open invoice in new tab
    window.open('/Nos2/controlpanel/dashboard/invoice', '_blank');
  };
