import React from 'react'
import {Link} from 'react-router-dom'
const LeftSideBar = () => {
  return (
     <div className=" w-[20%]  bg-gray-800  text-white flex-col items-center justify-center p-8">
          <Link to='/shaff'>
               <p className="text-xl mb-4 hover:bg-gray-700 hover:text-blue-400 px-4 py-2 rounded-lg transition-all duration-300">
           Shaff
       </p>
                   </Link>
                   <Link to='/userList'>
               <p className="text-xl mb-4 hover:bg-gray-700 hover:text-blue-400 px-4 py-2 rounded-lg transition-all duration-300">
           Total Users
       </p>
                   </Link>
       <p className="text-xl mb-4 hover:bg-gray-700 hover:text-green-400 px-4 py-2 rounded-lg transition-all duration-300">
           Total Enquiries
       </p>
       <Link to="/staffs-bill-form">
       <p className="text-xl mb-4 hover:bg-gray-700 hover:text-pink-400 px-4 py-2 rounded-lg transition-all duration-300">
           Client Bill Form
       </p>
       </Link>
       <p className="text-xl mb-4 hover:bg-gray-700 hover:text-purple-400 px-4 py-2 rounded-lg transition-all duration-300">
           Total Users
       </p>
           
               </div>
  )
}

export default LeftSideBar
