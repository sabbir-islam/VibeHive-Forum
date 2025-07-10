import React, { use } from "react";
import { AuthContext } from "./authContext";
import { Navigate, useLocation } from "react-router";

const PrivateRoute = ({ children }) => {
  const { currentUser } = use(AuthContext);
  const location = useLocation();


  if (currentUser && currentUser?.email) {
    return children;
  }
  return <Navigate state={location.pathname} to={"/login"}></Navigate>;
};

export default PrivateRoute;
