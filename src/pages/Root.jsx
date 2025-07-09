import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router";
import Footer from "../components/Footer";

const Root = () => {
  return (
    <div>
      <div className="md:w-[80%] mx-auto">
        <Navbar />
      </div>
      <div className="md:w-[80%] mx-auto">
        <Outlet />
      </div>
      <div className="md:w-[80%] mx-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Root;
