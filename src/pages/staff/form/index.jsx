import React, { useEffect, useState } from "react";
import Header from "../../../components/common/Header";
import CategoryDistributionChart from "../../../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../../../components/products/SalesTrendChart";
import Sidebar from "../../../components/common/Sidebar";
import Axios from '../../../Instance/Instance';

const RequestPage = () => {
  const [vehicleList, setVehicleList] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");

  useEffect(() => {
    const fetchVehicleNumbers = async () => {
      try {
        
        const response = await Axios.get('/vehiclenuumber');
        console.log(response, 'Vehicle numbers fetched');
        if (response?.data) {
          setVehicleList(response.data);
        }
      } catch (error) {
        console.error('Error fetching vehicle numbers:', error);
      }
    };

    fetchVehicleNumbers();
  }, []);

  const handleVehicleChange = (event) => {
    const vehicleNumber = event.target.value;
    setSelectedVehicle(vehicleNumber);
    console.log(vehicleNumber, 'selected');
  };

  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Client Bill Form" />
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <div className="max-w-xl mx-auto mb-5 bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Client Bill Form
              </h2>
              <div className="flex flex-col">
                <label htmlFor="vehicle-select">
                  Select Vehicle Number:
                </label>
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
            <form className="space-y-4">
              {/* Rest of the form remains exactly the same */}
              {/* Owner Full Name */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="owner-name"
                >
                  Owner Full Name
                </label>
                <input
                  type="text"
                  id="owner-name"
                  placeholder="Enter owner's full name"
                  className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="phone-number"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone-number"
                  placeholder="Enter phone number"
                  className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                />
              </div>

              {/* Vehicle Number */}
              <div className="flex justify-between">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="vehicle-number"
                  >
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    id="vehicle-number"
                    value={selectedVehicle}
                    readOnly
                    className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                  />
                </div>

                {/* Year of Vehicle */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="vehicle-year"
                  >
                    Year of Vehicle
                  </label>
                  <input
                    type="number"
                    id="vehicle-year"
                    placeholder="Enter year of vehicle"
                    className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Vehicle Model */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="vehicle-model"
                >
                  Vehicle Model
                </label>
                <input
                  type="text"
                  id="vehicle-model"
                  placeholder="Enter vehicle model"
                  className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                />
              </div>

              {/* Kilometer */}
              <div className="flex justify-between">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="kilometer"
                  >
                    Kilometer
                  </label>
                  <input
                    type="number"
                    id="kilometer"
                    placeholder="Enter kilometers"
                    className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                  />
                </div>

                {/* Fuel */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="fuel"
                  >
                    Fuel Type
                  </label>
                  <select
                    id="fuel"
                    className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                  </select>
                </div>
              </div>

              {/* Smoke */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="smoke"
                >
                  Smoke
                </label>
                <input
                  type="text"
                  id="smoke"
                  placeholder="Enter smoke details"
                  className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
                />
              </div>

              {/* LHCE Details */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="lhce-details"
                >
                  LHCE Details
                </label>
                <input
                  type="text"
                  id="lhce-details"
                  placeholder="Enter LHCE details"
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