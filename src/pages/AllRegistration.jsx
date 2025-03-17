import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "../Instance/Instance";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import Swal from "sweetalert2";

const OverviewPage = () => {
  const [pendingData, setPendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [selectVehicleNo, setSelectVehicleNo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const reasonInputRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch data function
  const fetchPendingData = async () => {
    setIsReloading(true);
    try {
      const response = await axios.get("allregistration");
      setPendingData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    } finally {
      setIsReloading(false);
    }
  };

  useEffect(() => {
    fetchPendingData();
  }, []);

  useEffect(() => {
    if (reasonInputRef.current && cursorPosition !== null) {
      reasonInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [rejectionReason]);

  // Use memo to prevent recreation of flattened data on each render
  const flattenedData = useMemo(() => {
    return pendingData.reduce((acc, user) => {
      if (!user || !user.details || !Array.isArray(user.details)) return acc;
      
      return acc.concat(
        user.details.filter(detail => detail).map(detail => ({
          ...detail,
          userName: user.name || 'Unknown',
          userPhone: user.phone || 'N/A',
          vehicleNumber: user.vehiclenumber || 'N/A',
          vehicleModel: user.vehicleModel || 'N/A',
        }))
      );
    }, []);
  }, [pendingData]);

  // Reset pagination when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [pendingData]);

  // Calculate pagination values directly based on current state
  const totalItems = flattenedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Direct function to get current page items
  const getPageItems = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return flattenedData.slice(start, Math.min(end, flattenedData.length));
  };

  const currentItems = getPageItems();

  // Direct, explicit navigation functions
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const settingVariable = (id, vno) => {
    setSelectedDetailId(id);
    setSelectVehicleNo(vno);
    setShowModal(true);
    setRejectionReason("");
    setCursorPosition(0);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please provide a reason for rejecting.",
      });
      return;
    }

    try {
      const response = await axios.post(`/reject/${selectedDetailId}`, {
        reason: rejectionReason,
        vehiclenumber: selectVehicleNo,
      });

      if (response.status === 200) {
        setShowModal(false);
        Swal.fire({
          icon: "success",
          title: "Rejected",
          text: "The document has been rejected successfully!",
        });

        fetchPendingData();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to reject the document.",
      });
    }
  };

  const handleCancelReject = () => {
    setSelectedDetailId(null);
    setRejectionReason("");
    setSelectVehicleNo(null);
    setShowModal(false);
    setCursorPosition(null);
  };

  const handleAddToBill = async (id, vehicleNumber) => {
    try {
      const response = await axios.post("addtobill", { id, vehicleNumber });
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Added to Bill",
          text: "This item has been successfully added to the bill.",
        });

        fetchPendingData();
      }
    } catch (error) {
      console.log("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add to bill.",
      });
    }
  };

  const RejectionModal = () => {
    if (!showModal) return null;

    useEffect(() => {
      if (showModal && reasonInputRef.current) {
        const timeoutId = setTimeout(() => {
          reasonInputRef.current.focus();
        }, 100);
        return () => clearTimeout(timeoutId);
      }
    }, [showModal]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={handleCancelReject}>
        <div className="bg-white rounded-lg p-6 w-96 max-w-md" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-4 text-blue-500">Enter Rejection Reason</h3>
          <textarea
            ref={reasonInputRef}
            value={rejectionReason}
            onChange={(e) => {
              setCursorPosition(e.target.selectionStart);
              setRejectionReason(e.target.value);
            }}
            placeholder="Enter reason for rejecting..."
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md text-black mb-4"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <button onClick={handleReject} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">Reject</button>
            <button onClick={handleCancelReject} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition">Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        <Header />
        <div className="p-6">
          <div className="flex justify-center items-center mb-6">
            <h2 className="text-2xl font-semibold text-blue-500 mr-2">
              Pending Documents
            </h2>
            <button 
              onClick={fetchPendingData} 
              disabled={isReloading}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="Reload Data"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`text-blue-500 w-5 h-5 ${isReloading ? 'animate-spin' : ''}`}
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : flattenedData.length === 0 ? (
            <p className="text-center text-gray-600">No pending registrations found.</p>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentItems.map((item) => (
                  <div key={item._id} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105">
                    <img src={item.imagelink} alt="Pending Document" className="w-full h-48 object-cover" />
                    <div className="p-4 bg-gray-50 flex flex-col space-y-3">
                      <h3 className="text-lg font-semibold text-black truncate">Name: {item.userName}</h3>
                      <p className="text-black text-sm">Phone: {item.userPhone}</p>
                      <p className="text-black text-sm">VehicleNo: {item.vehicleNumber}</p>
                      <div className="mt-4 flex justify-between">
                        <button onClick={() => handleAddToBill(item._id, item.vehicleNumber)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">Add to Bill</button>
                        <button onClick={() => settingVariable(item._id, item.vehicleNumber)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-center items-center space-x-4">
                <button 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md transition ${
                    currentPage === 1 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Prev
                </button>
                <span className="px-2">
                  Page {currentPage} of {totalPages} ({currentItems.length}/{totalItems} items)
                </span>
                <button 
                  onClick={nextPage} 
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-4 py-2 rounded-md transition ${
                    currentPage === totalPages || totalPages === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <RejectionModal />
    </>
  );
};

export default OverviewPage;
