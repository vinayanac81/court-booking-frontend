/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */

import React from "react";
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";
const AuthProtectedRoute = (props) => {
  if (localStorage.getItem("token")) {
    toast.error("Already Login");

    return <Navigate to="/home" />;
  }

  return props.children;
};

export default AuthProtectedRoute;
