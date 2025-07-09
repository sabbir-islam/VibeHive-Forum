import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router";
import Footer from "../components/Footer";

const Root = () => {
  return (
    <div>
      <div className="mx-auto">
        <Navbar />
      </div>
      <div className="mx-auto">
        <Outlet />
      </div>
      <div className="mx-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Root;
