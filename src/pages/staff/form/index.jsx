import { motion } from "framer-motion";

import Header from "../../../components/common/Header";
import StatCard from "../../../components/common/StatCard";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../../../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../../../components/products/SalesTrendChart";
import ProductsTable from "../../../components/products/ProductsTable";
import Sidebar from "../../../components/common/Sidebar";
const RequestPage = () => {
	return (<>
    <Sidebar/>
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Client Bill Form' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
			{/* add boxes  here */}
			import React from 'react';


    <div className="max-w-lg mx-auto bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Item Details Form</h2>
      <form className="space-y-4">
        {/* QTY Field */}
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="qty">
            Quantity (QTY)
          </label>
          <input
            type="number"
            id="qty"
            placeholder="Enter quantity"
            className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Each Field */}
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="each">
            Each (Price per Item)
          </label>
          <input
            type="number"
            id="each"
            placeholder="Enter price per item"
            className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Amount Field */}
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="amount">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            placeholder="Total amount"
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


				{/* <ProductsTable /> */}

				{/* CHARTS */}
				<div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
					<SalesTrendChart />
					<CategoryDistributionChart />
				</div>
			</main>
		</div>
    </>
	);
};
export default RequestPage;
