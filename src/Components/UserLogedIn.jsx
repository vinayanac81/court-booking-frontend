/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */

import React from "react";
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";
const UserLogedIn = (props) => {
  if (localStorage.getItem("token")) {
    return props.children;
  }
  toast.error("You have no account, Please Login");
  return <Navigate to="/login" />;
};

export default UserLogedIn;
