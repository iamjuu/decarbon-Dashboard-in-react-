import { useState } from "react";
import { motion } from "framer-motion";
import styled, { createGlobalStyle } from 'styled-components';
import LeftSideBar from '../home/LeftSideBar';



const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(userData);

  // Filter users based on search term
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const searchValue = e.target.value.toLowerCase();

    const filtered = userData.filter(user => {
      return (
        user.name.toLowerCase().includes(searchValue) ||
        user.phone.includes(searchValue) ||
        user.vehicleType.toLowerCase().includes(searchValue) ||
        user.vehiclenumber.toLowerCase().includes(searchValue) ||
        user.itemsname.toLowerCase().includes(searchValue)
      );
    });

    setFilteredUsers(filtered);
  };

  return (
    <>
      <Container>
        <Left>
          <LeftSideBar />
          </Left>

<Right>
          <div className="overflow-x-auto p-4">
         
            <table className=" mt-24 min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicle Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicle Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicle Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gst</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-100">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-300">{user.phone}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold text-red-400">
                        {user.vehicleType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-300">{user.vehiclenumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-300">{user.itemsname}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-300">{user.Quantity}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-300">{user.Price}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-300">{user.Discount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-300">{user.Gst}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-300">{user.Amount}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          </Right>
      </Container>
    </>
  );
};

export default Index;



// Styled Components
const Container = styled.div`
  width: 100%;
  height: 100vh; /* Full height of the viewport */
  display: flex;
`;

const Left = styled.div`
  width: 20%;
  display: flex;
  background-color:#262f3a;
`;

const Right = styled.div`
  width: 80%;
  background-color: #232c38;

`