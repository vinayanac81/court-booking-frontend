import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BaseUrl } from "../Constants/BaseUrl";
import toast from "react-hot-toast";

const SignupBox = ({ handleBox }) => {
  const [signupData, setsignupData] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const {data}=await axios.post(`${BaseUrl}/auth/signup`,{signupData})
    console.log(data);
     if(data.success){
      toast.success(data.message)
      handleBox("login")
     }else if(data.success===false)(
      toast.error(data.message)
     )
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="flex min-h-full flex-1 flex-col items-center h-screen justify-center px-6 py-5 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className=" text-center  text-2xl font-bold leading-9 tracking-tight ">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex gap-4">
              <div className="1/2">
                <label
                  htmlFor="fName"
                  className="block text-sm font-medium leading-6"
                >
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    id="fName"
                    name="fName"
                    type="text"
                    value={signupData.fName}
                    onChange={(e) =>
                      setsignupData({ ...signupData, fName: e.target.value })
                    }
                    autoComplete="fName"
                    required
                    className="block px-2 font-bold w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="1/2">
                <label
                  htmlFor="lName"
                  className="block text-sm font-medium leading-6"
                >
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    id="lName"
                    name="lName"
                    type="text"
                    value={signupData.lName}
                    onChange={(e) =>
                      setsignupData({ ...signupData, lName: e.target.value })
                    }
                    autoComplete="lName"
                    required
                    className="block px-2 font-bold w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={signupData.email}
                  onChange={(e) =>
                    setsignupData({ ...signupData, email: e.target.value })
                  }
                  autoComplete="email"
                  required
                  className="block px-2 font-bold w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 "
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={signupData.password}
                  onChange={(e) =>
                    setsignupData({ ...signupData, password: e.target.value })
                  }
                  autoComplete="current-password"
                  required
                  className="block px-2 font-bold w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={signupData.confirmPassword}
                  onChange={(e) =>
                    setsignupData({
                      ...signupData,
                      confirmPassword: e.target.value,
                    })
                  }
                  autoComplete="confirmPassword"
                  required
                  className="block px-2 font-bold w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </form>
          <p className="mt-2 text-center text-sm text-gray-500">
            Already Registered?{" "}
            <button
              onClick={() => handleBox("login")}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupBox;
