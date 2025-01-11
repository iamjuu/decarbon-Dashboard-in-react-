import React, { useEffect, useState } from "react";
import axios from "../Instance/Instance"; // Adjust path accordingly
import Sidebar from "../components/common/Sidebar";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { UserCheck, UserPlus, UsersIcon, Car } from "lucide-react";
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
  const [page, setPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination

  // State for date range
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

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

  // Fetch bookings with pagination
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`/bookings?page=${page}&limit=6`);
        setPendingData(response.data.data); // Update state with fetched bookings data
        setTotalPages(response.data.totalPages); // Set the total number of pages
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [page]);

  // Handle search by date range
  const handleSearch = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From Date and To Date");
      return;
    }

    // Format the dates to ISO format (yyyy-mm-dd)
    const formattedFromDate = fromDate.toISOString().split("T")[0];
    const formattedToDate = toDate.toISOString().split("T")[0];

    try {
      const response = await axios.get(`/bookings/search?fromDate=${formattedFromDate}&toDate=${formattedToDate}`);
      setPendingData(response.data.data); // Update state with search results
    } catch (err) {
      setError("Search failed");
    }
  };

  // Handle clearing search and resetting state
  const handleClearSearch = () => {
    setFromDate(null);
    setToDate(null);
    setPage(1); // Reset to page 1
    fetchBookings(); // Refetch original bookings list
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
          setPage(1); // Reset to page 1
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

  // Refetch bookings (used for both the initial state and after clearing search)
  const fetchBookings = async () => {
    try {
      const response = await axios.get(`/bookings?page=${page}&limit=10`);
      setPendingData(response.data.data); // Reset to the original bookings data
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to fetch bookings");
      setLoading(false);
    }
  };

  if (loading) {
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
            <StatCard
              name="Bookings This Week"
              icon={UsersIcon}
              value={countobject.thisWeek ?? "Loading..."}
              color="#6366F1"
            />
            <StatCard
              name="Bookings This Month"
              icon={UserPlus}
              value={countobject.thisMonth ?? "Loading..."}
              color="#b91010"
            />
            <StatCard
              name="Bookings Tomorrow"
              icon={UserCheck}
              value={countobject.tomorrow ?? "Loading..."}
              color="#F59E0B"
            />
            <StatCard
              name="Bookings This Year"
              icon={Car}
              value={countobject.thisYear ?? "Loading..."}
              color="#10B981"
            />
          </motion.div>

          {/* Date Range Picker for Searching */}
          <div className="flex items-center space-x-4 mb-8">
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
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Search
            </button>
            <button
              onClick={handleClearSearch}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Clear
            </button>
          </div>

          {/* Bookings Display */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Pending Bookings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingData.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white p-3 rounded-lg shadow-sm flex flex-col space-y-2"
                >
                  {/* Booking Image */}
                  <img
                    src={`http://localhost:7000/public/images/${booking.imagelink}`}
                    alt="Booking"
                    className="w-full h-20 object-cover rounded-md"
                  />

                  {/* Booking details */}
                  <h3 className="text-sm font-semibold text-gray-800">{booking._id}</h3>
                  <p className="text-xs text-gray-500">
                    Booking Date: {new Date(booking.bookdate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-600">Kilometers: {booking.kilometer}</p>

                  {/* Convert to Register Button */}
                  <button
                    onClick={() => handleConvertToRegister(booking._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition text-xs"
                  >
                    Convert to Register
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-between">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-white">Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default OverviewPage;
