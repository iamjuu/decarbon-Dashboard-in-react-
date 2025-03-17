import React, { useEffect, useState } from "react";
import axios from "../Instance/Instance"; // Adjust path accordingly
import Sidebar from "../components/common/Sidebar";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { UserCheck, UserPlus, UsersIcon, Car, RefreshCw } from "lucide-react";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS for date picker

const OverviewPage = () => {
  const [pendingData, setPendingData] = useState([]);
  const [countobject, setCountObject] = useState({
    thisWeek: 0,
    thisMonth: 0,
    tomorrow: 0,
    thisYear: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Track the current page for default bookings
  const [totalPages, setTotalPages] = useState(1); // Total pages for default pagination
  const [fromDate, setFromDate] = useState(null); // Date range - From
  const [toDate, setToDate] = useState(null); // Date range - To
  const [searchPage, setSearchPage] = useState(1); // Page for search results
  const [searchTotalPages, setSearchTotalPages] = useState(1); // Total pages for search
  const [isSearchActive, setIsSearchActive] = useState(false); // Track if search is active
  const [refreshing, setRefreshing] = useState(false); // Track refresh state

  // Fetch booking counts (this week, this month, tomorrow, this year)
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get("/bookingcounts");
        setCountObject(response.data); // Update state with fetched counts
      } catch (err) {
        setError("Failed to fetch booking counts");
      }
    };

    fetchCounts();
  }, []);

  // Format date for API requests
  function formatDateToLocal(date) {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Month is zero-indexed
    const day = String(date.getDate()).padStart(2, '0');  // Day of the month
    
    return `${year}-${month}-${day}`;
  }

  // Fetch bookings with pagination
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      const response = await axios.get(`/bookings?page=${page}&limit=6`);
      setPendingData(response.data.data); // Update state with fetched bookings data
      setTotalPages(Math.max(1, response.data.totalPages)); // Ensure at least 1 page
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      setError("Failed to fetch bookings");
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle search by date range
  const handleSearch = async () => {
    if (!fromDate || !toDate) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please select both From Date and To Date',
      });
      return;
    }

    try {
      setLoading(true);
      setRefreshing(true);
      
      const formattedFromDate = formatDateToLocal(fromDate);
      const formattedToDate = formatDateToLocal(toDate);
      
      const response = await axios.get(
        `/bookings/search?fromDate=${formattedFromDate}&toDate=${formattedToDate}&page=${searchPage}&limit=6`
      );

      setPendingData(response.data.data); // Update state with search results
      setSearchTotalPages(Math.max(1, response.data.totalPages || 1)); // Ensure at least 1 page
      setIsSearchActive(true); // Mark search active
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      setLoading(false);
      setRefreshing(false);
      Swal.fire({
        icon: 'error',
        title: 'Search Error',
        text: 'Failed to fetch search results. Please try again.',
      });
    }
  };

  // Handle clearing search and resetting state
  const handleClearSearch = () => {
    setFromDate(null);
    setToDate(null);
    setSearchPage(1); // Reset search page
    setIsSearchActive(false); // Mark search as inactive
    setPage(1); // Reset default page
    fetchBookings(); // Fetch the original bookings list
  };

  // Handle manual refresh
  const handleRefresh = () => {
    if (isSearchActive) {
      handleSearch();
    } else {
      fetchBookings();
    }
  };

  // Handle Convert to Register
  const handleConvertToRegister = async (bookingId) => {
    try {
      const response = await axios.post(`/convert-to-register/${bookingId}`);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Converted to Register",
          text: "The booking has been successfully converted to registration!",
        }).then(() => {
          // Check if this was the last item on the page
          if (pendingData.length === 1) {
            // If it's not the first page, go back one page
            if (isSearchActive && searchPage > 1) {
              setSearchPage(prev => prev - 1);
            } else if (!isSearchActive && page > 1) {
              setPage(prev => prev - 1);
            } else {
              // If it's the first page, just refresh
              if (isSearchActive) {
                handleSearch();
              } else {
                fetchBookings();
              }
            }
          } else {
            // If there are other items on this page, just refresh
            if (isSearchActive) {
              handleSearch();
            } else {
              fetchBookings();
            }
          }
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to convert the booking to registration.",
      });
    }
  };

  // Pagination controls
  const handleNextPage = () => {
    if (isSearchActive) {
      if (searchPage < searchTotalPages) {
        setSearchPage((prev) => prev + 1);
      }
    } else {
      if (page < totalPages) {
        setPage((prev) => prev + 1);
      }
    }
  };

  const handlePrevPage = () => {
    if (isSearchActive) {
      if (searchPage > 1) {
        setSearchPage((prev) => prev - 1);
      }
    } else {
      if (page > 1) {
        setPage((prev) => prev - 1);
      }
    }
  };

  // Load data when page or searchPage changes
  useEffect(() => {
    if (isSearchActive) {
      handleSearch();
    } else {
      fetchBookings();
    }
  }, [page, searchPage]);

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-black">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        <Header />
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard name="Bookings This Week" icon={UsersIcon} value={countobject.thisWeek ?? "Loading..."} color="#6366F1" />
            <StatCard name="Bookings This Month" icon={UserPlus} value={countobject.thisMonth ?? "Loading..."} color="#b91010" />
            <StatCard name="Bookings Tomorrow" icon={UserCheck} value={countobject.tomorrow ?? "Loading..."} color="#F59E0B" />
            <StatCard name="Bookings This Year" icon={Car} value={countobject.thisYear ?? "Loading..."} color="#10B981" />
          </motion.div>

          {/* Date Range Picker for Searching */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <DatePicker
              selected={fromDate}
              onChange={setFromDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="From Date"
              className="px-4 py-2 rounded-md bg-gray-700 text-white"
            />
            <DatePicker
              selected={toDate}
              onChange={setToDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="To Date"
              className="px-4 py-2 rounded-md bg-gray-700 text-white"
            />
            <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Search</button>
            <button onClick={handleClearSearch} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">Clear</button>
          </div>

          {/* Bookings Display with Reload Icon */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-white">Pending Bookings</h2>
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition ${refreshing ? 'opacity-50' : ''}`}
              >
                <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>
            
            {refreshing && (
              <div className="text-center text-sm text-white mb-4">Refreshing data...</div>
            )}
            
            {pendingData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white">No pending bookings found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingData.map((booking) => (
                  <div key={booking._id} className="bg-white p-3 rounded-lg shadow-sm flex flex-col space-y-2">
                    <img src={`${booking.imagelink}`} alt="Booking" className="w-full h-20 object-cover rounded-md" />
                    <h3 className="text-sm font-semibold text-black">{booking.vno}</h3>
                    <p className="text-xs text-black">Booking Date: {new Date(booking.bookdate).toLocaleDateString()}</p>
                    <p className="text-xs text-black">Kilometers: {booking.kilometer}</p>
                    <button onClick={() => handleConvertToRegister(booking._id)} className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition text-xs">Convert to Register</button>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {(pendingData.length > 0 || isSearchActive || page > 1 || searchPage > 1) && (
              <div className="mt-8 flex justify-between items-center">
                <button
                  disabled={(isSearchActive ? searchPage : page) <= 1}
                  onClick={handlePrevPage}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 transition"
                >
                  Previous
                </button>
                <div className="text-white">
                  Page {isSearchActive ? searchPage : page} of {isSearchActive ? searchTotalPages : totalPages}
                </div>
                <button
                  disabled={(isSearchActive ? searchPage : page) >= (isSearchActive ? searchTotalPages : totalPages)}
                  onClick={handleNextPage}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default OverviewPage;
