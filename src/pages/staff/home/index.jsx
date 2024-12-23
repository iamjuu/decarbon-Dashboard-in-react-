import React from "react";
import { useNavigate,Link } from "react-router-dom";
import LeftSide from './LeftSideBar'
const Index = () => {

    return (
        <div className="flex w-[100%] h-screen bg-gray-900 text-white">
            {/* Left Side */}
          <LeftSide/>

            {/* Right Side */}
            <div className="flex items-center justify-center p-8">
                <h1 className="text-4xl font-bold">This is Shaff's Landing Page</h1>
            </div>
        </div>
    );
};

export default Index;
