import React, { useEffect, useState } from "react";
import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import Axios from "../../../Instance/Instance";
import Swal from "sweetalert2";

const RequestPage = () => {
  const [vehicleList, setVehicleList] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [kilometer, setKilometer] = useState("");
  const [fuelType, setFuelType] = useState("petrol");
  const [smoke, setSmoke] = useState("");
  const [lhceDetails, setLhceDetails] = useState("");
  const [discount, setDiscount] = useState(0);
  const [services, setServices] = useState([{ service: "", amount: "" }]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetching vehicle numbers
  const fetchVehicleNumbers = async () => {
    setIsLoading(true);
    try {
      const response = await Axios.get("/vehiclenumber");
      if (response?.data) {
        setVehicleList(response.data);
      }
    } catch (error) {
      console.error("Error fetching vehicle numbers:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch vehicle numbers. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleNumbers();
  }, []);

  // Handle reload button click
  const handleReload = () => {
    fetchVehicleNumbers();
    setSelectedVehicle("");
  };

  // Fetching user details based on selected vehicle number
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await Axios.get("/user-details", {
          params: { vehicleNumber: selectedVehicle },
        });
        if (response?.data?.data) {
          const data = response.data.data[0];
          const toBillObject = data.details.find(detail => detail.status === "tobill")
          setOwnerName(data.name || "");
          setPhoneNumber(data.phone || "");
          setVehicleYear(data.vehicleyear || "");
          setVehicleModel(data.vehicleModel || "");
          setKilometer(toBillObject?.kilometer || "");
          setSmoke(data.smoke || "");
          setLhceDetails(data.lhceDetails || "");
          setFuelType(data.fuelType || "");
        } else {
          console.log("No data found for the selected vehicle.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (selectedVehicle) {
      fetchUserData();
    }
  }, [selectedVehicle]);

  const handleVehicleChange = (event) => {
    setSelectedVehicle(event.target.value);
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  const addServiceRow = () => {
    setServices([...services, { service: "", amount: "" }]);
  };

  const removeServiceRow = () => {
    setServices((prevServices) => {
      if (prevServices.length > 1) {
        return prevServices.slice(0, -1);
      }
      return prevServices;
    });
  };

  // Reset form to initial state
  const resetForm = () => {
    setSelectedVehicle("");
    setOwnerName("");
    setPhoneNumber("");
    setVehicleYear("");
    setVehicleModel("");
    setKilometer("");
    setFuelType("petrol");
    setSmoke("");
    setLhceDetails("");
    setDiscount(0);
    setServices([{ service: "", amount: "" }]);
    
    // Refetch vehicle list to update available vehicles
    fetchVehicleNumbers();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Calculate total amount from services
    const totalAmount = services.reduce(
      (sum, service) => sum + parseFloat(service.amount || 0),
      0
    );

    const formData = {
      vehicleNumber: selectedVehicle,
      ownerName,
      phoneNumber,
      vehicleYear,
      vehicleModel,
      kilometer,
      fuelType,
      smoke,
      lhceDetails,
      services: services.map((service) => ({
        serviceType: service.service,
        serviceAmount: parseFloat(service.amount || 0),
      })),
      discount: parseFloat(discount),
      totalAmount: totalAmount - discount,
    };

    try {
      await Axios.post("/client-bill", formData);

      Swal.fire({
        title: "Success!",
        text: "Client bill has been saved successfully",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      }).then(() => {
        // Reset form instead of reloading the page
        resetForm();
      });

    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to save client bill. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Client Bill Form" />
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <div className="max-w-xl mx-auto mb-5 bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Vehicle Select with Reload Icon */}
              <div className="flex items-center">
                <div className="flex-grow">
                  <label htmlFor="vehicle-select">Select Vehicle Number:</label>
                  <select
                    id="vehicle-select"
                    onChange={handleVehicleChange}
                    value={selectedVehicle}
                    className="block w-full px-3 py-2 bg-black text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Choose the number</option>
                    {vehicleList.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ml-2 mt-6">
                  <button
                    type="button"
                    onClick={handleReload}
                    disabled={isLoading}
                    className="p-2 rounded-full bg-blue-500 hover:bg-blue-700 focus:outline-none transition-colors"
                    title="Reload vehicle list"
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Owner Name */}
              <div>
                <label htmlFor="owner-name">Owner Full Name</label>
                <input
                  type="text"
                  id="owner-name"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Enter owner full name"
                  className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone-number">Phone Number</label>
                <input
                  type="tel"
                  id="phone-number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                  required
                />
              </div>

              {/* Vehicle Year */}
              <div>
                <label htmlFor="vehicle-year">Vehicle Year</label>
                <input
                  type="number"
                  id="vehicle-year"
                  value={vehicleYear}
                  onChange={(e) => setVehicleYear(e.target.value)}
                  placeholder="Enter vehicle year"
                  className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                  required
                />
              </div>

              {/* Vehicle Model */}
              <div>
                <label htmlFor="vehicle-model">Vehicle Model</label>
                <input
                  type="text"
                  id="vehicle-model"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="Enter vehicle model"
                  className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                  required
                />
              </div>

              {/* Kilometer */}
              <div>
                <label htmlFor="kilometer">Kilometer</label>
                <input
                  type="number"
                  id="kilometer"
                  value={kilometer}
                  onChange={(e) => setKilometer(e.target.value)}
                  placeholder="Enter kilometer"
                  className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                  required
                />
              </div>

              {/* Smoke */}
              <div>
                <label htmlFor="smoke">Smoke</label>
                <input
                  type="text"
                  id="smoke"
                  value={smoke}
                  onChange={(e) => setSmoke(e.target.value)}
                  placeholder="Enter smoke information"
                  className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                  required
                />
              </div>

              {/* LHCE Details */}
              <div>
                <label htmlFor="lhce-details">LHCE Details</label>
                <input
                  type="text"
                  id="lhce-details"
                  value={lhceDetails}
                  onChange={(e) => setLhceDetails(e.target.value)}
                  placeholder="Enter LHCE details"
                  className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                  required
                />
              </div>

              {/* Fuel Type */}
              <div>
                <label htmlFor="fuel">Fuel Type</label>
                <select
                  id="fuel"
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                  required
                >
                  <option value="">Select fuel type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Gas">Gas</option>
                </select>
              </div>

              {/* Services and Amount */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold mb-4">Service and Amount</h3>
                {services.map((row, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Service"
                      value={row.service}
                      onChange={(e) => handleServiceChange(index, "service", e.target.value)}
                      className="p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={row.amount}
                      onChange={(e) => handleServiceChange(index, "amount", e.target.value)}
                      className="p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                      required
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addServiceRow}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-all duration-300"
                >
                  + Add Service
                </button>
                {services.length > 1 && (
                  <button
                    type="button"
                    onClick={removeServiceRow}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-all duration-300"
                  >
                    - Remove Service
                  </button>
                )}
              </div>

              {/* Discount */}
              <div>
                <label htmlFor="discount">Discount</label>
                <input
                  type="number"
                  id="discount"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="Enter discount percentage"
                  className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

export default RequestPage;
