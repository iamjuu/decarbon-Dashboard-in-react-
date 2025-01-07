import React, { useEffect, useState } from "react";
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
  const [selectvechicleno, setselectvechicleno] = useState(null);

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

  const settingvariable = (id, vno) => {
    setSelectedDetailId(id);
    setselectvechicleno(vno);
  };

  const handleAddToBill = async (a, b) => {
    try {
      const id = a;
      const vehicleno = b;
      const response = await axios.post("/addtobill", { id, vehicleno });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Added to Bill",
          text: "The document has been added to the bill successfully!",
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add the document to the bill.",
      });
    }
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
        vehiclenumber: selectvechicleno,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Rejected",
          text: "The document has been rejected successfully!",
        }).then(() => {
          window.location.reload();
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
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center text-black">Pending Documents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pendingData.map((user) =>
              user.details.map((detail) => (
                <div
                  key={detail._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105"
                >
                  <img
                    src={`http://localhost:7000/public/images/${detail.imagelink}`}
                    alt="Pending Document"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 bg-gray-50 flex flex-col space-y-3">
                    <h3 className="text-lg font-semibold text-black truncate">Name: {user.name}</h3>
                    <p className="text-black text-sm">Phone: {user.phone}</p>
                    <p className="text-black text-sm">VehicleNo: {user.vehiclenumber}</p>
                    <p className="text-black text-sm">Kilometers: {detail.kilometer}</p>
                    <p className="text-black text-sm">Vehicle Model: {user.vehicleModel}</p>

                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => handleAddToBill(detail._id, user.vehiclenumber)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                      >
                        Add to Bill
                      </button>

                      <button
                        onClick={() => settingvariable(detail._id, user.vehiclenumber)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    </div>

                    {selectedDetailId === detail._id && (
                      <div className="mt-4">
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Enter reason for rejecting..."
                          rows="4"
                          className="w-full p-2 border border-gray-300 rounded-md text-black"
                        />
                        <div className="flex justify-between mt-2">
                          <button
                            onClick={handleReject}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                          >
                            Submit
                          </button>
                          <button
                            onClick={handleCancelReject}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OverviewPage;
