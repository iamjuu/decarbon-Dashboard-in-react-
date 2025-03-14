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

  const reasonInputRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch data function
  const fetchPendingData = async () => {
    try {
      const response = await axios.get("allregistration");
      setPendingData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
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
          userName: user.name || "Unknown",
          userPhone: user.phone || "N/A",
          vehicleNumber: user.vehiclenumber || "N/A",
          vehicleModel: user.vehicleModel || "N/A",
        }))
      );
    }, []);
  }, [pendingData]);

  // Reset pagination when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [pendingData]);

  // Pagination logic
  const totalItems = flattenedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const getPageItems = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return flattenedData.slice(start, Math.min(end, flattenedData.length));
  };

  const currentItems = getPageItems();

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

  // Updated handleReject
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
        Swal.fire({
          icon: "success",
          title: "Rejected",
          text: "The document has been rejected successfully!",
        });

        // Remove rejected item from pendingData
        setPendingData(prevData =>
          prevData.map(user => ({
            ...user,
            details: user.details.filter(detail => detail._id !== selectedDetailId),
          })).filter(user => user.details.length > 0)
        );

        setShowModal(false);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to reject the document.",
      });
    }
  };

  // Updated handleAddToBill
  const handleAddToBill = async (id, vehicleNumber) => {
    try {
      const response = await axios.post("addtobill", { id, vehicleNumber });
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Added to Bill",
          text: "This item has been successfully added to the bill.",
        });

        // Remove billed item from pendingData
        setPendingData(prevData =>
          prevData.map(user => ({
            ...user,
            details: user.details.filter(detail => detail._id !== id),
          })).filter(user => user.details.length > 0)
        );
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add to bill.",
      });
    }
  };

  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        <Header />
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center text-blue-500">
            Pending Documents
          </h2>

          {flattenedData.length === 0 ? (
            <p className="text-center text-gray-600">No pending registrations found.</p>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentItems.map(item => (
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
                <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">Prev</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OverviewPage;

