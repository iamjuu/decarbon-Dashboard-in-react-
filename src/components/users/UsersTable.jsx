import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "./../../Instance/Instance"; // Import Axios
import Swal from 'sweetalert2'; // Import SweetAlert2

const UsersTable = ({ userData ,onDelete }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Vehicle number search term
  const [fromDate, setFromDate] = useState(""); // Start date for the range
  const [toDate, setToDate] = useState(""); // End date for the range
  const [filteredUsers, setFilteredUsers] = useState([]); // Initialize as empty array
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const itemsPerPage = 10; // Set the number of items per page
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Admin check

  // Initialize filteredUsers with userData when component mounts or userData changes
  useEffect(() => {
    setFilteredUsers(Array.isArray(userData) ? userData : []); // Ensure it's an array

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
      setFilteredUsers(userData || []); // Reset to userData if search term is empty
    } else {
      try {
        setIsLoading(true);
        const response = await axios.get("vehicle-search", {
          params: { vehicleNumber: term },
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
        params: { fromDate, toDate },
      });
      setFilteredUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching data by date range:", error);
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
    setFilteredUsers(Array.isArray(userData) ? userData : []); // Reset the filtered data to the initial state (userData)
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
          Swal.fire('Deleted!', 'This bill  has been deleted.', 'success');
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

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Users</h2>
        <div className="flex space-x-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Vehicle Number..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={handleSearch}
          >
            Search
          </button>
          <div className="flex space-x-2">
            <input
              type="date"
              className="bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              type="date"
              className="bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              onClick={handleDateRangeSearch}
            >
              Search by Date
            </button>
          </div>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
            onClick={handleClear}
          >
            Clear
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
                  Fuel Type
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-300">
                      {user.fuelType}
                    </span>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
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
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-300">
          Page {currentPage} of {Math.ceil(filteredUsers.length / itemsPerPage)}
        </span>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
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
