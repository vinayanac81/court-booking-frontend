import React from "react";

import { Navigate, Outlet } from "react-router-dom";

export function UserAuth() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  return token ? <Outlet /> : <Navigate to={"/"} />;
}
export function AdminAuth() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  return token && user.role === 1 ? <Outlet /> : <Navigate to={"/"} />;
}
export function LoginAuth() {
  const token = localStorage.getItem("token");
  return( token ? <Navigate to={"/home"} /> : <Outlet />)
 
}
