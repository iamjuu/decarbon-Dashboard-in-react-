import { useState } from "react";
import { motion } from "framer-motion";
import styled, { createGlobalStyle } from 'styled-components';
import LeftSideBar from '../home/LeftSideBar';

const userData = [
  // Your sample user data here
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(userData);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleType: '',
    vehicleNumber: '',
    itemsName: '',
    quantity: '',
    price: '',
    discount: '',
    gstAmount: ''
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newUser);
    // Handle form submission logic
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Left>
          <LeftSideBar />
          <div className="p-6 w-full">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Client Bill</h2>
            <form onSubmit={handleSubmit} className="mt-[1px] w-full">
              <div className="flex flex-col space-y-4 w-[50%]">
                <div className="flex gap-5">
                  <div className="w-full">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={newUser.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className="p-2 border rounded-md w-full"
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={newUser.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="p-2 border rounded-md w-full"
                    />
                  </div>
                </div>
                {/* Other form fields similar to above */}
                <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </Left>
      </Container>
    </>
  );
};

export default Index;

const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
`;

const Container = styled.div`
  background-color: #1F2937;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
`;

const Left = styled.div`
  width: 100%;
  display: flex;
  background-color:#242e3c;
  flex-grow: 1;
`;
