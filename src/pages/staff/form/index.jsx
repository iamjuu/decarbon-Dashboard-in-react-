import React, { useState } from "react";
import axios from "axios";

const Form = () => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleType: "",
    vehicleNumber: "",
    itemsName: "",
    quantity: "",
    price: "",
    discount: "",
    gstAmount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      newUser.name &&
      newUser.email &&
      newUser.phone &&
      newUser.vehicleType &&
      newUser.vehicleNumber &&
      newUser.itemsName &&
      newUser.quantity &&
      newUser.price &&
      newUser.discount &&
      newUser.gstAmount
    ) {
      try {
           const response = await axios.post("/client-bill", newUser, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to submit the form.");
        }

        // Clear the form after successful submission
        setNewUser({
          name: "",
          email: "",
          phone: "",
          vehicleType: "",
          vehicleNumber: "",
          itemsName: "",
          quantity: "",
          price: "",
          discount: "",
          gstAmount: "",
        });

        alert("Data has been sent successfully.");
      } catch (error) {
        alert("An error occurred: " + error.message);
      }
    } else {
      alert("Please fill all fields.");
    }
  };

  return (
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

          <div className="w-full">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={newUser.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="p-2 border rounded-md w-full"
            />
          </div>

          <div className="flex gap-5">
            <div className="w-full">
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Vehicle Type</label>
              <input
                type="text"
                name="vehicleType"
                id="vehicleType"
                value={newUser.vehicleType}
                onChange={handleChange}
                placeholder="Vehicle Type"
                className="p-2 border rounded-md w-full"
              />
            </div>
            <div className="w-full">
              <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700">Vehicle Number</label>
              <input
                type="text"
                name="vehicleNumber"
                id="vehicleNumber"
                value={newUser.vehicleNumber}
                onChange={handleChange}
                placeholder="Vehicle Number"
                className="p-2 border rounded-md w-full"
              />
            </div>
          </div>

          <div className="w-full">
            <label htmlFor="itemsName" className="block text-sm font-medium text-gray-700">Items Name</label>
            <input
              type="text"
              name="itemsName"
              id="itemsName"
              value={newUser.itemsName}
              onChange={handleChange}
              placeholder="Items Name"
              className="p-2 border rounded-md w-full"
            />
          </div>

          <div className="w-full">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              value={newUser.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              className="p-2 border rounded-md w-full"
            />
          </div>

          <div className="flex gap-5">
            <div className="w-full">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                id="price"
                value={newUser.price}
                onChange={handleChange}
                placeholder="Price"
                className="p-2 border rounded-md w-full"
              />
            </div>
            <div className="w-full">
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount</label>
              <input
                type="number"
                name="discount"
                id="discount"
                value={newUser.discount}
                onChange={handleChange}
                placeholder="Discount"
                className="p-2 border rounded-md w-full"
              />
            </div>
          </div>

          <div className="w-full">
            <label htmlFor="gstAmount" className="block text-sm font-medium text-gray-700">GST Amount</label>
            <input
              type="number"
              name="gstAmount"
              id="gstAmount"
              value={newUser.gstAmount}
              onChange={handleChange}
              placeholder="GST Amount"
              className="p-2 border rounded-md w-full"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
