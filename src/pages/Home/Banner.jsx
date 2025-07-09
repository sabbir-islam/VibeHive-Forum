import React, { useState } from "react";
import bgImage from '../../assets/b1.svg';
const Banner = () => {
    const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    console.log("Search text:", searchText);
  };
  return (
    <div>
      <div
        className="relative  h-[600px] flex items-center justify-center px-4 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-900 bg-opacity-80"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto w-full px-6">
          {/* Left Content */}
          <div className="text-center md:text-left md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to the Forum
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Share your favorite opinion!
            </p>

            {/* Search Input with Button */}
            <div className="flex max-w-md mx-auto md:mx-0">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Type your search here..."
                className="bg-white flex-1 px-4 py-3 rounded-l-md text-lg border-0 focus:outline-none focus:ring-2  placeholder-gray-400"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-[#3B82DE] hover:bg-[#3b56debc] text-white font-medium text-lg rounded-r-md transition-colors duration-200 cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="mt-10 md:mt-0 md:w-1/3">
           <div className="bg-slate-800 bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 text-[#3B82DE] shadow-lg border border-slate-800 border-opacity-20">
            <ul className="space-y-4">
                <li className="flex justify-between items-center">
                    <span className="font-medium">Registered Users</span>
                    <span className="font-bold">1</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="font-medium">Forums</span>
                    <span className="font-bold">6</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="font-medium">Topics</span>
                    <span className="font-bold">19</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="font-medium">Replies</span>
                    <span className="font-bold">60</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="font-medium">Topic Tags</span>
                    <span className="font-bold">21</span>
                </li>
            </ul>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
