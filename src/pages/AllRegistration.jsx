import React, { useEffect, useState, useRef } from "react";
import axios from "../Instance/Instance";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const OverviewPage = () => {
  const [pendingData, setPendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [selectvechicleno, setselectvechicleno] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const reasonInputRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
 const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("allregistration");
        setPendingData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Effect to maintain cursor position
  useEffect(() => {
    if (reasonInputRef.current && cursorPosition !== null) {
      reasonInputRef.current.selectionStart = cursorPosition;
      reasonInputRef.current.selectionEnd = cursorPosition;
    }
  }, [rejectionReason, cursorPosition]);

  const flattenedData = pendingData.reduce((acc, user) => {
    return acc.concat(
      user.details.map(detail => ({
        ...detail,
        userName: user.name,
        userPhone: user.phone,
        vehicleNumber: user.vehiclenumber,
        vehicleModel: user.vehicleModel
      }))
    );
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = flattenedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(flattenedData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const settingvariable = (id, vno) => {
    setSelectedDetailId(id);
    setselectvechicleno(vno);
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
        vehiclenumber: selectvechicleno
      });

      if (response.status === 200) {
        setShowModal(false);
        Swal.fire({
          icon: "success",
          title: "Rejected",
          text: "The document has been rejected successfully!",
        }).then(() => {
          navigate("/registrations")
        });
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
    setselectvechicleno(null);
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

        setTimeout(() => {
          navigate("/registrations")
        }, 2000);


      }

    } catch (error) {
      

console.log('error hi',error)

	    Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add to bill.",
      });
    }
  };

  const handleTextareaChange = (e) => {
    const input = e.target;
    const newPosition = input.selectionStart;
    setRejectionReason(e.target.value);
    setCursorPosition(newPosition);
  };

  const RejectionModal = () => {
    if (!showModal) return null;

    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        handleCancelReject();
      }
    };

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={handleBackdropClick}
      >
        <div 
          className="bg-white rounded-lg p-6 w-96 max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-4 text-blue-500">Enter Rejection Reason</h3>
          <textarea
            ref={reasonInputRef}
            value={rejectionReason}
            onChange={handleTextareaChange}
            placeholder="Enter reason for rejecting..."
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md text-black mb-4"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Reject
            </button>
            <button
              onClick={handleCancelReject}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (showModal && reasonInputRef.current) {
      const timeoutId = setTimeout(() => {
        reasonInputRef.current.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [showModal]);

  if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-black">Loading...</p></div>;
  if (error) return <div className="flex justify-center items-center h-screen"><p className="text-red-500">{error}</p></div>;

  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        <Header />
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center text-blue-500">
            Pending Documents
            <span className="text-sm text-gray-500 ml-2">
              (Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, flattenedData.length)} of {flattenedData.length})
            </span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentItems.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105"
              >
                <img
                  src={`${item.imagelink}`}
                  alt="Pending Document"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 bg-gray-50 flex flex-col space-y-3">
                  <h3 className="text-lg font-semibold text-black truncate">Name: {item.userName}</h3>
                  <p className="text-black text-sm">Phone: {item.userPhone}</p>
                  <p className="text-black text-sm">VehicleNo: {item.vehicleNumber}</p>
                  <p className="text-black text-sm">Kilometers: {item.kilometer}</p>
                  <p className="text-black text-sm">Vehicle Model: {item.vehicleModel}</p>

                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => handleAddToBill(item._id, item.vehicleNumber)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      Add to Bill
                    </button>

                    <button
                      onClick={() => settingvariable(item._id, item.vehicleNumber)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition`}
              >
                Previous
              </button>
              
              <div className="flex space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`w-8 h-8 rounded-full ${
                      currentPage === index + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      <RejectionModal />
    </>
  );
};

export default OverviewPage;
