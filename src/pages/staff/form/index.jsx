import React, { useEffect, useState } from "react";
import Header from "../../../components/common/Header";
import CategoryDistributionChart from "../../../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../../../components/products/SalesTrendChart";
import Sidebar from "../../../components/common/Sidebar";
import Axios from "../../../Instance/Instance";
import Swal from 'sweetalert2';

const RequestPage = () => {
  const [vehicleList, setVehicleList] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [userData, setUserData] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [kilometer, setKilometer] = useState("");
  const [fuelType, setFuelType] = useState("petrol");
  const [smoke, setSmoke] = useState("");
  const [lhceDetails, setLhceDetails] = useState("");

  useEffect(() => {
    const fetchVehicleNumbers = async () => {
      try {
        const response = await Axios.get("/vehiclenuumber");
        if (response?.data) {
          setVehicleList(response.data);
        }
      } catch (error) {
        console.error("Error fetching vehicle numbers:", error);
      }
    };
    fetchVehicleNumbers();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await Axios.get("/user-details", {
          params: { vehicleNumber: selectedVehicle },
        });
        console.log("User data retrieved:", response?.data);
        if (response?.data?.data) {
          setUserData(response.data.data);
          setOwnerName(response.data.data[0].name || "");
          setPhoneNumber(response.data.data[0].phone || "");
          setVehicleYear(response.data.data[0].vehicleyear || "");
          setVehicleModel(response.data.data[0].vehicleModel || "");
          setKilometer(response.data.data[0].kilometer || "");
          setSmoke(response.data.data[0].smoke || "");
          setLhceDetails(response.data.data[0].lhceDetails || "");
          setFuelType(response.data.data[0].fuelType || "");
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
    const vehicleNumber = event.target.value;
    setSelectedVehicle(vehicleNumber);
    console.log(vehicleNumber, "selected");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      vehicleNumber: selectedVehicle,
      ownerName,
      phoneNumber,
      vehicleYear,
      vehicleModel,
      kilometer,
      fuelType,
      smoke,
      lhceDetails
    };

    try {
      const response = await Axios.post("/cleint-bill", formData);
      console.log("Form submitted successfully:", response);
      
      // Show success sweet alert
      await Swal.fire({
        title: 'Success!',
        text: 'Client bill has been saved successfully',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });

    } catch (error) {
      console.error("Error submitting form:", error);
      
      // Show error sweet alert
      Swal.fire({
        title: 'Error!',
        text: 'Failed to save client bill. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
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
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-6 text-center">Client Bill Form</h2>
              <div className="flex flex-col">
                <label htmlFor="vehicle-select">Select Vehicle Number:</label>
                <select
                  id="vehicle-select"
                  onChange={handleVehicleChange}
                  value={selectedVehicle}
                  className="block w-full px-3 py-2 bg-black text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Choose the number</option>
                  {vehicleList.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
  <div>
    <label className="block text-sm font-medium mb-2" htmlFor="owner-name">
      Owner Full Name
    </label>
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

  <div>
    <label className="block text-sm font-medium mb-2" htmlFor="phone-number">
      Phone Number
    </label>
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

  <div>
    <label className="block text-sm font-medium mb-2" htmlFor="vehicle-year">
      Vehicle Year
    </label>
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

  <div>
    <label className="block text-sm font-medium mb-2" htmlFor="vehicle-model">
      Vehicle Model
    </label>
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

  <div>
    <label className="block text-sm font-medium mb-2" htmlFor="kilometer">
      Kilometer
    </label>
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

  <div>
    <label className="block text-sm font-medium mb-2" htmlFor="smoke">
      Smoke
    </label>
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

  <div>
    <label className="block text-sm font-medium mb-2" htmlFor="lhce-details">
      LHCE Details
    </label>
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

  <div>
    <label className="block text-sm font-medium mb-2" htmlFor="fuel">
      Fuel Type
    </label>
    <select
      id="fuel"
      value={fuelType}
      onChange={(e) => setFuelType(e.target.value)}
      className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
      required
    >
      <option value="">Select fuel type</option>
      <option value="petrol">Petrol</option>
      <option value="diesel">Diesel</option>
    </select>
  </div>

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

          {/* CHARTS */}
          <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
            <SalesTrendChart />
            <CategoryDistributionChart />
          </div>
        </main>
      </div>
    </>
  );
};

export default RequestPage;