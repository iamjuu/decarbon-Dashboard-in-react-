import React from "react";
import { useNavigate,Link } from "react-router-dom";

const Index = () => {

    return (
        <div className="flex w-[100%] h-screen bg-gray-900 text-white">
            {/* Left Side */}
            <div className=" w-[20%]  bg-gray-800  flex-col items-center justify-center p-8">
                <Link to='/users'>
            <p className="text-xl mb-4 hover:bg-gray-700 hover:text-blue-400 px-4 py-2 rounded-lg transition-all duration-300">
        Total Users
    </p>
                </Link>
    <p className="text-xl mb-4 hover:bg-gray-700 hover:text-green-400 px-4 py-2 rounded-lg transition-all duration-300">
        Total Enquiries
    </p>
    <p className="text-xl mb-4 hover:bg-gray-700 hover:text-pink-400 px-4 py-2 rounded-lg transition-all duration-300">
        Client Bill Form
    </p>
    <p className="text-xl mb-4 hover:bg-gray-700 hover:text-purple-400 px-4 py-2 rounded-lg transition-all duration-300">
        Total Users
    </p>
        
            </div>

            {/* Right Side */}
            <div className="flex items-center justify-center p-8">
                <h1 className="text-4xl font-bold">This is Shaff's Landing Page</h1>
            </div>
        </div>
    );
};

export default Index;
