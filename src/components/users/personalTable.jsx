import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const userData = [
  {
    id: 1,
    name: "muhammed ajmal cc",
    phone: "7025715250",
    vehicleType: "Bike",
    vehiclenumber: "KL 13 AQ 1596",
    itemsname: "Pulser",
    Quantity: "1",
    Price: "2118.64",
    Discount: "83.158%",
    Gst: "64.24(18.0%)",
    Amount: "421",
  },
];

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(userData);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = userData.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.phone.toLowerCase().includes(term) ||
        user.vehicleType.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Users</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium  text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Vehicle Type
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Vehicle Number
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Items Name
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                GST
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                  {user.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                  {user.vehicleType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                  {user.vehiclenumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                  {user.itemsname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                  {user.Quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                  {user.Price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                  {user.Discount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                  {user.Gst}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                  {user.Amount}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UsersTable;
